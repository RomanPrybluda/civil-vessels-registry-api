import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateManufacturerDto } from '../api/dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from '../api/dto/update-manufacturer.dto';

@Injectable()
export class ManufacturersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateManufacturerDto) {
    return this.prisma.manufacturer.create({
      data: {
        name: dto.name,
        country: dto.country,
        website: dto.website,
      },
    });
  }

  findAll() {
    return this.prisma.manufacturer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.manufacturer.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateManufacturerDto) {
    return this.prisma.manufacturer.update({
      where: { id },
      data: {
        name: dto.name,
        country: dto.country,
        website: dto.website,
      },
    });
  }

  delete(id: string) {
    return this.prisma.manufacturer.delete({
      where: { id },
    });
  }
}
