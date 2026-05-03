import { ApiProperty } from '@nestjs/swagger';

type VesselTypeEntity = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export class VesselTypeResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  static fromEntity(entity: VesselTypeEntity): VesselTypeResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
