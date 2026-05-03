import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVesselTypeDto {
  @ApiProperty({ example: 'Bulk Carrier' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;
}
