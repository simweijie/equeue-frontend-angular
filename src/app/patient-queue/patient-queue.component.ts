import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {PatientQueueService} from '../shared/services/patient-queue.service';
import {MatAccordion} from '@angular/material/expansion';
import {debounceTime, takeWhile} from 'rxjs/operators';
import {interval, Subject, Subscription} from 'rxjs';
import {IPatientQueue, PatientQueue} from '../shared/modals/patient-queue.model';
import {GlobalConstants} from '../shared/global-constants';
import {Login} from "../shared/modals/login.modal";
import {CommonService} from "../shared/services/common.service";

@Component({
  selector: 'app-patient-queue',
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css']
})
export class PatientQueueComponent implements OnInit {
  // Toast message
  private _success = new Subject<string>();
  private _error = new Subject<string>();
  successMessage: string;
  errorMessage: string;

  displayedInfo: string[] = ['no', 'patientName', 'mobile', 'btnEdit'];
  dataSourceConsulation: MatTableDataSource<any>;

  // displayedMedicalPayment: string[] = ['no', 'patientName', 'mobile', 'btnEdit'];
  dataSourceMedicalPayment: MatTableDataSource<any>;

  // displayedQueue: string[] = ['no', 'patientName', 'mobile', 'btnEdit'];
  dataSourceQueue: MatTableDataSource<any>;

  // displayedMissedQueue: string[] = ['no', 'patientName', 'mobile', 'btnEdit'];
  dataSourceMissedQueue: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  sampleData: any;
  // sampleData: Array<IPatientQueue> = [
  //   {id: '1', status: 'Q', queueNumber: '31', customerId: '28', branchId: '1', customerName: 'customer1', customerContactNo: '12345678'},
  //   {id: '2', status: 'Q', queueNumber: '32', customerId: '29', branchId: '1', customerName: 'customer2', customerContactNo: '12345678'},
  //   {id: '3', status: 'D', queueNumber: '33', customerId: '30', branchId: '1', customerName: 'customer3', customerContactNo: '12345678'},
  //   {id: '4', status: 'D', queueNumber: '34', customerId: '31', branchId: '1', customerName: 'customer4', customerContactNo: '12345678'},
  //   {id: '5', status: 'P', queueNumber: '35', customerId: '32', branchId: '1', customerName: 'customer5', customerContactNo: '12345678'},
  //   {id: '6', status: 'P', queueNumber: '36', customerId: '33', branchId: '1', customerName: 'customer6', customerContactNo: '12345678'},
  //   {id: '7', status: 'C', queueNumber: '37', customerId: '34', branchId: '1', customerName: 'customer7', customerContactNo: '12345678'},
  //   {id: '8', status: 'C', queueNumber: '38', customerId: '35', branchId: '1', customerName: 'customer8', customerContactNo: '12345678'},
  //   {id: '9', status: 'R', queueNumber: '39', customerId: '36', branchId: '1', customerName: 'customer9', customerContactNo: '12345678'},
  //   {id: '10', status: 'R', queueNumber: '40', customerId: '37', branchId: '1', customerName: 'customer10', customerContactNo: '12345678'},
  //   {id: '11', status: 'M', queueNumber: '41', customerId: '38', branchId: '1', customerName: 'customer11', customerContactNo: '12345678'},
  //   {id: '12', status: 'M', queueNumber: '42', customerId: '39', branchId: '1', customerName: 'customer12', customerContactNo: '12345678'}
  // ];

  queueData: Array<object> = [];
  conData: Array<object> = [];
  mpData: Array<object> = [];
  missData: Array<object> = [];

  // i = 0;
  // j = 0;
  // k = 0;
  // s = 0;
  staffId: any;
  subscription: Subscription;
  login: Login;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private patientQueueService: PatientQueueService,
    private modalService: BsModalService,
    private commonService: CommonService
  ) {this.login = new Login();  }

  ngOnInit(): void {
    // this.i = 0;
    // this.j = 0;
    // this.k = 0;
    // this.s = 0;
    this.getInfo();
    // this.getStaffId();
    this.getBranchQueue();

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(40000)
    ).subscribe(() => this.successMessage = '');

    this._error.subscribe((message) => this.errorMessage = message);

    // emit value in sequence every 30 second
    const source = interval(30000);
    this.subscription = source.subscribe(val => {
      console.log('Refreshing table every 30 sec');
      this.getBranchQueue();
    });
  }

  getInfo() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   GlobalConstants.login.id = params['id'];
    //   console.log('GlobalConstants.login: ' + GlobalConstants.login.id);
    // });
    // this.activatedRoute.data.subscribe(v => {
    //   console.log(v);
    //   GlobalConstants.login = v.login;
    // });
    // GlobalConstants.login = this.activatedRoute.snapshot.paramMap.get('job');
    // @ts-ignore
    // GlobalConstants.login.id = this.activatedRoute.snapshot.paramMap.get('id');
    // @ts-ignore
    // GlobalConstants.login.job = this.activatedRoute.snapshot.paramMap.get('job');
    // @ts-ignore
    // GlobalConstants.login.name = this.activatedRoute.snapshot.paramMap.get('name');
    console.log('getInfo - job:');
