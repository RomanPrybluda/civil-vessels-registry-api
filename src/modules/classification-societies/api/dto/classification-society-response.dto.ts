import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassificationSociety } from '@prisma/client';

export class ClassificationSocietyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shortName: string;

  @ApiPropertyOptional({ nullable: true })
  country: string | null;

  @ApiPropertyOptional({ nullable: true })
  website: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  static fromEntity(
    entity: ClassificationSociety,
  ): ClassificationSocietyResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      shortName: entity.shortName,
      country: entity.country,
      website: entity.website,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
