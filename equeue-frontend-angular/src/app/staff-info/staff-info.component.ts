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

  displayedColumns: string[] = ['staffName', 'branchId', 'clinic', 'mobileNo', 'occupation', 'btnEdit'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  adminId: string;
  staffName: string;
  staffId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private staffInfoService: StaffInfoService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getId();
    this.staffInfoService.retrieveStaffInfo(this.adminId).subscribe(
      data => {
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

  acceptConfirmation(staffId: any, staffName: any) {
    this.staffId = staffId;
    this.staffName = staffName;
    this.modalAcceptRef = this.modalService.show(this.modalAccept);
  }

  confirmDelete() {
    this.staffInfoService.deleteStaff(this.adminId).subscribe(
      data => {

      });
  }

  // CLOSE CONFIRMATION MODAL
  decline() {
    this.modalDelRef.hide();
  }

  confirmAccept() {
      this.staffInfoService.acceptStaff(this.adminId).subscribe(
        data => {

        });
  }

  declineAccept() {
    this.modalAcceptRef.hide();
  }
}
