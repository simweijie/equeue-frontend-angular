import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RegistrationStaff } from '../shared/modals/registration-staff.model';
import { CommonService } from '../shared/services/common.service';
import { RegistrationService } from '../shared/services/registration.service';

@Component({
    selector: 'ic-registration-staff',
    templateUrl: './registration-staff.component.html',
    // styleUrls: ['registration.component.css']
})
export class RegistrationStaffComponent implements OnInit {
    registrationStaff: RegistrationStaff;
    name: any;
    // uin:any;
    addr: any;
    postal: any;
    email: any;
    password: any;
    confirmPassword: any;
    contactNo: any;
    occupation: any;
    clinic: any;
    branch: any;
    branchList: any;
    clinicList: any;
    clinicDisplay: string;
    branchDisplay: string;
    occupationDisplay: string;
    occupationList: Array<object> = [
      {id: 'D', value: 'Doctor'},
      {id: 'S', value: 'Nurse'},
      {id: 'A', value: 'Admin'}
    ];

    private signUpStatus: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;
    // errorMessage: string[] = new Array<string>();
    errorFlag: boolean;
    
    constructor(private router: Router, private RegistrationService: RegistrationService, private commonService: CommonService) {
        this.registrationStaff = new RegistrationStaff();
        this.errorFlag = false;
        this.clinicDisplay = '';
        this.branchDisplay = '';
        this.occupationDisplay = '';
    }

    loadAll() {}

    ngOnInit() {
      console.log("here at registrationStaff hello");
      this.commonService.retrieveBranchList().subscribe(
        data => {
          console.log(data);
          if (data !== 'ERROR') {
            this.branchList = data;
          }
        });
      this.commonService.retrieveClinicList().subscribe(
        data => {
          console.log(data);
          if (data !== 'ERROR') {
            this.clinicList = data;
          }
        });

      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(40000)
      ).subscribe(() => this.successMessage = '');
  
      this._error.subscribe((message) => this.errorMessage = message);
    }


    onSignUp(editForm: NgForm){
        console.log("here at registrationStaff, start");
        if (this.name !== null && this.name !== '' && this.name !== undefined &&
            this.addr !== null && this.addr !== '' && this.addr !== undefined &&
            this.postal !== null && this.postal !== '' && this.postal !== undefined &&
            this.email !== null && this.email !== '' && this.email !== undefined &&
            this.contactNo !== null && this.contactNo !== '' && this.contactNo !== undefined &&
            this.occupation !== null && this.occupation !== '' && this.occupation !== undefined &&
            this.password !== null && this.password !== '' && this.password !== undefined &&
            this.confirmPassword !== null && this.confirmPassword !== '' && this.confirmPassword !== undefined 
            && !this.checkIfClinicSelected() && !this.checkIfbranchSelected()
        ) { 
            this.checkPassword();
            console.log(" sf 8");
            if (this.errorFlag === false) {
                this.registrationStaff.name = this.name;
                this.registrationStaff.addr = this.addr;
                this.registrationStaff.postal = this.postal;
                this.registrationStaff.email = this.email;
                this.registrationStaff.contactNo = this.contactNo;
                this.registrationStaff.occupation = this.occupation;
                this.registrationStaff.clinic = this.clinic;
                this.registrationStaff.branch = this.branch;
                console.log(" sf 10");
                console.log("this.registrationStaff is : " + this.registrationStaff);
                this.RegistrationService.registerStaffToExistingClinic(this.registrationStaff).subscribe(
                    data => {
                    console.log(data);
                    this.signUpStatus = data;
                    if (this.signUpStatus === 'Success') {
                        this._success.next(`You are successfully registered with eQueue ` + this.registrationStaff);
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
            this.registrationStaff.password = this.password;
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

    checkIfClinicSelected() {
        console.log("currently at checkifclinicselected()");
        if (this.clinic === this.clinicDisplay) {
            return false;
        } else if (this.clinic !== null) {
            return false;
        } else if (this.clinic === null || this.clinic === undefined) {
            return true;
        }
        else {
            console.log("shouldnt be here at checkifclinicselected");
            return true;
        }
    }

    checkIfbranchSelected() {
        console.log("currently at checkifbranchselected()");
        if (this.branch === this.branchDisplay) {
            return false;
        } else if (this.branch !== null) {
            return false;
        } else if (this.branch === null || this.branch === undefined) {
            return true;
        }
        else {
            console.log("shouldnt be here at checkifbranchselected");
            return true;
        }
    }


    onCancel() {
        console.log("registration on cancelling, go back home page");
        this.router.navigate(['/staff-login']);;
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
}
