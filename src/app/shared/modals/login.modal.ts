export interface ILogin {
  id?: string;
  job?: string;
}

export class Login implements ILogin {
  constructor(
    public id?: string,
    public job?: string,
  ) {
    // @ts-ignore
    this.id = this.id || null;
    this.job = this.job || '';
  }
}
