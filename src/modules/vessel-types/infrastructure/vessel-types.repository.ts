import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateVesselTypeDto } from '../api/dto/create-vessel-type.dto';
import { UpdateVesselTypeDto } from '../api/dto/update-vessel-type.dto';

@Injectable()
export class VesselTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateVesselTypeDto) {
    return this.prisma.vesselType.create({
      data: {
        name: dto.name,
      },
    });
  }

  findAll() {
    return this.prisma.vesselType.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.vesselType.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateVesselTypeDto) {
    return this.prisma.vesselType.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  delete(id: string) {
    return this.prisma.vesselType.delete({
      where: { id },
    });
  }
}
