import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateShipbuilderDto } from '../api/dto/create-shipbuilder.dto';
import { ShipbuilderResponseDto } from '../api/dto/shipbuilder-response.dto';
import { UpdateShipbuilderDto } from '../api/dto/update-shipbuilder.dto';
import { ShipbuildersRepository } from '../infrastructure/shipbuilders.repository';

@Injectable()
export class ShipbuildersService {
  constructor(private readonly shipbuildersRepository: ShipbuildersRepository) {}

  async create(dto: CreateShipbuilderDto): Promise<ShipbuilderResponseDto> {
    try {
      const entity = await this.shipbuildersRepository.create(dto);
      return ShipbuilderResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async findAll(): Promise<ShipbuilderResponseDto[]> {
    const entities = await this.shipbuildersRepository.findAll();
    return entities.map(
      (entity: Parameters<typeof ShipbuilderResponseDto.fromEntity>[0]) =>
        ShipbuilderResponseDto.fromEntity(entity),
    );
  }

  async findOne(id: string): Promise<ShipbuilderResponseDto> {
    const entity = await this.shipbuildersRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Shipbuilder with id ${id} not found`);
    }

    return ShipbuilderResponseDto.fromEntity(entity);
  }

  async update(
    id: string,
    dto: UpdateShipbuilderDto,
  ): Promise<ShipbuilderResponseDto> {
    await this.ensureExists(id);

    try {
      const entity = await this.shipbuildersRepository.update(id, dto);
      return ShipbuilderResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<ShipbuilderResponseDto> {
    await this.ensureExists(id);

    const entity = await this.shipbuildersRepository.delete(id);
    return ShipbuilderResponseDto.fromEntity(entity);
  }

  private async ensureExists(id: string): Promise<void> {
    const entity = await this.shipbuildersRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Shipbuilder with id ${id} not found`);
    }
  }

  private handleUniqueConstraintError(error: unknown): void {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Shipbuilder with the same name already exists',
      );
    }
  }
}
