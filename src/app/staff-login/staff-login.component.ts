import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { StaffLoginService } from '../shared/services/staff-login.service';
import {Login} from '../shared/modals/login.modal';
import {GlobalConstants} from "../shared/global-constants";

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

    private loginInfo: Login;
    private forgotCredentialsStatus: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;

    modalForgotRef: BsModalRef;
    @ViewChild('forgotModal') modalForgot: TemplateRef<any>;
    
    constructor(private router: Router, private staffLoginService: StaffLoginService, private modalService: BsModalService) {
      this.loginInfo = new Login();
    }

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
            this.staffLoginService.staffLogin({email: this.username, password: this.password}).subscribe(
                data => {
                console.log(data);
                if (data !== 'ERROR') {
                  // @ts-ignore
                  this.loginInfo = data.data[0];
                  console.log(this.loginInfo);
                  if (this.loginInfo !== null && this.loginInfo !== undefined) {
                    console.log(" sf 11");
                    GlobalConstants.login = this.loginInfo;
                    console.log('this is GlobalConstants.login: ');
                    console.log(GlobalConstants.login);
                    // if (this.adminId !== null || this.adminId !== '') {
                    //     this.router.navigate(['/staff-info']);
                    // } else {
                    if (GlobalConstants.login.status === 'A') {
                      if (GlobalConstants.login.job === 'N' || GlobalConstants.login.job === 'D') {
                        this.router.navigate(['/patient-queue']);
                      } else {
                        if (GlobalConstants.login.isAdmin) {
                          this.router.navigate(['/staff-info']);
                        }
                      }
                    } else {
                      this._error.next(`Account is not active yet!`);
                    }
                    // }
                  } else {
                    this._error.next(`Incorrect Username or Password!`);
                    console.log(" sf 12");
                  }
                } else {
                  this._error.next(`Unable to login!`);
                }
                this.onClear();
                this._error.next(`You do not have rights assigned!`);
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
        this.username = '';
        this.password = '';
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
            if (data === 'SUCCESS') {
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
