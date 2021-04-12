import { Time } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RegistrationClinic } from '../shared/modals/registration-clinic.model';
import { CommonService } from '../shared/services/common.service';
import { RegistrationService } from '../shared/services/registration.service';

@Component({
    selector: 'ic-registration-clinic',
    templateUrl: './registration-clinic.component.html',
    // styleUrls: ['registration.component.css']
})
export class RegistrationClinicComponent implements OnInit {
    registrationClinic: RegistrationClinic;
    name: any;
    addr: any;
    postal: any;
    email: any;
    password: any;
    confirmPassword: any;
    contactNo: any;
    occupation: any;
    clinic: any;
    branch: any;
    clinicName: any;
    branchTelephone: any;
    clinicAddr: any;
    openingHourMonStart: Time;
    openingHourMonEnd: Time;

    private signUpStatus: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;
    // errorMessage: string[] = new Array<string>();
    errorFlag: boolean;
    checked: boolean;
    
    constructor(private router: Router, private RegistrationService: RegistrationService, private commonService: CommonService) {
        this.registrationClinic = new RegistrationClinic();
        this.errorFlag = false;
    }

    loadAll() {}

    ngOnInit() {
      console.log("here at registrationClinic hello");

      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(40000)
      ).subscribe(() => this.successMessage = '');
  
      this._error.subscribe((message) => this.errorMessage = message);
    }


    onSignUp(editForm: NgForm){
        console.log("here at registrationClinic, start");
        if (this.name !== null && this.name !== '' && this.name !== undefined &&
            this.addr !== null && this.addr !== '' && this.addr !== undefined &&
            this.postal !== null && this.postal !== '' && this.postal !== undefined &&
            this.email !== null && this.email !== '' && this.email !== undefined &&
            this.contactNo !== null && this.contactNo !== '' && this.contactNo !== undefined &&
            this.occupation !== null && this.occupation !== '' && this.occupation !== undefined &&
            this.password !== null && this.password !== '' && this.password !== undefined &&
            this.confirmPassword !== null && this.confirmPassword !== '' && this.confirmPassword !== undefined 
        ) { 
            this.checkPassword();
            console.log(" sf 8");
            if (this.errorFlag === false) {
                this.registrationClinic.name = this.name;
                this.registrationClinic.addr = this.addr;
                this.registrationClinic.postal = this.postal;
                this.registrationClinic.email = this.email;
                this.registrationClinic.contactNo = this.contactNo;
                this.registrationClinic.occupation = this.occupation;
                this.registrationClinic.clinic = this.clinic;
                this.registrationClinic.branch = this.branch;
                console.log(" sf 10");
                console.log("this.registrationClinic is : " + this.registrationClinic);
                this.RegistrationService.registerStaffToNewClinic(this.registrationClinic).subscribe(
                    data => {
                    console.log(data);
                    this.signUpStatus = data;
                    if (this.signUpStatus === 'Success') {
                        this._success.next(`You are successfully registered with eQueue ` + this.registrationClinic);
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
            this.registrationClinic.password = this.password;
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

    // checkIfClinicSelected() {
    //     console.log("currently at checkifclinicselected()");
    //     if (this.clinic === this.clinicDisplay) {
    //         return false;
    //     } else if (this.clinic !== null) {
    //         return false;
    //     } else if (this.clinic === null || this.clinic === undefined) {
    //         return true;
    //     }
    //     else {
    //         console.log("shouldnt be here at checkifclinicselected");
    //         return true;
    //     }
    // }

    // checkIfbranchSelected() {
    //     console.log("currently at checkifbranchselected()");
    //     if (this.branch === this.branchDisplay) {
    //         return false;
    //     } else if (this.branch !== null) {
    //         return false;
    //     } else if (this.branch === null || this.branch === undefined) {
    //         return true;
    //     }
    //     else {
    //         console.log("shouldnt be here at checkifbranchselected");
    //         return true;
    //     }
    // }


    onCancel() {
        console.log("registration on cancelling, go back home page");
        this.router.navigate(['/']);
    }

    onClear(){
        console.log("registration on clearing");
        this.name = null;
        this.addr = null;
        this.postal = null;
        this.email = null;
        this.password = null;
        this.confirmPassword = null;
        this.contactNo = null;
        this.occupation = null;
    }

    enableProceed(e: any) {
        if (e.target.checked) {
          this.checked = e.target.checked;
        } else {
          this.checked = false;
        }
      }
}