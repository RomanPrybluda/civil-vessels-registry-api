import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ClassificationSocietyResponseDto } from '../api/dto/classification-society-response.dto';
import { CreateClassificationSocietyDto } from '../api/dto/create-classification-society.dto';
import { UpdateClassificationSocietyDto } from '../api/dto/update-classification-society.dto';
import { ClassificationSocietiesRepository } from '../infrastructure/classification-societies.repository';

@Injectable()
export class ClassificationSocietiesService {
  constructor(
    private readonly classificationSocietiesRepository: ClassificationSocietiesRepository,
  ) {}

  async create(
    dto: CreateClassificationSocietyDto,
  ): Promise<ClassificationSocietyResponseDto> {
    try {
      const entity = await this.classificationSocietiesRepository.create(dto);
      return ClassificationSocietyResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async findAll(): Promise<ClassificationSocietyResponseDto[]> {
    const entities = await this.classificationSocietiesRepository.findAll();
    return entities.map(
      (
        entity: Parameters<typeof ClassificationSocietyResponseDto.fromEntity>[0],
      ) =>
        ClassificationSocietyResponseDto.fromEntity(entity),
    );
  }

  async findOne(id: string): Promise<ClassificationSocietyResponseDto> {
    const entity = await this.classificationSocietiesRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(
        `Classification society with id ${id} not found`,
      );
    }

    return ClassificationSocietyResponseDto.fromEntity(entity);
  }

  async update(
    id: string,
    dto: UpdateClassificationSocietyDto,
  ): Promise<ClassificationSocietyResponseDto> {
    await this.ensureExists(id);

    try {
      const entity = await this.classificationSocietiesRepository.update(id, dto);
      return ClassificationSocietyResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<ClassificationSocietyResponseDto> {
    await this.ensureExists(id);

    const entity = await this.classificationSocietiesRepository.delete(id);
    return ClassificationSocietyResponseDto.fromEntity(entity);
  }

  private async ensureExists(id: string): Promise<void> {
    const entity = await this.classificationSocietiesRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(
        `Classification society with id ${id} not found`,
      );
    }
  }

  private handleUniqueConstraintError(error: unknown): void {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target;
      const targetFields = Array.isArray(target)
        ? target.join(', ')
        : 'name or shortName';

      throw new ConflictException(
        `Classification society with the same ${targetFields} already exists`,
      );
    }
  }
}
