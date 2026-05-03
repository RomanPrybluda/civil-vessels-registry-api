import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateClassificationSocietyDto } from '../api/dto/create-classification-society.dto';
import { UpdateClassificationSocietyDto } from '../api/dto/update-classification-society.dto';

@Injectable()
export class ClassificationSocietiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    dto: CreateClassificationSocietyDto,
  ) {
    return this.prisma.classificationSociety.create({
      data: {
        name: dto.name,
        shortName: dto.shortName,
        country: dto.country,
        website: dto.website,
      },
    });
  }

  findAll() {
    return this.prisma.classificationSociety.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.classificationSociety.findUnique({
      where: { id },
    });
  }

  update(
    id: string,
    dto: UpdateClassificationSocietyDto,
  ) {
    return this.prisma.classificationSociety.update({
      where: { id },
      data: {
        name: dto.name,
        shortName: dto.shortName,
        country: dto.country,
        website: dto.website,
      },
    });
  }

  delete(id: string) {
    return this.prisma.classificationSociety.delete({
      where: { id },
    });
  }
}
