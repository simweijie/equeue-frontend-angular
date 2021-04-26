import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { interval, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PatientViewDetailsService } from '../shared/services/patient-view-details.service';
import {GlobalConstants} from "../shared/global-constants";
import {Login} from "../shared/modals/login.modal";
import {CommonService} from "../shared/services/common.service";

@Component({
    selector: 'ic-patient-view-details',
    templateUrl: './patient-view-details.component.html',
})
export class PatientViewDetailsComponent implements OnInit {
    branchId: any;
    patientId: any;
    branchIdDisplay: any;
    patientQueueNoDisplay: any;
    clinicNameDisplay: any;
    currentQueueNoDisplay: any;
    branchAddressDisplay: any;
    branchList: any;
    clinicList: any;
    joinedQueueStatus: any;
    hide = false;
    // adminId: string | null;

    private status: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;
    subscription: Subscription;

    modalCancelQueueRef: BsModalRef;
    @ViewChild('cancelQueueModal') modalCancelQueue: TemplateRef<any>;
    statusValue: any;
    output: any;
    login: Login;
    
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private patientViewDetailsService: PatientViewDetailsService,
        private modalService: BsModalService,
        private commonService: CommonService
        ) {
      this.login = new Login();
    }

    loadAll() {}

    ngOnInit() {
      console.log("here at patient login hello");
      this.getInfo();
      console.log('GlobalConstants.login.id: ');
      console.log(GlobalConstants.login.id);
      this.getCurrentStatus();

      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(30000)
      ).subscribe(() => this.successMessage = '');
  
      this._error.subscribe((message) => this.errorMessage = message);
      
      // emit value in sequence every 30 second
        const source = interval(30000);
        this.subscription = source.subscribe(val => {
          console.log('Refreshing table every 30 sec');
          this.getCurrentStatus();
        });
        
      // if(GlobalConstants.login.id !== null && GlobalConstants.login.id !== undefined && GlobalConstants.login.id !== '') {
      //   this.patientViewDetailsService.getJoinedQueueStatus({customerId: GlobalConstants.login.id}).subscribe(
      //     data => {
      //       console.log(data);
      //       if (data !== 'ERROR') {
      //         // @ts-ignore
      //         this.joinedQueueStatus = data.data;
      //         console.log("this.joinedQueueStatus.currentQueueNumber : " + this.joinedQueueStatus.currentQueueNumber);
      //         if(this.joinedQueueStatus.currentQueueNumber !== undefined) {
      //           console.log("this.joinedQueueStatus : " + this.joinedQueueStatus);
      //           this.branchIdDisplay = this.joinedQueueStatus.branchId;
      //           this.clinicNameDisplay = this.joinedQueueStatus.clinicName;
      //           this.branchAddressDisplay = this.joinedQueueStatus.branchAddr;
      //           this.patientQueueNoDisplay = this.joinedQueueStatus.yourQueueNumber;
      //           this.currentQueueNoDisplay = this.joinedQueueStatus.currentQueueNumber;
      //           this.statusValue = this.joinedQueueStatus.status;
      //         } else {
      //           console.log("No pending queues");
      //         }
      //       }
      //     });
      // }
    }

  getInfo() {
    console.log('getInfo - job:');
    if (GlobalConstants.login === undefined) {
      this.login = new Login();
    } else {
      this.login = GlobalConstants.login;
    }
    console.log('this.login: ');
    console.log(this.login);
    console.log('GlobalConstants.login: ');
    console.log(GlobalConstants.login);
    if (GlobalConstants.login.id === null || GlobalConstants.login.id === undefined || GlobalConstants.login.id === '') {
      this.router.navigate(['/patient-login']);
    }
  }

  logout() {
    if (this.login.id !== '') {
      this.commonService.staffLogout({id: this.login.id}).subscribe(
        data => {
          console.log('1' + data);
          if (data === 'SUCCESS') {
            console.log('2' + data);
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }
          GlobalConstants.login = new Login();
        });
    }
  }

    getCurrentStatus(){
      console.log('at getCurrentStatus');
      if(GlobalConstants.login.id !== null && GlobalConstants.login.id !== undefined && GlobalConstants.login.id !== '') {
        this.patientViewDetailsService.getJoinedQueueStatus({customerId: GlobalConstants.login.id}).subscribe(
          data => {
            console.log(data);
            if (data !== 'ERROR') {
              // @ts-ignore
              this.joinedQueueStatus = data.data[0];
              console.log("this.joinedQueueStatus : " + this.joinedQueueStatus);
              if (this.joinedQueueStatus !== null && this.joinedQueueStatus !== undefined && this.joinedQueueStatus !== '') {
                console.log("this.joinedQueueStatus.currentQueueNumber : " + this.joinedQueueStatus.currentQueueNumber);
                if (this.joinedQueueStatus.currentQueueNumber !== null && this.joinedQueueStatus.currentQueueNumber !== undefined && this.joinedQueueStatus.currentQueueNumber !== '') {
                  console.log("this.joinedQueueStatus : " + this.joinedQueueStatus);
                  this.branchIdDisplay = this.joinedQueueStatus.branchId;
                  this.clinicNameDisplay = this.joinedQueueStatus.clinicName;
                  this.branchAddressDisplay = this.joinedQueueStatus.branchAddr;
                  this.patientQueueNoDisplay = this.joinedQueueStatus.yourQueueNumber;
                  this.currentQueueNoDisplay = this.joinedQueueStatus.currentQueueNumber;
                  this.statusValue = this.joinedQueueStatus.status;
                  this.hide = true;
                } else {
                  this.hide = false;
                  console.log("Error occured");
                }
              } else {
                this.hide = false;
                console.log("No pending queues");
              }
            } else {
              this.hide = false;
              console.log("ERROR OCCURED");
            }
          });
      }
    }


    // rejoinQueue() {
    //   console.log("on rejoin queue");
    //   this.patientViewDetailsService.rejoinQueue({branchId: this.joinedQueueStatus.branchId, customerId: this.joinedQueueStatus.customerId}).subscribe(
    //     data => {
    //       console.log(data);
    //       this.output = data;
    //       if (this.output === '') {
    //         this._success.next(`Successfully rejoined queue with new Queue Number : ` + this.joinedQueueStatus.yourQueueNumber);
    //       } else if (this.output.data.error !== '') {
    //         this._error.next(this.output.data.error);
    //       } else {
    //         this._error.next(`Unable to rejoin queue:`);
    //       }
    //     });
    // }
    //
    // leaveQueue(){
    //   console.log("on leave queue");
    //   this.patientViewDetailsService.leaveQueue({branchId: this.joinedQueueStatus.branchId, customerId:this.joinedQueueStatus.customerId}).subscribe(
    //     data => {
    //         console.log(data);
    //         this.status = data;
    //         if (data === 'SUCCESS') {
    //             console.log(" sf 11");
    //             this.router.navigate(['/smart-search-member']);
    //         } else {
    //             this._error.next(`Unable to cancel Queue No. Kindly refresh or retry later!`);
    //             console.log(" sf 12");
    //         }
    //     });
    //  }

    onCancelQueuePopUp(){
        console.log("here at onCancelQueuePopUp");
        this.modalCancelQueueRef = this.modalService.show(this.modalCancelQueue);
    }

    onCancelQueueYes(){
        console.log("here at onCancelQueueYes");
        this.patientViewDetailsService.leaveQueue({branchId: this.joinedQueueStatus.branchId, customerId:this.joinedQueueStatus.customerId}).subscribe(
            data => {
                console.log(data);
                this.status = data;
                if (data === 'SUCCESS') {
                    console.log(" sf 11");
                    this.onCancelQueueNo();
                    this.router.navigate(['/smart-search-member']);
                } else {
                    this.onCancelQueueNo();
                    this._error.next(`Unable to cancel Queue No. Kindly refresh or retry later!`);
                    console.log(" sf 12");
                }
            });
    }

    onCancelQueueNo(){
        console.log("here at onCancelQueueNo");
        this.modalCancelQueueRef.hide();
    }

    onChangeClinic(){
        console.log("here at onChangeClinic");
        GlobalConstants.serachType = 'C';
        this.router.navigate(['/smart-search-member']);
    }
}
