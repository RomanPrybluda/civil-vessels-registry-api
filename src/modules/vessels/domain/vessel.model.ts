import { ImoNumber } from './imo-number.value-object';
import {
  VesselEquipment,
  VesselEquipmentPersistencePayload,
  type VesselEquipmentProps,
} from './vessel-equipment.value-object';
import { VesselDimensions } from './vessel-dimensions.value-object';
export type { VesselEquipmentProps } from './vessel-equipment.value-object';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface VesselModelProps {
  name: string;
  imoNumber: string;
  vesselType: string;
  length: number;
  breadth: number;
  depth?: number | null;
  draft?: number | null;
  deadweight?: number | null;
  grossTonnage?: number | null;
  iceClass?: string | null;
  builtYear: number;
  classificationSocietyId?: string | null;
  manufacturerId?: string | null;
  shipbuilderId?: string | null;
  mainEngines?: VesselEquipmentProps[];
  auxiliaryEngines?: VesselEquipmentProps[];
  shaftGenerators?: VesselEquipmentProps[];
}

export interface VesselBasePersistencePayload {
  name: string;
  imoNumber: string;
  vesselType: string;
  length: number;
  breadth: number;
  depth: number | null;
  draft: number | null;
  deadweight: number | null;
  grossTonnage: number | null;
  iceClass: string | null;
  builtYear: number;
  classificationSocietyId: string | null;
  manufacturerId: string | null;
  shipbuilderId: string | null;
}

export interface VesselEquipmentCollectionsPersistencePayload {
  mainEngines: VesselEquipmentPersistencePayload[];
  auxiliaryEngines: VesselEquipmentPersistencePayload[];
  shaftGenerators: VesselEquipmentPersistencePayload[];
}

export interface VesselPersistencePayload {
  vessel: VesselBasePersistencePayload;
  equipment: VesselEquipmentCollectionsPersistencePayload;
}

export class Vessel {
  private constructor(
    private readonly nameValue: string,
    private readonly imoNumberValue: ImoNumber,
    private readonly vesselTypeValue: string,
    private readonly dimensionsValue: VesselDimensions,
    private readonly deadweightValue: number | null,
    private readonly grossTonnageValue: number | null,
    private readonly iceClassValue: string | null,
    private readonly builtYearValue: number,
    private readonly classificationSocietyIdValue: string | null,
    private readonly manufacturerIdValue: string | null,
    private readonly shipbuilderIdValue: string | null,
    private readonly mainEnginesValue: VesselEquipment[],
    private readonly auxiliaryEnginesValue: VesselEquipment[],
    private readonly shaftGeneratorsValue: VesselEquipment[],
  ) {}

  static create(props: VesselModelProps): Vessel {
    const name = props.name?.trim();
    if (!name) {
      throw new Error('Vessel name is required');
    }

    const vesselType = props.vesselType?.trim();
    if (!vesselType) {
      throw new Error('Vessel type is required');
    }

    const builtYear = props.builtYear;
    const currentYear = new Date().getFullYear();
    if (
      !Number.isInteger(builtYear) ||
      builtYear < 1900 ||
      builtYear > currentYear
    ) {
      throw new Error(`Built year must be between 1900 and ${currentYear}`);
    }

    if (
      props.deadweight !== undefined &&
      props.deadweight !== null &&
      props.deadweight < 0
    ) {
      throw new Error('Deadweight must be greater than or equal to 0');
    }

    if (
      props.grossTonnage !== undefined &&
      props.grossTonnage !== null &&
      props.grossTonnage < 0
    ) {
      throw new Error('Gross tonnage must be greater than or equal to 0');
    }

    const classificationSocietyId = props.classificationSocietyId ?? null;
    if (
      classificationSocietyId !== null &&
      !UUID_PATTERN.test(classificationSocietyId)
    ) {
      throw new Error('classificationSocietyId must be a valid UUID');
    }

    const manufacturerId = props.manufacturerId ?? null;
    if (manufacturerId !== null && !UUID_PATTERN.test(manufacturerId)) {
      throw new Error('manufacturerId must be a valid UUID');
    }

    const shipbuilderId = props.shipbuilderId ?? null;
    if (shipbuilderId !== null && !UUID_PATTERN.test(shipbuilderId)) {
      throw new Error('shipbuilderId must be a valid UUID');
    }

    const imoNumber = ImoNumber.create(props.imoNumber);
    const dimensions = VesselDimensions.create({
      length: props.length,
      breadth: props.breadth,
      depth: props.depth,
      draft: props.draft,
    });

    return new Vessel(
      name,
      imoNumber,
      vesselType,
      dimensions,
      props.deadweight ?? null,
      props.grossTonnage ?? null,
      props.iceClass?.trim() || null,
      builtYear,
      classificationSocietyId,
      manufacturerId,
      shipbuilderId,
      (props.mainEngines ?? []).map((item) => VesselEquipment.create(item)),
      (props.auxiliaryEngines ?? []).map((item) =>
        VesselEquipment.create(item),
      ),
      (props.shaftGenerators ?? []).map((item) => VesselEquipment.create(item)),
    );
  }

  toPersistence(): VesselPersistencePayload {
    const dimensions = this.dimensionsValue.toObject();

    return {
      vessel: {
        name: this.nameValue,
        imoNumber: this.imoNumberValue.value,
        vesselType: this.vesselTypeValue,
        length: dimensions.length,
        breadth: dimensions.breadth,
        depth: dimensions.depth ?? null,
        draft: dimensions.draft ?? null,
        deadweight: this.deadweightValue,
        grossTonnage: this.grossTonnageValue,
        iceClass: this.iceClassValue,
        builtYear: this.builtYearValue,
        classificationSocietyId: this.classificationSocietyIdValue,
        manufacturerId: this.manufacturerIdValue,
        shipbuilderId: this.shipbuilderIdValue,
      },
      equipment: {
        mainEngines: this.mainEnginesValue.map((item) => item.toPersistence()),
        auxiliaryEngines: this.auxiliaryEnginesValue.map((item) =>
          item.toPersistence(),
        ),
        shaftGenerators: this.shaftGeneratorsValue.map((item) =>
          item.toPersistence(),
        ),
      },
    };
  }
}
