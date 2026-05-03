import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateShipbuilderDto {
  @ApiProperty({ example: 'Hyundai Heavy Industries' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'South Korea' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: 'https://www.hhi.co.kr' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  website?: string;
}
