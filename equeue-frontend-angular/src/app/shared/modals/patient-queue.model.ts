export interface IPatientQueue {
  id?: string;
  status?: string;
  queueNumber?: string;
  customerId?: string;
  branchId?: string;
  customerName?: string;
  customerContactNo?: string;
}

export class PatientQueue implements IPatientQueue {
  constructor(
    public id?: string,
    public status?: string,
    public queueNumber?: string,
    public customerId?: string,
    public branchId?: string,
    public customerName?: string,
    public customerContactNo?: string
  ) {
    // @ts-ignore
    this.id = this.id || null;
    this.status = this.status || '';
    this.queueNumber = this.queueNumber || '';
    this.customerId = this.customerId || '';
    this.branchId = this.branchId || '';
    this.customerName = this.customerName || '';
    this.customerContactNo = this.customerContactNo || '';
  }
}

