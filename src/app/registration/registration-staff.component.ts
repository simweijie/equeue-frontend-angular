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
    fname: any;
    // uin:any;
    addrf: any;
    postalf: any;
    emailf: any;
    passwordf: any;
    confirmPasswordf: any;
    contactNof: any;
    occupationf: any;
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

    private signUpStatus: any;
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
        if (this.fname !== null && this.fname !== '' && this.fname !== undefined &&
            this.addrf !== null && this.addrf !== '' && this.addrf !== undefined &&
            this.postalf !== null && this.postalf !== '' && this.postalf !== undefined &&
            this.emailf !== null && this.emailf !== '' && this.emailf !== undefined &&
            this.contactNof !== null && this.contactNof !== '' && this.contactNof !== undefined &&
            this.occupationf !== null && this.occupationf !== '' && this.occupationf !== undefined &&
            this.passwordf !== null && this.passwordf !== '' && this.passwordf !== undefined &&
            this.confirmPasswordf !== null && this.confirmPasswordf !== '' && this.confirmPasswordf !== undefined 
            && !this.checkIfClinicSelected() && !this.checkIfbranchSelected()
        ) { 
            this.checkPassword();
            console.log(" sf 8");
            if (this.errorFlag === false) {
                this.registrationStaff.name = this.fname;
                this.registrationStaff.addr = this.addrf;
                this.registrationStaff.postal = this.postalf;
                this.registrationStaff.email = this.emailf;
                this.registrationStaff.contactNo = this.contactNof;
                this.registrationStaff.occupation = this.occupationf;
                this.registrationStaff.clinic = this.clinic;
                this.registrationStaff.branch = this.branch;
                console.log(" sf 10");
                console.log("this.registrationStaff is : " + this.registrationStaff);
                this.RegistrationService.registerStaffToExistingClinic(this.registrationStaff).subscribe(
                    data => {
                    console.log('data: ' + data);
                    this.signUpStatus = data;
                    console.log('this.signUpStatus: ' + this.signUpStatus);
                    if (this.signUpStatus === 200) {
                        this._success.next(`You are successfully registered with eQueue ` + this.registrationStaff);
                        console.log(" sf 11");
                        // routed to login page to sign in
                        this.router.navigate(['/patient-login']);
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
        console.log("this.passwordf is : " + this.passwordf);
        console.log("this.cmfpassword is : " + this.confirmPasswordf);
        if (this.passwordf === this.confirmPasswordf) {
            this.registrationStaff.password = this.passwordf;
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
        if (this.addrf === null || this.addrf === '' || this.addrf === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 31");
        }
        if (this.postalf === null || this.postalf === '' || this.postalf === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 52");
        }
        if (this.occupationf === null || this.occupationf === '' || this.occupationf === undefined) {
            this._error.next("Please enter all required fields marked with '*'.");
            console.log(" sf 52");
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
        this.router.navigate(['/staff-login']);
    }

    onClear(){
        console.log("registration on clearing");
        this.fname = null;
        this.addrf = null;
        this.postalf = null;
        this.emailf = null;
        this.passwordf = null;
        this.confirmPasswordf = null;
        this.contactNof = null;
        // this.occupationf = null;
    }
}
