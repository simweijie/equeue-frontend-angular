import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {StaffInfoService} from '../shared/services/staff-info.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {IStaff} from '../shared/modals/staff.model';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {CommonService} from '../shared/services/common.service';

@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.css']
})
export class StaffInfoComponent implements OnInit {

  // Toast message
  private _success = new Subject<string>();
  private _error = new Subject<string>();
  successMessage: string;
  errorMessage: string;

  modalDelRef: BsModalRef;
  @ViewChild('deleteConfirmation') modalDel: TemplateRef<any>;

  modalAcceptRef: BsModalRef;
  @ViewChild('acceptConfirmation') modalAccept: TemplateRef<any>;

  modalEditRef: BsModalRef;
  @ViewChild('editStaffRecord') modalEdit: TemplateRef<any>;

  displayedColumns: string[] = ['name', 'branchName', 'clinic', 'mobileNo', 'occupation', 'btnEdit'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  id: string | null;
  staffName: string;
  staffId: any;

  occupationList: Array<object> = [
    {id: 'D', value: 'Doctor'},
    {id: 'N', value: 'Nurse'},
    {id: 'C', value: 'Clerk'}
  ];
  branchError: boolean = false;
  clinicError: boolean = false;
  occupationError: boolean = false;
  clinicList: any;
  branchList: any;
  clinic: any;
  branch: any;
  occupation: any;
  email: any;
  address: any;
  cNo: any;
  fName: any;

  sampleData: Array<object> = [
    {id: '1', name: 'D1', branchName: 'B8', clinicName: 'Hello Clinic', contactNo: '92029102', job: 'D', status: 'I'},
    {id: '2', name: 'D2', branchName: 'B2', clinicName: 'Hello Clinic', contactNo: '92029102', job: 'D', status: 'A'},
    {id: '3', name: 'D3', branchName: 'B1', clinicName: 'Hello Clinic', contactNo: '92029102', job: 'D', status: 'P'}
  ];
  private _staffInfo: IStaff;
  private statusD: string | Object | null | string;
  private statusA: string | Object | null | string;
  private statusU: string | Object | null | string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private staffInfoService: StaffInfoService,
    private modalService: BsModalService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this._staffInfo = new class implements IStaff {
      id?: string;
      email?: string;
      name?: string;
      addr?: string;
      contactNo?: string;
      job?: string;
      status?: string;
      isAdmin?: string;
      branchId?: string;
      password?: string;
    };
    this.getId();
    this.staffInfoService.listOfStaffInClinic({staffId: this.id}).subscribe(
      data => {
        console.log(data);
        this.dataSource = new MatTableDataSource<any>(this.sampleData);
        // if (data === null) {
        //   this._error.next(this.error500);
        // } else {
        //   console.log('Inside the lm-rule-admin.component.ts - data');
        //   this.lmRuleAdminDto = data;
        //   console.log('this.lmRuleAdminDto: ' + this.lmRuleAdminDto.toString());
        //   console.log('this.lmRuleAdminDto.ruleAdminList: ' + this.lmRuleAdminDto.ruleAdminList);
        //   console.log(this.lmRuleAdminDto.ruleAdminList);
        //   console.log('Status: ' + this.lmRuleAdminDto.status);
        //   if (this.lmRuleAdminDto.status === 'S000') {
        //     if (this.lmRuleAdminDto.ruleAdminList !== null) {
        //       this.resultsTable = this.lmRuleAdminDto.ruleAdminList;
        //       this.dataSource = new MatTableDataSource<LmRuleAdmin>(this.lmRuleAdminDto.ruleAdminList);
        //       this.dataSource.paginator = this.paginator;
        //       this.isExpanded = true;
        //       this.isExpanded = true;
        //     } else {
        //       this._error.next(`Error : The List is null`);
        //     }
        //   } else {
        //     this._error.next(`Error Status: ` + this.lmRuleAdminDto.status);
        //   }
        // }
      });

    this.commonService.retrieveBranchList().subscribe(
      data => {
        console.log(data);
        if (data !== 'ERROR') {
          this.branchList = data;
        }
      });
    this.commonService.retrieveClinicList().subscribe(
      data => {
        console.log(data);
        if (data !== 'ERROR') {
          this.clinicList = data;
        }
      });

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(40000)
    ).subscribe(() => this.successMessage = '');

    this._error.subscribe((message) => this.errorMessage = message);
  }

  getId(): void {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.adminId = params['adminId'];
    // });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('id');
    console.log(this.id);
  }

  removeConfirmation(staffId: any, staffName: any) {
    this.staffId = staffId;
    this.staffName = staffName;
    this.modalDelRef = this.modalService.show(this.modalDel);
  }

  confirmDelete() {
    console.log('this.staffId: ' + this.staffId);
    this.staffInfoService.deleteStaff({id: this.staffId}).subscribe(
      data => {
        console.log(data);
        this.statusD = data;
        if (this.statusD === 'Success') {
          this._success.next(`Successfully removed staff: ` + this.staffName);
          this.staffId = '';
          this.staffName = '';
        } else {
          this._error.next(`Unable to remove staff!`);
        }
        this.modalDelRef.hide();
      });
  }

  // CLOSE CONFIRMATION MODAL
  decline() {
    this.modalDelRef.hide();
    this.staffId = '';
    this.staffName = '';
  }

  acceptConfirmation(staffId: any, staffName: any) {
    this.staffId = staffId;
    this.staffName = staffName;
    this.modalAcceptRef = this.modalService.show(this.modalAccept);
  }

  confirmAccept() {
    console.log('this.staffId: ' + this.staffId)
      this.staffInfoService.acceptStaff({id: this.staffId}).subscribe(
        data => {
          console.log(data);
          this.statusA = data;
          if (this.statusA === 'Success') {
            this._success.next(`Successfully accepted staff: ` + this.staffName);
            this.staffId = '';
            this.staffName = '';
          } else {
            this._error.next(`Unable to accept staff!`);
          }
          this.modalAcceptRef.hide();
        });
  }

  declineAccept() {
    this.modalAcceptRef.hide();
    this.staffId = '';
    this.staffName = '';
  }

  editStaff(staffId: any) {
    this.staffId = staffId;
    this.modalEditRef = this.modalService.show(this.modalEdit);
  }

  update() {
    this._staffInfo.id = this.staffId;
    this._staffInfo.name = this.fName;
    this._staffInfo.contactNo = this.cNo;
    this._staffInfo.addr = this.address;
    this._staffInfo.email = this.email;
    this._staffInfo.job = this.occupation;
    this._staffInfo.clinicId = this.clinic;
    this._staffInfo.branchId = this.branch;
    if (this.staffId !== null || this.staffId !== '') {
      this.staffInfoService.updateStaff(this._staffInfo).subscribe(
        data => {
          console.log(data);
          this.statusU = data;
          if (this.statusU === 'Success') {
            this._success.next(`Successfully updated staff: ` + this.staffId);
            this.staffId = '';
          } else {
            this._error.next(`Unable to update staff!`);
          }
          this.modalEditRef.hide();
        });
    } else {
      this.modalEditRef.hide();
      this._error.next(`Staff Id is not detected!`);
    }
  }

  cancel() {
    this.modalEditRef.hide();
    this.staffId = '';
  }

  clear() {
    this.fName = null;
    this.cNo = null;
    this.address = null;
    this.email = null;
    this.occupation = null;
    this.clinic = null;
    this.branch = null;
  }
}
