import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateShipbuilderDto } from '../api/dto/create-shipbuilder.dto';
import { UpdateShipbuilderDto } from '../api/dto/update-shipbuilder.dto';

@Injectable()
export class ShipbuildersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateShipbuilderDto) {
    return this.prisma.shipbuilder.create({
      data: {
        name: dto.name,
        country: dto.country,
        website: dto.website,
      },
    });
  }

  findAll() {
    return this.prisma.shipbuilder.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.shipbuilder.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateShipbuilderDto) {
    return this.prisma.shipbuilder.update({
      where: { id },
      data: {
        name: dto.name,
        country: dto.country,
        website: dto.website,
      },
    });
  }

  delete(id: string) {
    return this.prisma.shipbuilder.delete({
      where: { id },
    });
  }
}
