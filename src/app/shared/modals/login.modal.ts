export interface ILogin {
  id?: string;
  job?: string;
  username?: string;
}

export class Login implements ILogin {
  constructor(
    public id?: string,
    public job?: string,
    public username?: string,
  ) {
    // @ts-ignore
    this.id = this.id || null;
    this.job = this.job || '';
    this.username = this.username || '';
  }
}
