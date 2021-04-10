import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PatientViewDetailsService } from '../shared/services/patient-view-details.service';

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
    // adminId: string | null;

    private status: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;

    modalCancelQueueRef: BsModalRef;
    @ViewChild('cancelQueueModal') modalCancelQueue: TemplateRef<any>;
    
    constructor(
        private router: Router,
        private  patientViewDetailsService: PatientViewDetailsService,
        private modalService: BsModalService
        ) {}

    loadAll() {}

    ngOnInit() {
      console.log("here at staff login hello");
      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(40000)
      ).subscribe(() => this.successMessage = '');
  
      this._error.subscribe((message) => this.errorMessage = message);

        this.patientViewDetailsService.getJoinedQueueStatus().subscribe(
            data => {
              console.log(data);
              if (data !== 'ERROR') {
                this.joinedQueueStatus = data;
              }
            });
          
        console.log("this.joinedQueueStatus : " + this.joinedQueueStatus);
        this.branchIdDisplay = this.joinedQueueStatus.branchId;
        this.clinicNameDisplay = this.joinedQueueStatus.clinicName;
        this.branchAddressDisplay = this.joinedQueueStatus.branchAddr;
        this.patientQueueNoDisplay = this.joinedQueueStatus.yourQueueNumber;
        this.currentQueueNoDisplay = this.joinedQueueStatus.currentQueueNumber;

    }


    onCancelQueuePopUp(){
        console.log("here at onCancelQueuePopUp");
        this.modalCancelQueueRef = this.modalService.show(this.modalCancelQueue);
    }

    onCancelQueueYes(){
        console.log("here at onCancelQueueYes");
        this.patientViewDetailsService.leaveQueue({branchId: this.branchId, customerId:this.patientId}).subscribe(
            data => {
                console.log(data);
                this.status = data;
                if (this.status === 'Success') {
                    console.log(" sf 11");            
                    this.router.navigate(['/smart-search-member']);                  
                } else {
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
        this.router.navigate(['/smart-search-member']); 
    }
}