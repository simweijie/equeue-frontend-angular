export interface IOpenHour {
  day?: string;
  startTime?: string;
  endTime?: string;
}

export class OpenHour implements IOpenHour {
  constructor(
    public day?: string,
    public startTime?: string,
    public endTime?: string
  ) {
    this.day = this.day || '';
    this.startTime = this.startTime || '';
    this.endTime = this.endTime || '';
  }
}
