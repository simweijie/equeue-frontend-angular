import {Component, OnInit, HostListener, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PatientQueueService} from "../shared/services/patient-queue.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {GlobalConstants} from '../shared/global-constants';
import {Login} from "../shared/modals/login.modal";
import {CommonService} from '../shared/services/common.service';
// import { openNav, closeNav } from '../shared/lalla.js';

@Component({
    selector: 'ic-main',
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, AfterViewInit {
  // showFiller = false;
  // job: string | undefined;
  login: Login;
  // private username: string | undefined;
  // private isAdmin: string | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.login = new Login();
  }

  ngOnInit() {
    this.getInfo();
  }

  ngAfterViewInit() {
    this.getInfo();
  }

  getInfo() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   GlobalConstants.login.id = params['id'];
    //   console.log('GlobalConstants.login: ' + GlobalConstants.login.id);
    // });
    // this.activatedRoute.data.subscribe(v => {
    //   console.log(v);
    //   GlobalConstants.login = v.login;
    // });
    // GlobalConstants.login = this.activatedRoute.snapshot.paramMap.get('job');
    // @ts-ignore
    GlobalConstants.login.id = this.activatedRoute.snapshot.paramMap.get('id');
    // @ts-ignore
    GlobalConstants.login.job = this.activatedRoute.snapshot.paramMap.get('job');
    // @ts-ignore
    GlobalConstants.login.name = this.activatedRoute.snapshot.paramMap.get('name');
    console.log('getInfo - job:');
    if (GlobalConstants.login === undefined) {
      this.login = new Login();
    } else {
      this.login = GlobalConstants.login;
    }
    console.log('this.login: ');
    console.log(this.login);
    console.log('GlobalConstants.login: ');
    console.log(GlobalConstants.login);
  }



  // openNav() {
  //     Document.getElementById("myNav").style.width = "100%";
  // }
  //
  // /* Close when someone clicks on the "x" symbol inside the overlay */
  // closeNav() {
  //     document.getElementById("myNav").style.width = "0%";
  // }
  logout() {
    if (this.login.id !== '') {
      if (this.login.job !== null || this.login.job !== undefined || this.login.job !== '')
        this.commonService.logout({username: this.login.id}).subscribe(
          data => {
            console.log('1' + data);
            if (data === 'SUCCESS') {
              console.log('2' + data);
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/']);
            }
            GlobalConstants.login = new Login();
            GlobalConstants.clinicId = '';
          });
    } else {
      this.commonService.staffLogout({username: this.login.id}).subscribe(
        data => {
          console.log('1' + data);
          if (data === 'SUCCESS') {
            console.log('2' + data);
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }
          GlobalConstants.login = new Login();
          GlobalConstants.clinicId = '';
        });
    }
  }
}
