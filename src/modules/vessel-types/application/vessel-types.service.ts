import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateVesselTypeDto } from '../api/dto/create-vessel-type.dto';
import { UpdateVesselTypeDto } from '../api/dto/update-vessel-type.dto';
import { VesselTypeResponseDto } from '../api/dto/vessel-type-response.dto';
import { VesselTypesRepository } from '../infrastructure/vessel-types.repository';

@Injectable()
export class VesselTypesService {
  constructor(private readonly vesselTypesRepository: VesselTypesRepository) {}

  async create(dto: CreateVesselTypeDto): Promise<VesselTypeResponseDto> {
    try {
      const entity = await this.vesselTypesRepository.create(dto);
      return VesselTypeResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handlePrismaError(error);
      throw error;
    }
  }

  async findAll(): Promise<VesselTypeResponseDto[]> {
    const entities = await this.vesselTypesRepository.findAll();

    return entities.map(
      (entity: Parameters<typeof VesselTypeResponseDto.fromEntity>[0]) =>
        VesselTypeResponseDto.fromEntity(entity),
    );
  }

  async findOne(id: string): Promise<VesselTypeResponseDto> {
    const entity = await this.vesselTypesRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Vessel type with id ${id} not found`);
    }

    return VesselTypeResponseDto.fromEntity(entity);
  }

  async update(
    id: string,
    dto: UpdateVesselTypeDto,
  ): Promise<VesselTypeResponseDto> {
    await this.ensureExists(id);

    try {
      const entity = await this.vesselTypesRepository.update(id, dto);
      return VesselTypeResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handlePrismaError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<VesselTypeResponseDto> {
    await this.ensureExists(id);

    try {
      const entity = await this.vesselTypesRepository.delete(id);
      return VesselTypeResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handlePrismaError(error);
      throw error;
    }
  }

  private async ensureExists(id: string): Promise<void> {
    const entity = await this.vesselTypesRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Vessel type with id ${id} not found`);
    }
  }

  private handlePrismaError(error: unknown): void {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Vessel type with the same name already exists',
      );
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new ConflictException('Vessel type is used by one or more vessels');
    }
  }
}
