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
 
    form = this.fb.group({
      clinicOpeningHours: this.fb.array([])
    });

    branchForm = this.fb.group({
      branchInfo: this.fb.array([])
    });

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

    dayOfWeek: Array<object> = [
        {id: "1", value: "Monday"},
        {id: "2", value: "Tuesday"},
        {id: "3", value: "Wednesday"},
        {id: "4", value: "Thursday"},
        {id: "5", value: "Friday"},
        {id: "6", value: "Saturday"},
        {id: "7", value: "Sunday"}
    ];

  occupationList: Array<object> = [
    {id: 'D', value: 'Doctor'},
    {id: 'S', value: 'Nurse'},
    {id: 'A', value: 'Admin'}
  ];
    
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

      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(40000)
      ).subscribe(() => this.successMessage = '');

      this._error.subscribe((message) => this.errorMessage = message);
      this.addOpeningHour();
      this.addBranch();
    }

    get clinicOpeningHours(){
      return this.form.controls["clinicOpeningHours"] as FormArray;
    }

    addOpeningHour(){
      const openingHourForm = this.fb.group({
        openingHourDayOfWeek: ['', Validators.required],
        openingHourStartTime: ['', Validators.required],
        openingHourEndTime: ['', Validators.required]
      });
      this.clinicOpeningHours.push(openingHourForm);
    }

    deleteOpeningHour(openingHourIndex: number) {
      this.clinicOpeningHours.removeAt(openingHourIndex);
    }

    get branchInfo(){
      return this.branchForm.controls["branchInfo"] as FormArray;
    }

    addBranch(){
      const branchInfoForm = this.fb.group({
        branchName: ['', Validators.required],
        branchTele: ['', Validators.required],
        branchPcode: ['', Validators.required],
        branchAddr: ['', Validators.required]
        // branchOpening: ['', Validators.required]
      });
      this.branchInfo.push(branchInfoForm);
    }

    deleteBranch(branchIndex: number) {
      this.branchInfo.removeAt(branchIndex);
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

    onCancel() {
      console.log("registration on cancelling, go back home page");
      this.router.navigate(['/staff-login']);
    }

    onClear(){
      console.log("registration on clearing");
      this.clinicName = null;
      this.branchTelephone = null;
      this.clinicAddr = null;
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
