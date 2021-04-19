import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {PatientLoginService} from '../shared/services/patient-login.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime} from 'rxjs/operators';
import {GlobalConstants} from '../shared/global-constants';
import {Login} from "../shared/modals/login.modal";
import {SmartSearchService} from "../shared/services/smart-search.service";

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class PatientLoginComponent implements OnInit {
  // Toast message
  private _success = new Subject<string>();
  private _error = new Subject<string>();
  successMessage: string;
  errorMessage: string;

  username: any;
  password: any;
  branchId: string | null;
  mobile: any;

  modalForgotRef: BsModalRef;
  @ViewChild('forgotModal') modalForgot: TemplateRef<any>;
  // private status: string | Object | null | string;
  private loginInfo: Login;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private patientLoginService: PatientLoginService,
    private smartSearchService: SmartSearchService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private messageService: MessageService,
  ) {
    this.loginInfo = new Login();
  }

  ngOnInit(): void {
    this.getId();

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(40000)
    ).subscribe(() => this.successMessage = '');

    this._error.subscribe((message) => this.errorMessage = message);
  }

  getId() {
    console.log('GlobalConstants.branchId');
    console.log(GlobalConstants.branchId);
  }

  forgot() {
    this.modalForgotRef = this.modalService.show(this.modalForgot);
  }

  forgotPassword() {
    this.patientLoginService.forgot({mobile: this.mobile}).subscribe(
      data => {
        console.log(data);
        // this.status = data;
        if (data === 'SUCCESS') {
          this._success.next(`Please check your mobile no.`);
        } else {
          this._error.next(`You are not an existing member. Please sign up!`);
        }
        this.cancel();
      });
  }

  clear() {
    this.username = '';
    this.password = '';
  }

  loginFunction() {
    if (this.username !== null && this.username !== '' && this.username !== undefined &&
      this.password !== null && this.password !== '' && this.password !== undefined) {
      this.patientLoginService.loginFunction({email: this.username, password: this.password}).subscribe(
        data => {
          if (data !== 'ERROR') {
            console.log(data);
            // @ts-ignore
            this.loginInfo = data.data[0];
            console.log(this.loginInfo);
            if (this.loginInfo !== null && this.loginInfo !== undefined) {
              GlobalConstants.login = this.loginInfo;
              console.log('GlobalConstants.login: ');
              console.log(GlobalConstants.login);
              if (GlobalConstants.branchId !== null && GlobalConstants.branchId !== '' && GlobalConstants.branchId !== undefined) {
                // GlobalConstants.clinicId = this.clinicId;
                this.joinQueue(GlobalConstants.branchId, GlobalConstants.login.id);
              } else {
                console.log('GlobalConstants.login.id: ');
                console.log(GlobalConstants.login.id);
                this.router.navigate(['/patient-view-details']);
              }
            } else {
              this._error.next(`Incorrect Username or Password!`);
            }
          } else {
            this._error.next(`Unable to login!`);
          }
          this.clear();
        });
    } else {
      this.checkRequiredFields();
    }
  }

  checkRequiredFields() {
    console.log('checking if required fields are filled up');
    if (this.username === null || this.username === '' || this.username === undefined) {
      this._error.next("Please enter all required fields marked with '*'.");
      console.log(' sf 1');
    }
    if (this.password === null || this.password === '' || this.password === undefined) {
      this._error.next("Please enter all required fields marked with '*'.");
      console.log(' sf 4');
    }
    console.log('end of checks');
  }

  cancel() {
    this.modalForgotRef.hide();
    this.mobile = '';
  }

  signUp() {
    // GlobalConstants.clinicId = this.clinicId;
    this.router.navigate(['/registration/', {branchId: GlobalConstants.branchId}]);
  }

  return() {
    this.router.navigate(['/']);
  }

  joinQueue(branch: string, customer: string | undefined) {
    console.log('joinQueue - branchId:');
    if (branch !== null && branch !== '' && branch !== undefined && customer !== null && customer !== '' && customer !== undefined) {
      this.smartSearchService.joinQueue({branchId: branch, customerId: customer}).subscribe(
        data => {
          console.log(data);
          if (data === 'SUCCESS') {
            console.log('Successfully Joined');
            this.router.navigate(['/patient-view-details']);
          } else {
            alert('Unable to join the queue. Please try again later!');
            this.router.navigate(['/smart-search-member']);
          }
          this.decline();
        });
    }
  }
  decline() {
    GlobalConstants.branchId = '';
  }
}
