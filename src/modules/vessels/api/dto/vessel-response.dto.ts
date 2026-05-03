import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VesselWithDetails } from '../../infrastructure/vessels.repository';
import { SortOrder, VesselSortBy } from './vessel-list-query.dto';

class VesselClassificationSocietyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shortName: string;
}

class VesselShipbuilderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  country: string | null;

  @ApiPropertyOptional({ nullable: true })
  website: string | null;
}

class VesselEquipmentManufacturerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  country: string | null;

  @ApiPropertyOptional({ nullable: true })
  website: string | null;
}

class VesselEquipmentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiPropertyOptional({ nullable: true, format: 'uuid' })
  manufacturerId: string | null;

  @ApiPropertyOptional({ nullable: true })
  model: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  powerKw: number;

  @ApiProperty()
  totalPowerKw: number;

  @ApiPropertyOptional({
    type: VesselEquipmentManufacturerResponseDto,
    nullable: true,
  })
  manufacturer: VesselEquipmentManufacturerResponseDto | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
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

  @ApiPropertyOptional({
    type: VesselClassificationSocietyResponseDto,
    nullable: true,
  })
  classificationSociety: VesselClassificationSocietyResponseDto | null;

  @ApiPropertyOptional({ nullable: true, format: 'uuid' })
  shipbuilderId: string | null;

  @ApiPropertyOptional({ type: VesselShipbuilderResponseDto, nullable: true })
  shipbuilder: VesselShipbuilderResponseDto | null;

  @ApiProperty({ type: VesselEquipmentResponseDto, isArray: true })
  mainEngines: VesselEquipmentResponseDto[];

  @ApiProperty({ type: VesselEquipmentResponseDto, isArray: true })
  auxiliaryEngines: VesselEquipmentResponseDto[];

  @ApiProperty({ type: VesselEquipmentResponseDto, isArray: true })
  shaftGenerators: VesselEquipmentResponseDto[];

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  static fromEntity(entity: VesselWithDetails): VesselResponseDto {
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
      shipbuilderId: entity.shipbuilderId,
      shipbuilder: entity.shipbuilder
        ? {
            id: entity.shipbuilder.id,
            name: entity.shipbuilder.name,
            country: entity.shipbuilder.country,
            website: entity.shipbuilder.website,
          }
        : null,
      mainEngines: entity.mainEngines.map(
        (item: VesselWithDetails['mainEngines'][number]) => ({
        id: item.id,
        manufacturerId: item.manufacturerId,
        model: item.model,
        quantity: item.quantity,
        powerKw: item.powerKw,
        totalPowerKw: item.totalPowerKw,
        manufacturer: item.manufacturer
          ? {
              id: item.manufacturer.id,
              name: item.manufacturer.name,
              country: item.manufacturer.country,
              website: item.manufacturer.website,
            }
          : null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }),
      ),
      auxiliaryEngines: entity.auxiliaryEngines.map(
        (item: VesselWithDetails['auxiliaryEngines'][number]) => ({
        id: item.id,
        manufacturerId: item.manufacturerId,
        model: item.model,
        quantity: item.quantity,
        powerKw: item.powerKw,
        totalPowerKw: item.totalPowerKw,
        manufacturer: item.manufacturer
          ? {
              id: item.manufacturer.id,
              name: item.manufacturer.name,
              country: item.manufacturer.country,
              website: item.manufacturer.website,
            }
          : null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }),
      ),
      shaftGenerators: entity.shaftGenerators.map(
        (item: VesselWithDetails['shaftGenerators'][number]) => ({
        id: item.id,
        manufacturerId: item.manufacturerId,
        model: item.model,
        quantity: item.quantity,
        powerKw: item.powerKw,
        totalPowerKw: item.totalPowerKw,
        manufacturer: item.manufacturer
          ? {
              id: item.manufacturer.id,
              name: item.manufacturer.name,
              country: item.manufacturer.country,
              website: item.manufacturer.website,
            }
          : null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }),
      ),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}

class VesselListPaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  pageSize: number;

  @ApiProperty({ example: 0 })
  totalItems: number;

  @ApiProperty({ example: 0 })
  totalPages: number;
}

class VesselListSortDto {
  @ApiProperty({ enum: VesselSortBy, example: VesselSortBy.CREATED_AT })
  sortBy: VesselSortBy;

  @ApiProperty({ enum: SortOrder, example: SortOrder.DESC })
  sortOrder: SortOrder;
}

export class VesselListResponseDto {
  @ApiProperty({ type: VesselResponseDto, isArray: true })
  items: VesselResponseDto[];

  @ApiProperty({ type: VesselListPaginationDto })
  pagination: VesselListPaginationDto;

  @ApiProperty({ type: VesselListSortDto })
  sort: VesselListSortDto;
}
