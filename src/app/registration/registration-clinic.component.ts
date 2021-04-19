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
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import {OpenHour} from "../shared/modals/open-hour.modal";
import {BranchInfo} from "../shared/modals/branch.modal";

@Component({
    selector: 'ic-registration-clinic',
    templateUrl: './registration-clinic.component.html',
    // styleUrls: ['registration.component.css']
})
export class RegistrationClinicComponent implements OnInit {
    faPlus = faPlus;
    faMinus = faMinus;
    faTimes = faTimes;
    registrationClinic: RegistrationClinic;
    name: any;
    addrf: any;
    postalf: any;
    emailf: any;
    passwordf: any;
    confirmPasswordf: any;
    contactNof: any;
    occupation: any;
    clinic: any;
    branch: any;
    clinicName: any;
    branchName: any;
    branchTelephone: any;
    clinicAddr: any;
    pCode: any;

    private signUpStatus: string | Object | null | string;
    private _success = new Subject<string>();
    private _error = new Subject<string>();
    successMessage: string;
    errorMessage: string;
    errorFlag: boolean;
    checked: boolean;
 
    // form = this.fb.group({
    //   clinicOpeningHours: this.fb.array([])
    // });

    // branchForm = this.fb.group({
    //   branchInfo: this.fb.array([])
    // });

    startTime: Array<string> = [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00",
        "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
        "20:00", "21:00", "22:00", "23:00"
    ];

    endTime: Array<string> = [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00",
        "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
        "20:00", "21:00", "22:00", "23:00"
    ];

    dayOfWeek: any = [
        {id: "1", value: "Monday"},
        {id: "2", value: "Tuesday"},
        {id: "3", value: "Wednesday"},
        {id: "4", value: "Thursday"},
        {id: "5", value: "Friday"},
        {id: "6", value: "Saturday"},
        {id: "7", value: "Sunday"}
    ];
  dayOfWeekMap: Map<string, string>;

  occupationList: Array<object> = [
    {id: 'D', value: 'Doctor'},
    {id: 'S', value: 'Nurse'},
    {id: 'A', value: 'Admin'}
  ];
  openingHourList: Array<OpenHour> = [];
  day: any;
  start: any;
  end: any;
  openHour: OpenHour;
  openHourError: boolean = false;

  branchInfoList: Array<BranchInfo> = [];
  branchInfo: BranchInfo;
  branchInfoError: boolean = false;
    
    constructor(private router: Router, private RegistrationService: RegistrationService, private commonService: CommonService, private fb: FormBuilder) {
        this.registrationClinic = new RegistrationClinic();
        this.errorFlag = false;
        this.occupation ='';
    }

    loadAll() {}

    ngOnInit() {
      console.log("here at registrationClinic hello");
      this.checked = false;
      console.log("ngonit this.checked is : "+ this.checked);

      this.dayOfWeekMap = new Map<string, string>();
      for (let entry of this.dayOfWeek) {
        this.dayOfWeekMap.set(entry.id, entry.value);
      }

      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(40000)
      ).subscribe(() => this.successMessage = '');

