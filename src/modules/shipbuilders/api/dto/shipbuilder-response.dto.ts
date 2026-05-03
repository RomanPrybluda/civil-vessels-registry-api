import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

type ShipbuilderEntity = {
  id: string;
  name: string;
  country: string | null;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class ShipbuilderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  country: string | null;

  @ApiPropertyOptional({ nullable: true })
  website: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  static fromEntity(entity: ShipbuilderEntity): ShipbuilderResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      country: entity.country,
      website: entity.website,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
