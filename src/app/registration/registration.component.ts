import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Registration } from '../shared/modals/registration.model';
import { RegistrationService } from '../shared/services/registration.service';

@Component({
    selector: 'ic-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['registration.component.css']
})
export class RegistrationComponent implements OnInit {
    registration: Registration;
    name: any;
    uin:any;
    addr: any;
    postal: any;
    email: any;
    password: any;
    confirmPassword: any;
    contactNo: any;
    drugAllergy: any;

    private signUpStatus: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;
    // errorMessage: string[] = new Array<string>();
    errorFlag: boolean;
    
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
    }


    onSignUp(editForm: NgForm){
        console.log("here at registration, start");
        if (this.name !== null && this.name !== '' && this.name !== undefined &&
            // this.uin !== null && this.uin !== '' && this.uin !== undefined &&
            // this.addr !== null && this.addr !== '' && this.addr !== undefined &&
            // this.postal !== null && this.postal !== '' && this.postal !== undefined &&
            this.email !== null && this.email !== '' && this.email !== undefined &&
            this.contactNo !== null && this.contactNo !== '' && this.contactNo !== undefined &&
            // this.drugAllergy !== null && this.drugAllergy !== '' && this.drugAllergy !== undefined &&
            this.password !== null && this.password !== '' && this.password !== undefined &&
            this.confirmPassword !== null && this.confirmPassword !== '' && this.confirmPassword !== undefined 
        ) { 
            this.checkPassword();
            console.log(" sf 8");
            if (this.errorFlag === false) {
                this.registration.name = this.name;
                this.registration.uin = this.uin;
                this.registration.addr = this.addr;
                this.registration.postal = this.postal;
                this.registration.email = this.email;
                this.registration.contactNo = this.contactNo;
                this.registration.drugAllergy = this.drugAllergy;
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

    checkPassword() {
        // check if password input is correct
        console.log("this.password is : " + this.password);
        console.log("this.cmfpassword is : " + this.confirmPassword);
        if (this.password === this.confirmPassword) {
            this.registration.password = this.password;
            this.errorFlag = false;
            console.log(" sf 5");
        } else if (this.password != this.confirmPassword) {
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
        if (this.name === null || this.name === '' || this.name === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 1");
        }
        if (this.contactNo === null || this.contactNo === '' ||  this.contactNo === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 2");
        }
        if (this.email === null || this.email === '' || this.email === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 3");
        }
        if (this.password === null || this.password === '' || this.password === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 4");
        }
        if (this.confirmPassword === null || this.confirmPassword === '' || this.confirmPassword === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 5");
        }
        console.log("end of checks");
    }



    onCancel() {
        console.log("registration on cancelling, go back home page");
        this.router.navigate(['/']);
    }

    onClear(){
        console.log("registration on clearing");
        this.name = null;
        this.uin = null;
        this.addr = null;
        this.postal = null;
        this.email = null;
        this.password = null;
        this.confirmPassword = null;
        this.contactNo = null;
        this.drugAllergy = null;
    }
}