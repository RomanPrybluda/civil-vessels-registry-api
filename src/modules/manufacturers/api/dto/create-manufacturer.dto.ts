import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateManufacturerDto {
  @ApiProperty({ example: 'Yanmar' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'Japan' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: 'https://www.yanmar.com' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  website?: string;
}
