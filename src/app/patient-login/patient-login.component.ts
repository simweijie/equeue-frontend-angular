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
  private status: string | Object | null | string;
  private loginInfo: Login;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private patientLoginService: PatientLoginService,
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
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.clinicId = params['clinicId'];
    // });
    // this.clinicId = this.activatedRoute.snapshot.paramMap.get('clinicId');
    this.clinicId = GlobalConstants.clinicId;
    console.log('clinicId');
    console.log(this.clinicId);
  }

  forgot() {
    this.modalForgotRef = this.modalService.show(this.modalForgot);
  }

  forgotPassword() {
    this.patientLoginService.forgot({mobile: this.mobile}).subscribe(
      data => {
        console.log(data);
        this.status = data;
        if (this.status === 'Success') {
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
    if (this.username !== '' && this.password !== '') {
      this.patientLoginService.loginFunction({username: this.username, password: this.password}).subscribe(
        data => {
          console.log(data);
          // @ts-ignore
          this.loginInfo = data;
          if (this.loginInfo.id !== null) {
            if (this.clinicId !== null || this.clinicId !== '') {
              GlobalConstants.clinicId = this.clinicId;
              GlobalConstants.login = this.loginInfo;
              GlobalConstants.username = this.username;
              this.router.navigate(['/patient-view-details']);
            } else {
              this.router.navigate(['/patient-view-details']);
            }
          } else {
            this._error.next(`Incorrect Username or Password!`);
          }
          this.cancel();
        });
    }
  }

  cancel() {
    this.modalForgotRef.hide();
    this.mobile = '';
  }

  signUp() {
    GlobalConstants.clinicId = this.clinicId;
    this.router.navigate(['/registration']);
  }

  return() {
    this.router.navigate(['/']);
  }
}