      this._error.subscribe((message) => this.errorMessage = message);
      // this.addOpeningHour();
      // this.addBranch();
    }

    // get clinicOpeningHours(){
    //   return this.form.controls["clinicOpeningHours"] as FormArray;
    // }

    addOpeningHour(){
      // const openingHourForm = this.fb.group({
      //   openingHourDayOfWeek: ['', Validators.required],
      //   openingHourStartTime: ['', Validators.required],
      //   openingHourEndTime: ['', Validators.required]
      // });
      // this.clinicOpeningHours.push(openingHourForm);
      if (this.openingHourList === undefined) {
        console.log('this.openingHourList: undefined');
        this.openingHourList = Array<OpenHour>();
      }

      if (this.day !== '' && this.start !== '' && this.end !== '' && this.day !== undefined && this.start !== undefined && this.end !== undefined) {
        this.openHour = {
          day: this.day , startTime: this.start,
          endTime: this.end
        };
        console.log('this.openHour: ');
        console.log(this.openHour);
        console.log('Before this.openingHourList: ');
        console.log(this.openingHourList);
        this.openingHourList.push(this.openHour);
        console.log('After this.openingHourList: ');
        console.log(this.openingHourList);
        this.clear();
      } else {
        this.openHourError = true;
      }
      console.log('addOpeningHour' + this.openingHourList);
    }

  clear() {
    this.day = '';
    this.start = '';
    this.end = '';
    this.openHourError = false;
  }
    deleteOpeningHour(openHour: OpenHour) {
      // this.clinicOpeningHours.removeAt(openingHourIndex);
      // this.openingHourList.filter(obj => obj !== openHour);
      this.openingHourList.forEach( (item, index) => {
        if (item === openHour) this.openingHourList.splice(index,1);
      });
    }

    // get branchInfo(){
    //   return this.branchForm.controls["branchInfo"] as FormArray;
    // }

    addBranch(){
      if (this.branchInfoList === undefined) {
        console.log('this.branchInfoList: undefined');
        this.branchInfoList = Array<BranchInfo>();
      }

      if (this.branchName !== '' && this.branchTelephone !== '' && this.pCode !== '' &&
        this.branchName !== undefined && this.branchTelephone !== undefined && this.pCode !== undefined) {
        this.branchInfo = {
          branchName: this.branchName , branchTelNo: this.branchTelephone,
          postalCode: this.pCode, address: this.clinicAddr, openHours: this.openingHourList
        };
        console.log('this.branchInfo: ');
        console.log(this.branchInfo);
        console.log('Before this.branchInfoList: ');
        console.log(this.branchInfoList);
        this.branchInfoList.push(this.branchInfo);
        console.log('After this.branchInfoList: ');
        console.log(this.branchInfoList);
        this.clearBranch();
      } else {
        this.branchInfoError = true;
      }
      console.log('addBranch' + this.branchInfoList);
    }

    deleteBranch(branchInfo: BranchInfo) {
      // this.branchInfo.removeAt(branchIndex);
      // this.branchInfoList.filter(obj => obj !== branchInfo);
      this.branchInfoList.forEach( (item, index) => {
        if (item === branchInfo) this.branchInfoList.splice(index,1);
      });
    }

    onSignUp(editForm: NgForm){
        console.log("here at registrationClinic, start");
        if (this.name !== null && this.name !== '' && this.name !== undefined &&
            this.addrf !== null && this.addrf !== '' && this.addrf !== undefined &&
            this.postalf !== null && this.postalf !== '' && this.postalf !== undefined &&
            this.emailf !== null && this.emailf !== '' && this.emailf !== undefined &&
            this.contactNof !== null && this.contactNof !== '' && this.contactNof !== undefined &&
            this.occupation !== null && this.occupation !== '' && this.occupation !== undefined &&
            this.passwordf !== null && this.passwordf !== '' && this.passwordf !== undefined &&
            this.confirmPasswordf !== null && this.confirmPasswordf !== '' && this.confirmPasswordf !== undefined
        ) {
            this.checkPassword();
            console.log(" sf 8");
            if (this.errorFlag === false) {
                this.registrationClinic.name = this.name;
                this.registrationClinic.addr = this.addrf;
                this.registrationClinic.postal = this.postalf;
                this.registrationClinic.email = this.emailf;
                this.registrationClinic.contactNo = this.contactNof;
                this.registrationClinic.occupation = this.occupation;
                this.registrationClinic.clinic = this.clinic;
                this.registrationClinic.branch = this.branch;
                console.log(" sf 10");
                console.log("this.registrationClinic is : " + this.registrationClinic);
                this.RegistrationService.registerStaffToNewClinic(this.registrationClinic).subscribe(
                    data => {
                    console.log(data);
                    this.signUpStatus = data;
                    if (data === 'SUCCESS') {
                        this._success.next(`You are successfully registered with eQueue ` + this.registrationClinic);
                        console.log(" sf 11");
                        // routed to login page to sign in
                        this.router.navigate(['/staff-login']);
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
        console.log("this.password is : " + this.passwordf);
        console.log("this.cmfpassword is : " + this.confirmPasswordf);
        if (this.passwordf === this.confirmPasswordf) {
            this.registrationClinic.password = this.passwordf;
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
        if (this.name === null || this.name === '' || this.name === undefined) {
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
      this.router.navigate(['/staff-login']);
    }

    onClear(){
      console.log("registration on clearing");
      this.clinicName = null;
      this.branchName = null;
      this.branchTelephone = null;
      this.pCode = null;
      this.clinicAddr = null;
      this.name = null;
      this.addrf = null;
      this.postalf = null;
      this.emailf = null;
      this.passwordf = null;
      this.confirmPasswordf = null;
      this.contactNof = null;
      this.occupation = null;
      // this.clinicOpeningHours.clear();
    }

    enableProceed(e: any) {
      if (e.target.checked) {
        this.checked = e.target.checked;
      } else {
        this.checked = false;
      }
    }

  trackId(index: number, item: object) {
    return item;
  }

  bTrackId(index: number, item: object) {
    return item;
  }

  clearBranch() {
    this.clear();
    this.branchName = null;
    this.branchTelephone = null;
    this.pCode = null;
    this.clinicAddr = null;
    this.openingHourList = Array<OpenHour>();
    this.branchInfoError = false;
  }
}
