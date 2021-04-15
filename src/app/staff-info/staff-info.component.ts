import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {StaffInfoService} from '../shared/services/staff-info.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {IStaff, Staff} from '../shared/modals/staff.model';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {CommonService} from '../shared/services/common.service';
import {GlobalConstants} from "../shared/global-constants";

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
  id: string | undefined;
  staffName: string;
  staffId: any;

  occupationList: any = [
    {id: 'D', value: 'Doctor'},
    {id: 'N', value: 'Nurse'},
    {id: 'C', value: 'Clerk'}
  ];

  // clinicList: any = [
  //   {id: '4', value: 'CLINIC'},
  //   {id: '5', value: 'CLINIC2'}
  // ];

  // branchList: any = [
  //   {id: '4', value: 'BRANCH'}
  // ];
  //
  // branchListEdit: any = [
  //   {id: '4', value: 'BRANCH'}
  // ];

  branchError: boolean = false;
  clinicError: boolean = false;
  occupationError: boolean = false;
  clinicList: any;
  branchList: any;
  branchListEdit: any;
  hide = false;
  clinic: any;
  branch: any;
  occupation: any;
  email: any;
  address: any;
  cNo: any;
  fName: any;

  sampleData: Array<object> = [
    {id: '3', email: 'branch2staff@hotmail.com', name: 'branch2staff', addr: 'WORKER STREET UPDATED', contactNo: '01234567', job: 'D', status: 'I', isAdmin: 'Y', branchId: '4', branchName: 'Tampines', clinicId: '4', clinicName: 'QM Dental'},
    {id: '3', email: 'branch2staff@hotmail.com', name: 'branch2staff', addr: 'WORKER STREET UPDATED', contactNo: '01234567', job: 'D', status: 'A', isAdmin: 'Y', branchId: '4', branchName: 'Tampines', clinicId: '4', clinicName: 'QM Dental'},
    {id: '3', email: 'branch2staff@hotmail.com', name: 'branch2staff', addr: 'WORKER STREET UPDATED', contactNo: '01234567', job: 'D', status: 'P', isAdmin: 'Y', branchId: '4', branchName: 'Tampines', clinicId: '4', clinicName: 'QM Dental'}
  ];
  private _staffInfo: IStaff;
  private _staffInfoEdit: IStaff;
  private statusD: string | Object | null | string;
  private statusA: string | Object | null | string;
  private statusU: string | Object | null | string;
  private statusEdit: any;
  private isAdmin: any;
  private branchMap: Map<string, string>;
  private branchMap2: Map<string, string>;
  private clinicMap: Map<string, string>;
  private occupationMap: Map<string, string>;

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
    this._staffInfoEdit = new class implements IStaff {
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
        // this.dataSource = new MatTableDataSource<any>(this.sampleData);
        if (data === 'ERROR') {
          return;
        }
        // @ts-ignore
        this.dataSource = new MatTableDataSource<any>(data);

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

    this.occupationMap = new Map<string, string>();
    for (let entry of this.occupationList) {
      this.occupationMap.set(entry.id, entry.value);
    }

    this.commonService.retrieveBranchList().subscribe(
      data => {
        console.log(data);
        if (data !== 'ERROR') {
          this.branchList = data;
          this.branchMap = new Map<string, string>();
          for (let entry of this.branchList) {
            this.branchMap.set(entry.id, entry.value);
          }
        }
      });
    this.commonService.retrieveClinicList().subscribe(
      data => {
        console.log(data);
        if (data !== 'ERROR') {
          this.clinicList = data;
          this.clinicMap = new Map<string, string>();
          for (let entry of this.clinicList) {
            this.clinicMap.set(entry.id, entry.value);
          }
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
    this.id = GlobalConstants.login.id;
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
    this.staffInfoService.deleteStaffWithId({id: this.staffId}).subscribe(
      data => {
        console.log(data);
        this.statusD = data;
        if (this.statusD === 'Success') {
          this._success.next(`Successfully removed staff: ` + this.staffName);
        } else {
          this._error.next(`Unable to remove staff!`);
        }
        this.decline();
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
    console.log('this.staffId: ' + this.staffId);
    this.staffInfoService.activatePendingStaff({id: this.staffId}).subscribe(
      data => {
        console.log(data);
        this.statusA = data;
        if (this.statusA === 'Success') {
          this._success.next(`Successfully accepted staff: ` + this.staffName);
        } else {
          this._error.next(`Unable to accept staff!`);
        }
        this.declineAccept();
      });
  }

  declineAccept() {
    this.modalAcceptRef.hide();
    this.staffId = '';
    this.staffName = '';
  }

  editStaff(staff: Staff) {
    console.log('staff: ' + staff);
    this.staffId = staff.id;
    this.fName = staff.name;
    this.cNo = staff.contactNo;
    this.address = staff.addr;
    this.email = staff.email;
    this.occupation = staff.job;
    this.clinic = staff.clinicId;
    this.branch = staff.branchId;
    this.statusEdit = staff.status;
    this.isAdmin = staff.isAdmin;
    // console.log('_staffInfoEdit: ' + this._staffInfoEdit);
    this.modalEditRef = this.modalService.show(this.modalEdit);
  }

  update() {
    console.log('this.staffId: ' + this._staffInfoEdit.id);
    // this._staffInfo.id = this.staffId;
    // this._staffInfo.name = this.fName;
    // this._staffInfo.contactNo = this.cNo;
    // this._staffInfo.addr = this.address;
    // this._staffInfo.email = this.email;
    // this._staffInfo.job = this.occupation;
    // this._staffInfo.clinicId = this.clinic;
    // this._staffInfo.branchId = this.branch;
    // this._staffInfo.status = this.statusEdit;
    // this._staffInfo.isAdmin = this.isAdmin;
    if (this._staffInfoEdit.id !== null || this._staffInfoEdit.id !== '') {
      this.staffInfoService.updateStaff(this._staffInfoEdit).subscribe(
        data => {
          console.log(data);
          this.statusU = data;
          if (this.statusU === 'Success') {
            this._success.next(`Successfully updated staff: ` + this.staffId);
          } else {
            this._error.next(`Unable to update staff!`);
          }
          this.cancel();
        });
    } else {
      this.modalEditRef.hide();
      this._error.next(`Staff Id is not detected!`);
    }
  }

  cancel() {
    this.modalEditRef.hide();
    // this._staffInfoEdit = new class implements IStaff {
    //   id?: string;
    //   email?: string;
    //   name?: string;
    //   addr?: string;
    //   contactNo?: string;
    //   job?: string;
    //   status?: string;
    //   isAdmin?: string;
    //   branchId?: string;
    //   password?: string;
    // };
    this.staffId = '';
    this.isAdmin = null;
    this.statusEdit = null;
    this.clear();
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
  listOfBranchesWithClinicId(id: any) {
    console.log('listOfBranchesWithClinicId: ' + id);
    this.commonService.listOfBranchesWithClinicId({clinicId: id}).subscribe(
      data => {
        console.log(data);
        if (data !== 'ERROR') {
          this.branchListEdit = data;
          this.hide = true;
      }
    });
  }
}
