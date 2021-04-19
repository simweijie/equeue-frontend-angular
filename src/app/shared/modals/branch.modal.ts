import { OpeningHour } from './open-hour.modal';

export interface IBranchInfo {
  branchName?: string;
  contactNo?: string;
  postal?: string;
  addr?: string;
  openingHours?: Array<OpeningHour>;
  district?: string;
  latt?: string;
  longt?: string;
}

export class BranchInfo implements IBranchInfo {
  constructor(
    public branchName?: string,
    public contactNo?: string,
    public postal?: string,
    public addr?: string,
    public openingHours?: Array<OpeningHour>,
    public district?: string,
    public latt?: string,
    public longt?: string
  ) {
    this.branchName = this.branchName || '';
    this.contactNo = this.contactNo || '';
    this.postal = this.postal || '';
    this.addr = this.addr || '';
    this.openingHours = this.openingHours || new Array<OpeningHour>();
    this.district = this.district || '';
    this.latt = this.latt || '';
    this.longt = this.longt || '';
  }
}
