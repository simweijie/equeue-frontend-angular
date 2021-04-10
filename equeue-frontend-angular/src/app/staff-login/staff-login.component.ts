import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { StaffLoginService } from '../shared/services/staff-login.service';

@Component({
    selector: 'ic-staff-login',
    templateUrl: './staff-login.component.html',
    // styleUrls: ['staff-login.component.css']
})
export class StaffLoginComponent implements OnInit {
    username: any;
    password: any;
    contactNo: any;
    adminId: string | null;

    private loginStatus: string | Object | null | string;
    private forgotCredentialsStatus: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;

    modalForgotRef: BsModalRef;
    @ViewChild('forgotModal') modalForgot: TemplateRef<any>;
    
    constructor(private router: Router, private staffLoginService: StaffLoginService, private modalService: BsModalService) {}

    loadAll() {}

    ngOnInit() {
      console.log("here at staff login hello");
      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(40000)
      ).subscribe(() => this.successMessage = '');
  
      this._error.subscribe((message) => this.errorMessage = message);
    }


    onLogin(editForm: NgForm){
        console.log("here at staff login, start");
        if (this.username !== null && this.username !== '' && this.username !== undefined &&
            this.password !== null && this.password !== '' && this.password !== undefined
        ) {      
            this.staffLoginService.staffLogin({username: this.username, password:this.password}).subscribe(
                data => {
                console.log(data);
                this.loginStatus = data;
                if (this.loginStatus === 'Success') {
                    console.log(" sf 11");
                    if (this.adminId !== null || this.adminId !== '') {
                        this.router.navigate(['/staff-info', { adminId: this.adminId }]);
                      } else {
                        this.router.navigate(['/staff-info/:adminId']);
                      }
                } else {
                    this._error.next(`Incorrect Username or Password!`);
                    console.log(" sf 12");
                }
                });
        } else {
            this.checkRequiredFields();
        }
        console.log(" sf 13");
    }

    checkRequiredFields() {
        console.log("checking if required fields are filled up");
        if (this.username === null || this.username === '' || this.username === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 1");
        }
        if (this.password === null || this.password === '' || this.password === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 4");
        }
        console.log("end of checks");
    }

    onClear(){
        console.log("stafflogin on clearing");
        this.username = null;
        this.password = null;
    }

    registerNewClinic() {
        console.log("test registerNewClinic ");
        this.router.navigate(['/registration-clinic']);
    }

    registerNewStaffExistingClinic(){
        console.log("test registerNewStaffExistingClinic ");
        this.router.navigate(['/registration-staff']);
    }

    forgotCredentials(){
        console.log("test forgotCredentials ");
        this.modalForgotRef = this.modalService.show(this.modalForgot);
    }

    forgotPassword() {
        this.staffLoginService.forgotCredentials({contactNo: this.contactNo}).subscribe(
          data => {
            console.log(data);
            this.forgotCredentialsStatus = data;
            if (this.forgotCredentialsStatus === 'Success') {
              this._success.next(`Please check your Contact No.`);
            } else {
              this._error.next(`You are not an existing staff. Kindly sign up!`);
            }
            this.cancel();
          });
      }

    cancel() {
        this.modalForgotRef.hide();
        this.contactNo = '';
      }
}