import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import {
  SortOrder,
  VesselListQueryDto,
  VesselSortBy,
} from '../api/dto/vessel-list-query.dto';
import {
  VesselEquipmentCollectionsPersistencePayload,
  VesselPersistencePayload,
} from '../domain/vessel.model';

type VesselTextFilter = {
  contains: string;
  mode?: 'insensitive';
};

type VesselWhereInput = {
  name?: VesselTextFilter;
  imoNumber?: { contains: string };
  vesselType?: VesselTextFilter;
  classificationSocietyId?: string;
  manufacturerId?: string;
  shipbuilderId?: string;
  builtYear?: {
    gte?: number;
    lte?: number;
  };
  OR?: Array<{
    name?: VesselTextFilter;
    imoNumber?: { contains: string };
    vesselType?: VesselTextFilter;
  }>;
};

type VesselOrderByWithRelationInput = {
  name?: SortOrder;
  imoNumber?: SortOrder;
  vesselType?: SortOrder;
  builtYear?: SortOrder;
  deadweight?: SortOrder;
  grossTonnage?: SortOrder;
  createdAt?: SortOrder;
};

type VesselClassificationSocietyDetails = {
  id: string;
  name: string;
  shortName: string;
} | null;

type VesselManufacturerDetails = {
  id: string;
  name: string;
  country: string | null;
  website: string | null;
} | null;

type VesselShipbuilderDetails = {
  id: string;
  name: string;
  country: string | null;
  website: string | null;
} | null;

type VesselEquipmentDetails = {
  id: string;
  manufacturerId: string | null;
  model: string | null;
  quantity: number;
  powerKw: number;
  totalPowerKw: number;
  manufacturer: VesselManufacturerDetails;
  createdAt: Date;
  updatedAt: Date;
};

export type VesselWithDetails = {
  id: string;
  name: string;
  imoNumber: string;
  vesselType: string;
  length: unknown;
  breadth: unknown;
  depth: unknown | null;
  draft: unknown | null;
  deadweight: number | null;
  grossTonnage: number | null;
  iceClass: string | null;
  builtYear: number;
  classificationSocietyId: string | null;
  classificationSociety: VesselClassificationSocietyDetails;
  manufacturerId: string | null;
  manufacturer: VesselManufacturerDetails;
  shipbuilderId: string | null;
  shipbuilder: VesselShipbuilderDetails;
  mainEngines: VesselEquipmentDetails[];
  auxiliaryEngines: VesselEquipmentDetails[];
  shaftGenerators: VesselEquipmentDetails[];
  createdAt: Date;
  updatedAt: Date;
};

type VesselTransactionClient = Pick<
  PrismaService,
  'vessel' | 'vesselMainEngine' | 'vesselAuxiliaryEngine' | 'vesselShaftGenerator'
>;

