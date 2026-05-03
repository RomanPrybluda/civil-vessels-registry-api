import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateVesselDto } from '../api/dto/create-vessel.dto';
import { UpdateVesselDto } from '../api/dto/update-vessel.dto';
import {
  SortOrder,
  VesselListQueryDto,
  VesselSortBy,
} from '../api/dto/vessel-list-query.dto';
import {
  VesselListResponseDto,
  VesselResponseDto,
} from '../api/dto/vessel-response.dto';
import { Vessel, VesselEquipmentProps, VesselModelProps } from '../domain/vessel.model';
import { VesselWithDetails, VesselsRepository } from '../infrastructure/vessels.repository';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SORT_BY = VesselSortBy.CREATED_AT;
const DEFAULT_SORT_ORDER = SortOrder.DESC;
type VesselPersistencePayload = ReturnType<Vessel['toPersistence']>;
type VesselEquipmentPersistenceItem = VesselPersistencePayload['equipment']['mainEngines'][number];

@Injectable()
export class VesselsService {
  constructor(private readonly vesselsRepository: VesselsRepository) {}

  async create(dto: CreateVesselDto): Promise<VesselResponseDto> {
    await this.ensureClassificationSocietyExists(dto.classificationSocietyId);
    await this.ensureVesselManufacturerExists(dto.manufacturerId);
    await this.ensureShipbuilderExists(dto.shipbuilderId);

    const model = this.createDomainModel(dto);
    const payload = model.toPersistence();

    await this.ensureManufacturersExist(payload);

    try {
      const entity = await this.vesselsRepository.create(payload);
      return VesselResponseDto.fromEntity(entity);
    } catch (error: unknown) {
      this.handlePrismaError(error);
      throw error;
    }
  }

  async findAll(query: VesselListQueryDto): Promise<VesselListResponseDto> {
    if (
      query.builtYearFrom !== undefined &&
      query.builtYearTo !== undefined &&
      query.builtYearFrom > query.builtYearTo
    ) {
      throw new BadRequestException('builtYearFrom cannot be greater than builtYearTo');
    }

    const page = query.page ?? DEFAULT_PAGE;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const sortBy = query.sortBy ?? DEFAULT_SORT_BY;
    const sortOrder = query.sortOrder ?? DEFAULT_SORT_ORDER;

    const { items, totalItems } = await this.vesselsRepository.findMany({
      query,
      page,
      pageSize,
      sortBy,
      sortOrder,
    });

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

    return {
      items: items.map((entity) => VesselResponseDto.fromEntity(entity)),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
      sort: {
        sortBy,
        sortOrder,
      },
    };
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

    const mergedProps = this.mergeVesselProps(existing, dto);

    await this.ensureClassificationSocietyExists(mergedProps.classificationSocietyId ?? undefined);
    await this.ensureVesselManufacturerExists(mergedProps.manufacturerId ?? undefined);
    await this.ensureShipbuilderExists(mergedProps.shipbuilderId ?? undefined);

    const model = this.createDomainModel(mergedProps);
    const payload = model.toPersistence();

    await this.ensureManufacturersExist(payload);

    try {
      const entity = await this.vesselsRepository.update(id, payload);
      return VesselResponseDto.fromEntity(entity);
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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

  private async ensureManufacturersExist(
    payload: VesselPersistencePayload,
  ): Promise<void> {
    const ids = this.collectManufacturerIds(payload);

    if (ids.length === 0) {
      return;
    }

    const allExist = await this.vesselsRepository.manufacturersExist(ids);

    if (!allExist) {
      throw new BadRequestException('One or more manufacturerId values do not exist');
    }
  }

  private async ensureVesselManufacturerExists(
    manufacturerId?: string,
  ): Promise<void> {
    if (!manufacturerId) {
      return;
    }

    const exists = await this.vesselsRepository.manufacturerExists(manufacturerId);

    if (!exists) {
      throw new BadRequestException(
        `Manufacturer with id ${manufacturerId} does not exist`,
      );
    }
  }

  private async ensureShipbuilderExists(shipbuilderId?: string): Promise<void> {
    if (!shipbuilderId) {
      return;
    }

    const exists = await this.vesselsRepository.shipbuilderExists(shipbuilderId);

    if (!exists) {
      throw new BadRequestException(
        `Shipbuilder with id ${shipbuilderId} does not exist`,
      );
    }
  }

  private collectManufacturerIds(
    payload: VesselPersistencePayload,
  ): string[] {
    const ids = [
      ...payload.equipment.mainEngines.map(
        (item: VesselEquipmentPersistenceItem) => item.manufacturerId,
      ),
      ...payload.equipment.auxiliaryEngines.map(
        (item: VesselEquipmentPersistenceItem) => item.manufacturerId,
      ),
      ...payload.equipment.shaftGenerators.map(
        (item: VesselEquipmentPersistenceItem) => item.manufacturerId,
      ),
    ];

    return ids.filter((id): id is string => Boolean(id));
  }

  private mergeVesselProps(
    entity: VesselWithDetails,
    dto: UpdateVesselDto,
  ): VesselModelProps {
    const base = this.mapEntityToModelProps(entity);

    return {
      ...base,
      ...dto,
      mainEngines:
        dto.mainEngines !== undefined
          ? dto.mainEngines
          : base.mainEngines,
      auxiliaryEngines:
        dto.auxiliaryEngines !== undefined
          ? dto.auxiliaryEngines
          : base.auxiliaryEngines,
      shaftGenerators:
        dto.shaftGenerators !== undefined
          ? dto.shaftGenerators
          : base.shaftGenerators,
    };
  }

  private mapEntityToModelProps(entity: VesselWithDetails): VesselModelProps {
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
      manufacturerId: entity.manufacturerId ?? undefined,
      shipbuilderId: entity.shipbuilderId ?? undefined,
      mainEngines: entity.mainEngines.map(
        (item: VesselWithDetails['mainEngines'][number]) => this.mapEquipment(item),
      ),
      auxiliaryEngines: entity.auxiliaryEngines.map(
        (item: VesselWithDetails['auxiliaryEngines'][number]) => this.mapEquipment(item),
      ),
      shaftGenerators: entity.shaftGenerators.map(
        (item: VesselWithDetails['shaftGenerators'][number]) => this.mapEquipment(item),
      ),
    };
  }

  private mapEquipment(item: {
    manufacturerId: string | null;
    model: string | null;
    quantity: number;
    powerKw: number;
  }): VesselEquipmentProps {
    return {
      manufacturerId: item.manufacturerId,
      model: item.model,
      quantity: item.quantity,
      powerKw: item.powerKw,
    };
  }

  private handlePrismaError(error: unknown): void {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Vessel with the same IMO number already exists');
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new BadRequestException('Invalid foreign key reference in vessel payload');
    }
  }
}
