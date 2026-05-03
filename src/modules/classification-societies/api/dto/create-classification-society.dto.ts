import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateClassificationSocietyDto {
  @ApiProperty({ example: 'DNV' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'DNV' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  shortName: string;

  @ApiPropertyOptional({ example: 'Norway' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: 'https://www.dnv.com' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  website?: string;
}
