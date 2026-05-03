export interface VesselDimensionsProps {
  length: number;
  breadth: number;
  depth?: number | null;
  draft?: number | null;
}

export class VesselDimensions {
  private constructor(private readonly props: VesselDimensionsProps) {}

  static create(props: VesselDimensionsProps): VesselDimensions {
    if (props.length <= 0) {
      throw new Error('Vessel length must be greater than 0');
    }

    if (props.breadth <= 0) {
      throw new Error('Vessel breadth must be greater than 0');
    }

    if (props.depth !== undefined && props.depth !== null && props.depth <= 0) {
      throw new Error('Vessel depth must be greater than 0');
    }

    if (props.draft !== undefined && props.draft !== null && props.draft <= 0) {
      throw new Error('Vessel draft must be greater than 0');
    }

    return new VesselDimensions({
      length: props.length,
      breadth: props.breadth,
      depth: props.depth ?? null,
      draft: props.draft ?? null,
    });
  }

  toObject(): VesselDimensionsProps {
    return {
      length: this.props.length,
      breadth: this.props.breadth,
      depth: this.props.depth ?? null,
      draft: this.props.draft ?? null,
    };
  }
}
