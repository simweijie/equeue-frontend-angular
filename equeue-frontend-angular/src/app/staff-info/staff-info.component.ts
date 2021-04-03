import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {StaffInfoService} from '../shared/services/staff-info.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.css']
})
export class StaffInfoComponent implements OnInit {

  modalDelRef: BsModalRef;
  @ViewChild('deleteConfirmation') modalDel: TemplateRef<any>;

  modalAcceptRef: BsModalRef;
  @ViewChild('acceptConfirmation') modalAccept: TemplateRef<any>;

  modalEditRef: BsModalRef;
  @ViewChild('editStaffRecord') modalEdit: TemplateRef<any>;

  displayedColumns: string[] = ['staffName', 'branchId', 'clinic', 'mobileNo', 'occupation', 'btnEdit'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  adminId: string;
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private staffInfoService: StaffInfoService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getId();
    this.staffInfoService.retrieveStaffInfo({staffId: this.adminId}).subscribe(
      data => {
        console.log(data);
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
  }

  getId(): void {
    // this.adminId = this.route.snapshot.paramMap.get('id').toString();
    console.log('adminId');
    console.log(this.adminId);
  }

  removeConfirmation(staffId: any, staffName: any) {
    this.staffId = staffId;
    this.staffName = staffName;
    this.modalDelRef = this.modalService.show(this.modalDel);
  }

  confirmDelete() {
    this.staffInfoService.deleteStaff({staffId: this.adminId}).subscribe(
      data => {
        console.log(data);
        this.modalDelRef.hide();
        this.staffId = null;
      });
  }

  // CLOSE CONFIRMATION MODAL
  decline() {
    this.modalDelRef.hide();
    this.staffId = null;
  }

  acceptConfirmation(staffId: any, staffName: any) {
    this.staffId = staffId;
    this.staffName = staffName;
    this.modalAcceptRef = this.modalService.show(this.modalAccept);
  }

  confirmAccept() {
      this.staffInfoService.acceptStaff({staffId: this.adminId}).subscribe(
        data => {
          console.log(data);
          this.modalAcceptRef.hide();
          this.staffId = null;
        });
  }

  declineAccept() {
    this.modalAcceptRef.hide();
    this.staffId = null;
  }

  editStaff(staffId: any) {
    this.staffId = staffId;
    this.modalAcceptRef = this.modalService.show(this.modalAccept);
  }

  update() {
    this.staffInfoService.deleteStaff({staffId: this.adminId}).subscribe(
      data => {
        console.log(data);
        this.modalEditRef.hide();
        this.staffId = null;
      });
  }

  cancel() {
    this.modalEditRef.hide();
    this.staffId = null;
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