const vesselWithDetailsInclude = {
  classificationSociety: {
    select: {
      id: true,
      name: true,
      shortName: true,
    },
  },
  manufacturer: {
    select: {
      id: true,
      name: true,
      country: true,
      website: true,
    },
  },
  shipbuilder: {
    select: {
      id: true,
      name: true,
      country: true,
      website: true,
    },
  },
  mainEngines: {
    include: {
      manufacturer: {
        select: {
          id: true,
          name: true,
          country: true,
          website: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
  auxiliaryEngines: {
    include: {
      manufacturer: {
        select: {
          id: true,
          name: true,
          country: true,
          website: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
  shaftGenerators: {
    include: {
      manufacturer: {
        select: {
          id: true,
          name: true,
          country: true,
          website: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

export interface VesselListOptions {
  query: VesselListQueryDto;
  page: number;
  pageSize: number;
  sortBy: VesselSortBy;
  sortOrder: SortOrder;
}

export interface VesselListResult {
  items: VesselWithDetails[];
  totalItems: number;
}

@Injectable()
export class VesselsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(options: VesselListOptions): Promise<VesselListResult> {
    const where = this.buildWhere(options.query);
    const orderBy = this.buildOrderBy(options.sortBy, options.sortOrder);
    const skip = (options.page - 1) * options.pageSize;

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.vessel.findMany({
        where,
        include: vesselWithDetailsInclude,
        orderBy,
        skip,
        take: options.pageSize,
      }),
      this.prisma.vessel.count({ where }),
    ]);

    return { items, totalItems };
  }

  findById(id: string): Promise<VesselWithDetails | null> {
    return this.prisma.vessel.findUnique({
      where: { id },
      include: vesselWithDetailsInclude,
    });
  }

  findByImoNumber(imoNumber: string): Promise<VesselWithDetails | null> {
    return this.prisma.vessel.findUnique({
      where: { imoNumber },
      include: vesselWithDetailsInclude,
    });
  }

  create(payload: VesselPersistencePayload): Promise<VesselWithDetails> {
    return this.prisma.$transaction(async (tx: VesselTransactionClient) => {
      const vessel = await tx.vessel.create({
        data: payload.vessel,
        select: { id: true },
      });

      await this.createEquipmentCollections(tx, vessel.id, payload.equipment);

      return tx.vessel.findUniqueOrThrow({
        where: { id: vessel.id },
        include: vesselWithDetailsInclude,
      });
    });
  }

  update(id: string, payload: VesselPersistencePayload): Promise<VesselWithDetails> {
    return this.prisma.$transaction(async (tx: VesselTransactionClient) => {
      await tx.vessel.update({
        where: { id },
        data: payload.vessel,
      });

      await this.deleteEquipmentCollections(tx, id);
      await this.createEquipmentCollections(tx, id, payload.equipment);

      return tx.vessel.findUniqueOrThrow({
        where: { id },
        include: vesselWithDetailsInclude,
      });
    });
  }

  delete(id: string): Promise<VesselWithDetails> {
    return this.prisma.vessel.delete({
      where: { id },
      include: vesselWithDetailsInclude,
    });
  }

  async classificationSocietyExists(id: string): Promise<boolean> {
    const entity = await this.prisma.classificationSociety.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(entity);
  }

  async shipbuilderExists(id: string): Promise<boolean> {
    const entity = await this.prisma.shipbuilder.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(entity);
  }

  async manufacturerExists(id: string): Promise<boolean> {
    const entity = await this.prisma.manufacturer.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(entity);
  }

  async manufacturersExist(ids: string[]): Promise<boolean> {
    if (ids.length === 0) {
      return true;
    }

    const uniqueIds = [...new Set(ids)];
    const count = await this.prisma.manufacturer.count({
      where: {
        id: {
          in: uniqueIds,
        },
      },
    });

    return count === uniqueIds.length;
  }

  private buildWhere(query: VesselListQueryDto): VesselWhereInput {
    const where: VesselWhereInput = {};

    if (query.name) {
      where.name = {
        contains: query.name,
        mode: 'insensitive',
      };
    }

    if (query.imoNumber) {
      where.imoNumber = {
        contains: query.imoNumber,
      };
    }

    if (query.vesselType) {
      where.vesselType = {
        contains: query.vesselType,
        mode: 'insensitive',
      };
    }

    if (query.classificationSocietyId) {
      where.classificationSocietyId = query.classificationSocietyId;
    }

    if (query.manufacturerId) {
      where.manufacturerId = query.manufacturerId;
    }

    if (query.shipbuilderId) {
      where.shipbuilderId = query.shipbuilderId;
    }

    if (query.builtYearFrom !== undefined || query.builtYearTo !== undefined) {
      where.builtYear = {};

      if (query.builtYearFrom !== undefined) {
        where.builtYear.gte = query.builtYearFrom;
      }

      if (query.builtYearTo !== undefined) {
        where.builtYear.lte = query.builtYearTo;
      }
    }

    if (query.search) {
      const search = query.search.trim();

      if (search) {
        where.OR = [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            imoNumber: {
              contains: search,
            },
          },
          {
            vesselType: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }
    }

    return where;
  }

  private buildOrderBy(
    sortBy: VesselSortBy,
    sortOrder: SortOrder,
  ): VesselOrderByWithRelationInput {
    switch (sortBy) {
      case VesselSortBy.NAME:
        return { name: sortOrder };
      case VesselSortBy.IMO_NUMBER:
        return { imoNumber: sortOrder };
      case VesselSortBy.VESSEL_TYPE:
        return { vesselType: sortOrder };
      case VesselSortBy.BUILT_YEAR:
        return { builtYear: sortOrder };
      case VesselSortBy.DEADWEIGHT:
        return { deadweight: sortOrder };
      case VesselSortBy.GROSS_TONNAGE:
        return { grossTonnage: sortOrder };
      case VesselSortBy.CREATED_AT:
      default:
        return { createdAt: sortOrder };
    }
  }

  private async deleteEquipmentCollections(
    tx: VesselTransactionClient,
    vesselId: string,
  ): Promise<void> {
    await tx.vesselMainEngine.deleteMany({ where: { vesselId } });
    await tx.vesselAuxiliaryEngine.deleteMany({ where: { vesselId } });
    await tx.vesselShaftGenerator.deleteMany({ where: { vesselId } });
  }

  private async createEquipmentCollections(
    tx: VesselTransactionClient,
    vesselId: string,
    equipment: VesselEquipmentCollectionsPersistencePayload,
  ): Promise<void> {
    if (equipment.mainEngines.length > 0) {
      await tx.vesselMainEngine.createMany({
        data: equipment.mainEngines.map((item) => ({ ...item, vesselId })),
      });
    }

    if (equipment.auxiliaryEngines.length > 0) {
      await tx.vesselAuxiliaryEngine.createMany({
        data: equipment.auxiliaryEngines.map((item) => ({ ...item, vesselId })),
      });
    }

    if (equipment.shaftGenerators.length > 0) {
      await tx.vesselShaftGenerator.createMany({
        data: equipment.shaftGenerators.map((item) => ({ ...item, vesselId })),
      });
    }
  }
}
