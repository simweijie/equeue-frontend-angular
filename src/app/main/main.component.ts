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
  showFiller = false;
  job: string | undefined;
  private login: Login;
  private username: string | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getInfo();
  }

  ngAfterViewInit() {
    this.getInfo();
  }

  getInfo() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.adminId = params['adminId'];
    // });
    // GlobalConstants.job = this.activatedRoute.snapshot.paramMap.get('job');
    console.log('getInfo - job:');
    this.login = GlobalConstants.login;
    if (this.login !== null) {
      this.job = this.login.job;
    }
    console.log(this.job);
    this.username = GlobalConstants.login.username;
    console.log('getInfo - username:');
    console.log(this.username);
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
    if (this.username !== '') {
      this.commonService.logout({username: this.username}).subscribe(
        data => {
          console.log(data);
          if (data === 'SUCCESS') {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }
          GlobalConstants.login = new Login();
          GlobalConstants.clinicId = null;
        });
    }
  }
}