//     if (GlobalConstants.login === undefined) {
//       this.login = new Login();
//     } else {
    this.login = GlobalConstants.login;
//     }
    console.log('this.login: ');
    console.log(this.login);
    console.log('GlobalConstants.login: ');
    console.log(GlobalConstants.login);
    if (GlobalConstants.login.id === null || GlobalConstants.login.id === undefined || GlobalConstants.login.id === '') {
      this.router.navigate(['/staff-login']);
    }
  }

  logout() {
    if (this.login.id !== '') {
      this.commonService.logout({id: this.login.id}).subscribe(
        data => {
          console.log('1' + data);
          if (data === 'SUCCESS') {
            console.log('2' + data);
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }
          GlobalConstants.login = new Login();
          GlobalConstants.clinicId = '';
        });
    }
  }

  getBranchQueue() {
    this.patientQueueService.getBranchQueue({staffId: this.login.id}).subscribe(
      data => {
        console.log(data);
        this.queueData = [];
        this.conData = [];
        this.mpData = [];
        this.missData = [];
        // @ts-ignore
        this.sampleData = data.data;
        if (this.sampleData !== undefined) {
          for (var item of this.sampleData){
            if (item.status === 'Q') {
              this.queueData.push(item);
            } else if (item.status === 'M') {
              this.missData.push(item);
            } else if (item.status === 'D') {
              this.conData.push(item);
            } else if (item.status === 'P') {
              this.mpData.push(item);
            } else if (item.status === 'C') {
              // this.queueData.push(item);
            } else if (item.status === 'R') {
              // this.queueData.push(item);
            }
          }
        }

        this.dataSourceQueue = new MatTableDataSource<any>(this.queueData);
        this.dataSourceQueue.paginator = this.paginator;

        this.dataSourceMissedQueue = new MatTableDataSource<any>(this.missData);
        this.dataSourceMissedQueue.paginator = this.paginator;

        this.dataSourceConsulation = new MatTableDataSource<any>(this.conData);
        this.dataSourceConsulation.paginator = this.paginator;

        this.dataSourceMedicalPayment = new MatTableDataSource<any>(this.mpData);
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

  // queue(branch: any, patientId: any, currStatus: any, patientName: any) {
  //   this.patientQueueService.updateQueueStatus({newStatus: 'D', branchId: branch, customerId: patientId, currentStatus: currStatus}).subscribe(
  //     data => {
  //       console.log(data);
  //       if (data === '200') {
  //         this._success.next(`Successfully changed patient: ` + patientName + ' status.');
  //       } else {
  //         this._error.next(`Unable to change patient:` + patientName + ' status!');
  //       }
  //     });
  // }

  consult(branch: any, patientId: any, currStatus: any, patientName: any) {
    this.patientQueueService.updateQueueStatus({newStatus: 'D', branchId: branch, customerId: patientId, currentStatus: currStatus}).subscribe(
      data => {
        console.log(data);
        if (data === 'SUCCESS') {
          this.getBranchQueue();
          this._success.next(`Successfully changed patient: ` + patientName + ' status.');
        } else {
          this._error.next(`Unable to change patient:` + patientName + ' status!');
        }
      });
  }

  medicalPayment(branch: any, patientId: any, currStatus: any, patientName: any) {
    this.patientQueueService.updateQueueStatus({newStatus: 'P', branchId: branch, customerId: patientId, currentStatus: currStatus}).subscribe(
      data => {
        console.log(data);
        if (data === 'SUCCESS') {
          this.getBranchQueue();
          this._success.next(`Successfully changed patient: ` + patientName + ' status.');
        } else {
          this._error.next(`Unable to change patient:` + patientName + ' status!');
        }
      });
  }

  completed(branch: any, patientId: any, currStatus: any, patientName: any) {
    this.patientQueueService.updateQueueStatus({newStatus: 'C', branchId: branch, customerId: patientId, currentStatus: currStatus}).subscribe(
      data => {
        console.log(data);
        if (data === 'SUCCESS') {
          this.getBranchQueue();
          this._success.next(`Successfully changed patient: ` + patientName + ' status.');
        } else {
          this._error.next(`Unable to change patient:` + patientName + ' status!');
        }
      });
  }

  missedQueue(branch: any, patientId: any, currStatus: any, patientName: any) {
    this.patientQueueService.updateQueueStatus({newStatus: 'M', branchId: branch, customerId: patientId, currentStatus: currStatus}).subscribe(
      data => {
        console.log(data);
        if (data === 'SUCCESS') {
          this.getBranchQueue();
          this._success.next(`Successfully changed patient: ` + patientName + ' status.');
        } else {
          this._error.next(`Unable to change patient:` + patientName + ' status!');
        }
      });
  }

  rejoinQueue(branch: any, patientId: any, currStatus: any, patientName: any) {
    this.patientQueueService.updateQueueStatus({newStatus: 'Q', branchId: branch, customerId: patientId, currentStatus: currStatus}).subscribe(
      data => {
        console.log(data);
        if (data === 'SUCCESS') {
          this.getBranchQueue();
          this._success.next(`Successfully changed patient: ` + patientName + ' status.');
        } else {
          this._error.next(`Unable to change patient:` + patientName + ' status!');
        }
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
