import {OpenHour} from './open-hour.modal';

export interface IBranchInfo {
  branchName?: string;
  branchTelNo?: string;
  postalCode?: string;
  address?: string;
  openHours?: Array<OpenHour>;
}

export class BranchInfo implements IBranchInfo {
  constructor(
    public branchName?: string,
    public branchTelNo?: string,
    public postalCode?: string,
    public address?: string,
    public openHours?: Array<OpenHour>,
  ) {
    this.branchName = this.branchName || '';
    this.branchTelNo = this.branchTelNo || '';
    this.postalCode = this.postalCode || '';
    this.address = this.address || '';
    this.openHours = this.openHours || new Array<OpenHour>();
  }
}
