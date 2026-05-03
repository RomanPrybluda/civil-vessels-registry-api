import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateShipbuilderDto {
  @ApiProperty({ example: 'Hyundai Heavy Industries' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'South Korea' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'https://www.hhi.co.kr' })
  @IsOptional()
  @IsUrl()
  website?: string;
}
