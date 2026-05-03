import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateManufacturerDto } from '../api/dto/create-manufacturer.dto';
import { ManufacturerResponseDto } from '../api/dto/manufacturer-response.dto';
import { UpdateManufacturerDto } from '../api/dto/update-manufacturer.dto';
import { ManufacturersRepository } from '../infrastructure/manufacturers.repository';

@Injectable()
export class ManufacturersService {
  constructor(
    private readonly manufacturersRepository: ManufacturersRepository,
  ) {}

  async create(dto: CreateManufacturerDto): Promise<ManufacturerResponseDto> {
    try {
      const entity = await this.manufacturersRepository.create(dto);
      return ManufacturerResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async findAll(): Promise<ManufacturerResponseDto[]> {
    const entities = await this.manufacturersRepository.findAll();
    return entities.map(
      (entity: Parameters<typeof ManufacturerResponseDto.fromEntity>[0]) =>
        ManufacturerResponseDto.fromEntity(entity),
    );
  }

  async findOne(id: string): Promise<ManufacturerResponseDto> {
    const entity = await this.manufacturersRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Manufacturer with id ${id} not found`);
    }

    return ManufacturerResponseDto.fromEntity(entity);
  }

  async update(
    id: string,
    dto: UpdateManufacturerDto,
  ): Promise<ManufacturerResponseDto> {
    await this.ensureExists(id);

    try {
      const entity = await this.manufacturersRepository.update(id, dto);
      return ManufacturerResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<ManufacturerResponseDto> {
    await this.ensureExists(id);

    const entity = await this.manufacturersRepository.delete(id);
    return ManufacturerResponseDto.fromEntity(entity);
  }

  private async ensureExists(id: string): Promise<void> {
    const entity = await this.manufacturersRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Manufacturer with id ${id} not found`);
    }
  }

  private handleUniqueConstraintError(error: unknown): void {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Manufacturer with the same name already exists',
      );
    }
  }
}
