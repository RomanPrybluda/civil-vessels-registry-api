import { Injectable } from '@nestjs/common';
import { Prisma, Vessel as PrismaVessel } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { VesselListQueryDto } from '../api/dto/vessel-list-query.dto';
import { VesselPersistencePayload } from '../domain/vessel.model';

const vesselWithClassificationInclude = {
  classificationSociety: {
    select: {
      id: true,
      name: true,
      shortName: true,
    },
  },
} satisfies Prisma.VesselInclude;

export type VesselWithClassification = Prisma.VesselGetPayload<{
  include: typeof vesselWithClassificationInclude;
}>;

@Injectable()
export class VesselsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(filters: VesselListQueryDto): Promise<VesselWithClassification[]> {
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
      include: vesselWithClassificationInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string): Promise<VesselWithClassification | null> {
    return this.prisma.vessel.findUnique({
      where: { id },
      include: vesselWithClassificationInclude,
    });
  }

  findByImoNumber(imoNumber: string): Promise<VesselWithClassification | null> {
    return this.prisma.vessel.findUnique({
      where: { imoNumber },
      include: vesselWithClassificationInclude,
    });
  }

  create(data: VesselPersistencePayload): Promise<VesselWithClassification> {
    return this.prisma.vessel.create({
      data,
      include: vesselWithClassificationInclude,
    });
  }

  update(
    id: string,
    data: VesselPersistencePayload,
  ): Promise<VesselWithClassification> {
    return this.prisma.vessel.update({
      where: { id },
      data,
      include: vesselWithClassificationInclude,
    });
  }

  delete(id: string): Promise<VesselWithClassification> {
    return this.prisma.vessel.delete({
      where: { id },
      include: vesselWithClassificationInclude,
    });
  }

  async classificationSocietyExists(id: string): Promise<boolean> {
    const entity = await this.prisma.classificationSociety.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(entity);
  }
}
