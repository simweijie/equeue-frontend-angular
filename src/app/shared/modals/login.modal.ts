export interface ILogin {
  id?: string;
  email?: string;
  uin?: string;
  name?: string;
  addr?: string;
  postal?: string;
  contactNo?: string;
  job?: string;
  status?: string;
  isAdmin?: string;
  branchId?: string;
}

export class Login implements ILogin {
  constructor(
    public id?: string,
    public email?: string,
    public uin?: string,
    public name?: string,
    public addr?: string,
    public postal?: string,
    public contactNo?: string,
    public job?: string,
    public status?: string,
    public isAdmin?: string,
    public branchId?: string
  ) {
    // @ts-ignore
    this.id = this.id || null;
    this.email = this.email || '';
    this.uin = this.uin || '';
    this.name = this.name || '';
    this.addr = this.addr || '';
    this.postal = this.postal || '';
    this.contactNo = this.contactNo || '';
    this.job = this.job || '';
    this.status = this.status || '';
    this.isAdmin = this.isAdmin || '';
    this.branchId = this.branchId || '';
  }
}
