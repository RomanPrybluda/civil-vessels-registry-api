import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

const CURRENT_YEAR = new Date().getFullYear();

export enum VesselSortBy {
  NAME = 'name',
  IMO_NUMBER = 'imoNumber',
  VESSEL_TYPE = 'vesselType',
  BUILT_YEAR = 'builtYear',
  DEADWEIGHT = 'deadweight',
  GROSS_TONNAGE = 'grossTonnage',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class VesselListQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({
    description:
      'Matches vessel name, IMO number, or vessel type (case-insensitive for text fields).',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '9123456' })
  @IsOptional()
  @IsString()
  imoNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vesselType?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  classificationSocietyId?: string;

  @ApiPropertyOptional({ example: 2010 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(CURRENT_YEAR)
  builtYearFrom?: number;

  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(CURRENT_YEAR)
  builtYearTo?: number;

  @ApiPropertyOptional({
    enum: VesselSortBy,
    default: VesselSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(VesselSortBy)
  sortBy?: VesselSortBy;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
