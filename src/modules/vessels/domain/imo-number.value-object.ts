export class ImoNumber {
  private constructor(private readonly rawValue: string) {}

  static create(value: string): ImoNumber {
    if (!/^\d{7}$/.test(value)) {
      throw new Error('IMO number must contain exactly 7 digits');
    }

    return new ImoNumber(value);
  }

  get value(): string {
    return this.rawValue;
  }
}
