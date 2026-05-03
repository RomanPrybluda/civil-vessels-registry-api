import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

type VesselWithClassification = Prisma.VesselGetPayload<{
  include: {
    classificationSociety: {
      select: {
        id: true;
        name: true;
        shortName: true;
      };
    };
  };
}>;

class VesselClassificationSocietyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shortName: string;
}

export class VesselResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imoNumber: string;

  @ApiProperty()
  vesselType: string;

  @ApiProperty()
  length: number;

  @ApiProperty()
  breadth: number;

  @ApiPropertyOptional({ nullable: true })
  depth: number | null;

  @ApiPropertyOptional({ nullable: true })
  draft: number | null;

  @ApiPropertyOptional({ nullable: true })
  deadweight: number | null;

  @ApiPropertyOptional({ nullable: true })
  grossTonnage: number | null;

  @ApiPropertyOptional({ nullable: true })
  iceClass: string | null;

  @ApiProperty()
  builtYear: number;

  @ApiPropertyOptional({ nullable: true, format: 'uuid' })
  classificationSocietyId: string | null;

  @ApiPropertyOptional({ type: VesselClassificationSocietyResponseDto, nullable: true })
  classificationSociety: VesselClassificationSocietyResponseDto | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  static fromEntity(entity: VesselWithClassification): VesselResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      imoNumber: entity.imoNumber,
      vesselType: entity.vesselType,
      length: Number(entity.length),
      breadth: Number(entity.breadth),
      depth: entity.depth === null ? null : Number(entity.depth),
      draft: entity.draft === null ? null : Number(entity.draft),
      deadweight: entity.deadweight,
      grossTonnage: entity.grossTonnage,
      iceClass: entity.iceClass,
      builtYear: entity.builtYear,
      classificationSocietyId: entity.classificationSocietyId,
      classificationSociety: entity.classificationSociety
        ? {
            id: entity.classificationSociety.id,
            name: entity.classificationSociety.name,
            shortName: entity.classificationSociety.shortName,
          }
        : null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
