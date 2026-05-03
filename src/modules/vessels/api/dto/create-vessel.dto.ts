import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';

const CURRENT_YEAR = new Date().getFullYear();

export class CreateVesselDto {
  @ApiProperty({ example: 'Black Sea Trader' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '9123456', description: 'Exactly 7 digits' })
  @IsString()
  @Matches(/^\d{7}$/)
  imoNumber: string;

  @ApiProperty({ example: 'Bulk Carrier' })
  @IsString()
  @IsNotEmpty()
  vesselType: string;

  @ApiProperty({ example: 180.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  length: number;

  @ApiProperty({ example: 28.4 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  breadth: number;

  @ApiPropertyOptional({ example: 14.2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  depth?: number;

  @ApiPropertyOptional({ example: 9.1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  draft?: number;

  @ApiPropertyOptional({ example: 35000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  deadweight?: number;

  @ApiPropertyOptional({ example: 22000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  grossTonnage?: number;

  @ApiPropertyOptional({ example: '1C' })
  @IsOptional()
  @IsString()
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
}
