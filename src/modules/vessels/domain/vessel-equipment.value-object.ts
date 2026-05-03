const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface VesselEquipmentProps {
  manufacturerId?: string | null;
  model?: string | null;
  quantity: number;
  powerKw: number;
}

export interface VesselEquipmentPersistencePayload {
  manufacturerId: string | null;
  model: string | null;
  quantity: number;
  powerKw: number;
  totalPowerKw: number;
}

export class VesselEquipment {
  private constructor(
    private readonly manufacturerIdValue: string | null,
    private readonly modelValue: string | null,
    private readonly quantityValue: number,
    private readonly powerKwValue: number,
  ) {}

  static create(props: VesselEquipmentProps): VesselEquipment {
    if (!Number.isInteger(props.quantity) || props.quantity < 0) {
      throw new Error('Equipment quantity must be greater than or equal to 0');
    }

    if (!Number.isInteger(props.powerKw) || props.powerKw < 0) {
      throw new Error('Equipment powerKw must be greater than or equal to 0');
    }

    const manufacturerId = props.manufacturerId ?? null;
    if (manufacturerId !== null && !UUID_PATTERN.test(manufacturerId)) {
      throw new Error('Equipment manufacturerId must be a valid UUID');
    }

    return new VesselEquipment(
      manufacturerId,
      props.model?.trim() || null,
      props.quantity,
      props.powerKw,
    );
  }

  toPersistence(): VesselEquipmentPersistencePayload {
    return {
      manufacturerId: this.manufacturerIdValue,
      model: this.modelValue,
      quantity: this.quantityValue,
      powerKw: this.powerKwValue,
      totalPowerKw: this.quantityValue * this.powerKwValue,
    };
  }
}
