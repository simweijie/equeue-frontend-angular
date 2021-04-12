export interface ITestMod {
  status?: string;
}

export class TestMod {
  constructor(
    public status?: string
  ) {
    this.status = this.status || undefined;
  }
}
