import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { VesselListQueryDto } from '../api/dto/vessel-list-query.dto';
import {
  VesselEquipmentCollectionsPersistencePayload,
  VesselPersistencePayload,
} from '../domain/vessel.model';

const vesselWithDetailsInclude = {
  classificationSociety: {
    select: {
      id: true,
      name: true,
      shortName: true,
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
    orderBy: { createdAt: 'asc' },
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
    orderBy: { createdAt: 'asc' },
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
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.VesselInclude;

export type VesselWithDetails = Prisma.VesselGetPayload<{
  include: typeof vesselWithDetailsInclude;
}>;

@Injectable()
export class VesselsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(filters: VesselListQueryDto): Promise<VesselWithDetails[]> {
    const where: Prisma.VesselWhereInput = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters.imoNumber) {
      where.imoNumber = {
        contains: filters.imoNumber,
      };
    }

    if (filters.vesselType) {
      where.vesselType = {
        contains: filters.vesselType,
        mode: 'insensitive',
      };
    }

    if (filters.classificationSocietyId) {
      where.classificationSocietyId = filters.classificationSocietyId;
    }

    if (filters.builtYearFrom !== undefined || filters.builtYearTo !== undefined) {
      where.builtYear = {};

      if (filters.builtYearFrom !== undefined) {
        where.builtYear.gte = filters.builtYearFrom;
      }

      if (filters.builtYearTo !== undefined) {
        where.builtYear.lte = filters.builtYearTo;
      }
    }

    return this.prisma.vessel.findMany({
      where,
      include: vesselWithDetailsInclude,
      orderBy: { createdAt: 'desc' },
    });
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
    return this.prisma.$transaction(async (tx) => {
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
    return this.prisma.$transaction(async (tx) => {
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

  private async deleteEquipmentCollections(
    tx: Prisma.TransactionClient,
    vesselId: string,
  ): Promise<void> {
    await tx.vesselMainEngine.deleteMany({ where: { vesselId } });
    await tx.vesselAuxiliaryEngine.deleteMany({ where: { vesselId } });
    await tx.vesselShaftGenerator.deleteMany({ where: { vesselId } });
  }

  private async createEquipmentCollections(
    tx: Prisma.TransactionClient,
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
