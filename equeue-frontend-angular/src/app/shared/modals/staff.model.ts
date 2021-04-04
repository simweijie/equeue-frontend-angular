export interface IStaff {
  id?: string;
  email?: string;
  name?: string;
  addr?: string;
  contactNo?: string;
  job?: string;
  status?: string;
  isAdmin?: string;
  clinicId?: string,
  branchId?: string;
  password?: string;
}

export class Staff implements IStaff {
  constructor(
    public id?: string,
    public email?: string,
    public name?: string,
    public addr?: string,
    public contactNo?: string,
    public job?: string,
    public status?: string,
    public isAdmin?: string,
    public clinicId?: string,
    public branchId?: string,
    public password?: string
  ) {
    // @ts-ignore
    this.id = this.id || null;
    this.email = this.email || '';
    this.name = this.name || '';
    this.addr = this.addr || '';
    this.contactNo = this.contactNo || '';
    this.job = this.job || '';
    this.status = this.status || '';
    this.isAdmin = this.isAdmin || '';
    this.clinicId = this.clinicId || '';
    this.branchId = this.branchId || '';
    this.password = this.password || '';
  }
}
