import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { VesselEquipmentInputDto } from './vessel-equipment-input.dto';

const CURRENT_YEAR = new Date().getFullYear();

export class CreateVesselDto {
  @ApiProperty({ example: 'Black Sea Trader' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '9123456', description: 'Exactly 7 digits' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7}$/)
  imoNumber: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  vesselTypeId: string;

  @ApiProperty({ example: 180.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(500)
  length: number;

  @ApiProperty({ example: 28.4 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(100)
  breadth: number;

  @ApiPropertyOptional({ example: 14.2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(100)
  depth?: number;

  @ApiPropertyOptional({ example: 9.1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(100)
  draft?: number;

  @ApiPropertyOptional({ example: 35000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(500000)
  deadweight?: number;

  @ApiPropertyOptional({ example: 22000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(500000)
  grossTonnage?: number;

  @ApiPropertyOptional({ example: '1C' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  iceClass?: string;

  @ApiProperty({ example: 2015 })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(CURRENT_YEAR)
  builtYear: number;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  classificationSocietyId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  manufacturerId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  shipbuilderId?: string;

  @ApiPropertyOptional({ type: VesselEquipmentInputDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => VesselEquipmentInputDto)
  mainEngines?: VesselEquipmentInputDto[];

  @ApiPropertyOptional({ type: VesselEquipmentInputDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => VesselEquipmentInputDto)
  auxiliaryEngines?: VesselEquipmentInputDto[];

  @ApiPropertyOptional({ type: VesselEquipmentInputDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => VesselEquipmentInputDto)
  shaftGenerators?: VesselEquipmentInputDto[];
}
