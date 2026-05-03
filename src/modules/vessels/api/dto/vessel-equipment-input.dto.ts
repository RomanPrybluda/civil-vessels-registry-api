import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class VesselEquipmentInputDto {
  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  manufacturerId?: string | null;

  @ApiPropertyOptional({ nullable: true, example: '6S50ME-C' })
  @IsOptional()
  @IsString()
  model?: string | null;

  @ApiProperty({ example: 1, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 8200, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  powerKw: number;
}
