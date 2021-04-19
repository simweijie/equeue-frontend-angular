export interface IOpeningHour {
  dayOfWeek?: string;
  opens?: string;
  closes?: string;
}

  export class OpeningHour implements IOpeningHour {
  constructor(
    public dayOfWeek?: string,
    public opens?: string,
    public closes?: string
  ) {
    this.dayOfWeek = this.dayOfWeek || '';
    this.opens = this.opens || '';
    this.closes = this.closes || '';
  }
}
