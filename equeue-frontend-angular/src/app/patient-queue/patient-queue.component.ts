import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {PatientQueueService} from '../shared/services/patient-queue.service';
import {MatAccordion} from "@angular/material/expansion";

@Component({
  selector: 'app-patient-queue',
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css']
})
export class PatientQueueComponent implements OnInit {

  displayedConsulation: string[] = ['patientName', 'mobile', 'btnEdit'];
  dataSourceConsulation: MatTableDataSource<any>;

  displayedMedicalPayment: string[] = ['patientName', 'mobile', 'btnEdit'];
  dataSourceMedicalPayment: MatTableDataSource<any>;

  displayedQueue: string[] = ['patientName', 'mobile', 'btnEdit'];
  dataSourceQueue: MatTableDataSource<any>;

  displayedMissedQueue: string[] = ['patientName', 'mobile', 'btnEdit'];
  dataSourceMissedQueue: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  sampleData: Array<object> = [
    {patientId: 'P1', patientName: 'Patient 1', mobileNo: '98765431'},
    {patientId: 'P2', patientName: 'Patient 2', mobileNo: '98765432'},
    {patientId: 'P3', patientName: 'Patient 3', mobileNo: '98765433'}
  ];

  // i = 0;
  // j = 0;
  // k = 0;
  // s = 0;
  staffId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private patientQueueService: PatientQueueService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    // this.i = 0;
    // this.j = 0;
    // this.k = 0;
    // this.s = 0;
    this.getStaffId();
    this.consulationRmList();
    this.queueList();
    this.medicalPaymentList();
    this.missedQueueList();
  }

  getStaffId() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.adminId = params['adminId'];
    // });
    this.staffId = this.activatedRoute.snapshot.paramMap.get('staffId');
    console.log('getStaffId - staffId:');
    console.log(this.staffId);
  }

  queueList() {
    this.patientQueueService.queueList({staffId: this.staffId}).subscribe(
      data => {
        console.log(data);
        this.dataSourceQueue = new MatTableDataSource<any>(this.sampleData);
        this.dataSourceQueue.paginator = this.paginator;
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

  medicalPaymentList() {
    this.patientQueueService.medicalPaymentList({staffId: this.staffId}).subscribe(
      data => {
        console.log(data);
        this.dataSourceMedicalPayment = new MatTableDataSource<any>(this.sampleData);
        this.dataSourceMedicalPayment.paginator = this.paginator;
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

  missedQueueList() {
    this.patientQueueService.missedQueueList({staffId: this.staffId}).subscribe(
      data => {
        console.log(data);
        this.dataSourceMissedQueue = new MatTableDataSource<any>(this.sampleData);
        this.dataSourceMissedQueue.paginator = this.paginator;
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

  consulationRmList() {
    this.patientQueueService.consulationRmList({staffId: this.staffId}).subscribe(
      data => {
        console.log(data);
        this.dataSourceConsulation = new MatTableDataSource<any>(this.sampleData);
        this.dataSourceConsulation.paginator = this.paginator;
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

  queue(patientId: any) {
    this.patientQueueService.queue({patientId: patientId}).subscribe(
      data => {
        console.log(data);

      });
  }

  medicalPayment(patientId: any) {
    this.patientQueueService.medicalPayment({patientId: patientId}).subscribe(
      data => {
        console.log(data);

      });
  }

  consult(patientId: any) {
    this.patientQueueService.consult({patientId: patientId}).subscribe(
      data => {
        console.log(data);

      });
  }

  completed(patientId: any) {
    this.patientQueueService.completed({patientId: patientId}).subscribe(
      data => {
        console.log(data);

      });
  }

  missedQueue(patientId: any) {
    this.patientQueueService.missedQueue({patientId: patientId}).subscribe(
      data => {
        console.log(data);

      });
  }

  rejoinQueue(patientId: any) {
    this.patientQueueService.rejoinQueue({patientId: patientId}).subscribe(
      data => {
        console.log(data);

      });
  }

  // count(index: any) {
  //   console.log('this.i' + this.i);
  //   console.log('this.j' + this.j);
  //   console.log('this.k' + this.k);
  //   console.log('this.s' + this.s);
  //   if (index === 1) {
  //     return this.i = this.i + 1;
  //   }
  //   if (index === 2) {
  //     return this.j = this.j + 1;
  //   }
  //   if (index === 3) {
  //     return this.k = this.k + 1;
  //   }
  //   if (index === 4) {
  //     return this.s = this.s + 1;
  //   }
  // }
}
