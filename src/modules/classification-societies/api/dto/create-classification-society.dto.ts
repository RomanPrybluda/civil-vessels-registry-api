import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateClassificationSocietyDto {
  @ApiProperty({ example: 'DNV' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'DNV' })
  @IsString()
  @IsNotEmpty()
  shortName: string;

  @ApiPropertyOptional({ example: 'Norway' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'https://www.dnv.com' })
  @IsOptional()
  @IsUrl()
  website?: string;
}
