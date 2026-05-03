import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateVesselDto } from '../api/dto/create-vessel.dto';
import { UpdateVesselDto } from '../api/dto/update-vessel.dto';
import { VesselListQueryDto } from '../api/dto/vessel-list-query.dto';
import { VesselResponseDto } from '../api/dto/vessel-response.dto';
import { Vessel, VesselModelProps } from '../domain/vessel.model';
import {
  VesselWithClassification,
  VesselsRepository,
} from '../infrastructure/vessels.repository';

@Injectable()
export class VesselsService {
  constructor(private readonly vesselsRepository: VesselsRepository) {}

  async create(dto: CreateVesselDto): Promise<VesselResponseDto> {
    await this.ensureClassificationSocietyExists(dto.classificationSocietyId);

    const model = this.createDomainModel(dto);

    try {
      const entity = await this.vesselsRepository.create(model.toPersistence());
      return VesselResponseDto.fromEntity(entity);
    } catch (error) {
      this.handlePrismaError(error);
      throw error;
    }
  }

  async findAll(query: VesselListQueryDto): Promise<VesselResponseDto[]> {
    if (
      query.builtYearFrom !== undefined &&
      query.builtYearTo !== undefined &&
      query.builtYearFrom > query.builtYearTo
    ) {
      throw new BadRequestException('builtYearFrom cannot be greater than builtYearTo');
    }

    const entities = await this.vesselsRepository.findMany(query);
    return entities.map((entity) => VesselResponseDto.fromEntity(entity));
  }

  async findOne(id: string): Promise<VesselResponseDto> {
    const entity = await this.vesselsRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Vessel with id ${id} not found`);
    }

    return VesselResponseDto.fromEntity(entity);
  }

  async findOneByImoNumber(imoNumber: string): Promise<VesselResponseDto> {
    const entity = await this.vesselsRepository.findByImoNumber(imoNumber);

    if (!entity) {
      throw new NotFoundException(`Vessel with IMO number ${imoNumber} not found`);
    }

    return VesselResponseDto.fromEntity(entity);
  }

  async update(id: string, dto: UpdateVesselDto): Promise<VesselResponseDto> {
    const existing = await this.vesselsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Vessel with id ${id} not found`);
    }

    const classificationSocietyId =
      dto.classificationSocietyId !== undefined
        ? dto.classificationSocietyId
        : existing.classificationSocietyId ?? undefined;

    await this.ensureClassificationSocietyExists(classificationSocietyId);

    const model = this.createDomainModel({
      ...this.mapEntityToModelProps(existing),
      ...dto,
      classificationSocietyId,
    });

    try {
      const entity = await this.vesselsRepository.update(id, model.toPersistence());
      return VesselResponseDto.fromEntity(entity);
    } catch (error) {
      this.handlePrismaError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<VesselResponseDto> {
    const existing = await this.vesselsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Vessel with id ${id} not found`);
    }

    const deleted = await this.vesselsRepository.delete(id);
    return VesselResponseDto.fromEntity(deleted);
  }

  private createDomainModel(props: VesselModelProps): Vessel {
    try {
      return Vessel.create(props);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  private async ensureClassificationSocietyExists(
    classificationSocietyId?: string,
  ): Promise<void> {
    if (!classificationSocietyId) {
      return;
    }

    const exists = await this.vesselsRepository.classificationSocietyExists(
      classificationSocietyId,
    );

    if (!exists) {
      throw new BadRequestException(
        `Classification society with id ${classificationSocietyId} does not exist`,
      );
    }
  }

  private mapEntityToModelProps(entity: VesselWithClassification): VesselModelProps {
    return {
      name: entity.name,
      imoNumber: entity.imoNumber,
      vesselType: entity.vesselType,
      length: Number(entity.length),
      breadth: Number(entity.breadth),
      depth: entity.depth === null ? undefined : Number(entity.depth),
      draft: entity.draft === null ? undefined : Number(entity.draft),
      deadweight: entity.deadweight ?? undefined,
      grossTonnage: entity.grossTonnage ?? undefined,
      iceClass: entity.iceClass ?? undefined,
      builtYear: entity.builtYear,
      classificationSocietyId: entity.classificationSocietyId ?? undefined,
    };
  }

  private handlePrismaError(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Vessel with the same IMO number already exists');
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new BadRequestException('Invalid classificationSocietyId');
    }
  }
}
