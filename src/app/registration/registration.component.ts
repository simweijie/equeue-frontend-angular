import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Registration } from '../shared/modals/registration.model';
import { RegistrationService } from '../shared/services/registration.service';
import {GlobalConstants} from "../shared/global-constants";

@Component({
    selector: 'ic-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['registration.component.css']
})
export class RegistrationComponent implements OnInit {
    registration: Registration;
    fname: any;
    uinf:any;
    addrf: any;
    postalf: any;
    emailf: any;
    passwordf: any;
    confirmPasswordf: any;
    contactNof: any;
    drugAllergyf: any;

    private signUpStatus: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;
    // errorMessage: string[] = new Array<string>();
    errorFlag: boolean;
  private clinicId: string | null;
    
    constructor(private router: Router, private RegistrationService: RegistrationService) {
        this.registration = new Registration();
        this.errorFlag = false;
    }

    loadAll() {}

    ngOnInit() {
      console.log("here at registration hello");
      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(40000)
      ).subscribe(() => this.successMessage = '');
  
      this._error.subscribe((message) => this.errorMessage = message);
      this.getId();
    }

  getId() {
    this.clinicId = GlobalConstants.clinicId;
    console.log('clinicId');
    console.log(this.clinicId);
  }


    onSignUp(editForm: NgForm){
        console.log("here at registration, start");
        if (this.fname !== null && this.fname !== '' && this.fname !== undefined &&
            // this.uin !== null && this.uin !== '' && this.uin !== undefined &&
            // this.addr !== null && this.addr !== '' && this.addr !== undefined &&
            // this.postal !== null && this.postal !== '' && this.postal !== undefined &&
            this.emailf !== null && this.emailf !== '' && this.emailf !== undefined &&
            this.contactNof !== null && this.contactNof !== '' && this.contactNof!== undefined &&
            // this.drugAllergy !== null && this.drugAllergy !== '' && this.drugAllergy !== undefined &&
            this.passwordf !== null && this.passwordf !== '' && this.passwordf !== undefined &&
            this.confirmPasswordf !== null && this.confirmPasswordf !== '' && this.confirmPasswordf !== undefined 
        ) { 
            this.checkPassword();
            console.log(" sf 8");
            if (this.errorFlag === false) {
                this.registration.name = this.fname;
                this.registration.uin = this.uinf;
                this.registration.addr = this.addrf;
                this.registration.postal = this.postalf;
                this.registration.email = this.emailf;
                this.registration.contactNo = this.contactNof;
                this.registration.drugAllergy = this.drugAllergyf;
                console.log(" sf 10");
                console.log("this.registration is : " + this.registration);
                this.RegistrationService.customerSignUp(this.registration).subscribe(
                    data => {
                    console.log(data);
                    this.signUpStatus = data;
                    if (this.signUpStatus === 'Success') {
                        this._success.next(`You are successfully registered with eQueue ` + this.registration);
                        console.log(" sf 11");
                        // routed to login page to sign in
                        this.router.navigate(['/patient-login/:clinicId']);
                    } else {
                        this._error.next(`Unable to register with eQueue!`);
                        console.log(" sf 12");
                    }
                    });
            }
            else { 
                console.log(" sf 9");
                this._error.next(`Unable to register with eQueue. Passwords input are different. Please ensure both passwords are exactly the same.`);
            }
        } else {
            this.checkRequiredFields();
        }
        console.log(" sf 13");
        
        
        
    }

    // formCheck(editForm: NgForm) {
    //     if (editForm.status === 'INVALID') {

    //     }
    // }

    checkPassword() {
        // check if password input is correct
        console.log("this.password is : " + this.passwordf);
        console.log("this.cmfpassword is : " + this.confirmPasswordf);
        if (this.passwordf === this.confirmPasswordf) {
            this.registration.password = this.passwordf;
            this.errorFlag = false;
            console.log(" sf 5");
        } else if (this.passwordf != this.confirmPasswordf) {
            this._error.next("Passwords input are different. Please ensure both passwords are exactly the same.");
            this.errorFlag = true;
            console.log(" sf 7");
        } else {
            console.log("shoudlnt be here");
        }
        console.log("current errorflag is : " + this.errorFlag);
        return this.errorFlag;
    }

    checkRequiredFields() {
        console.log("checking if required fields are filled up");
        if (this.fname === null || this.fname === '' || this.fname === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 1");
        }
        if (this.contactNof === null || this.contactNof === '' ||  this.contactNof === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 2");
        }
        if (this.emailf === null || this.emailf === '' || this.emailf === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 3");
        }
        if (this.passwordf === null || this.passwordf === '' || this.passwordf === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 4");
        }
        if (this.confirmPasswordf === null || this.confirmPasswordf === '' || this.confirmPasswordf === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 5");
        }
        console.log("end of checks");
    }



    onCancel() {
        console.log("registration on cancelling, go back home page");
        this.router.navigate(['/patient-login']);
    }

    onClear(){
        console.log("registration on clearing");
        this.fname = null;
        this.uinf = null;
        this.addrf = null;
        this.postalf = null;
        this.emailf = null;
        this.passwordf= null;
        this.confirmPasswordf = null;
        this.contactNof = null;
        this.drugAllergyf = null;
    }
}
