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
  clinicId: string | null;
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
    // this.getId();

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(40000)
    ).subscribe(() => this.successMessage = '');

    this._error.subscribe((message) => this.errorMessage = message);
  }

  // getId() {
  //   // this.activatedRoute.queryParams.subscribe(params => {
  //   //   this.clinicId = params['clinicId'];
  //   // });
  //   // this.clinicId = this.activatedRoute.snapshot.paramMap.get('clinicId');
  //   this.clinicId = GlobalConstants.clinicId;
  //   console.log('clinicId');
  //   console.log(this.clinicId);
  // }

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
      this.patientLoginService.loginFunction({username: this.username, password: this.password}).subscribe(
        data => {
          if (data !== 'ERROR') {
            console.log(data);
            // @ts-ignore
            this.loginInfo = data.data;
            if (this.loginInfo.id !== null) {
              GlobalConstants.login = this.loginInfo;
              if (GlobalConstants.branchId !== null && GlobalConstants.branchId  !== '') {
                // GlobalConstants.clinicId = this.clinicId;
                this.joinQueue(GlobalConstants.branchId, GlobalConstants.login.id);
              } else {
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
    }
  }

  cancel() {
    this.modalForgotRef.hide();
    this.mobile = '';
  }

  signUp() {
    // GlobalConstants.clinicId = this.clinicId;
    this.router.navigate(['/registration']);
  }

  return() {
    this.router.navigate(['/']);
  }

  joinQueue(branch: string, customer: string | undefined) {
    console.log('joinQueue - branchId:');
    if ((branch !== null || branch !== '') && (customer !== null || customer !== '' || customer !== undefined)) {
      this.smartSearchService.joinQueue({branchId: branch, customerId: customer}).subscribe(
        data => {
          console.log(data);
          if (data === 'SUCCESS') {
            console.log('Successfully Joined');
          } else {
            alert('Unable to join the queue. Please refresh page or try again later!');
          }
          this.decline();
          this.router.navigate(['/patient-view-details']);
        });
    }
  }
  decline() {
    GlobalConstants.branchId = '';
  }
}
