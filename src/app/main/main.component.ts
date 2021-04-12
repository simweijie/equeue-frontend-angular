import { Component, OnInit, HostListener } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PatientQueueService} from "../shared/services/patient-queue.service";
import {BsModalService} from "ngx-bootstrap/modal";
// import { openNav, closeNav } from '../shared/lalla.js';

@Component({
    selector: 'ic-main',
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
  showFiller = false;
  job: string | null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getJob();
  }
  getJob() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.adminId = params['adminId'];
    // });
    this.job = this.activatedRoute.snapshot.paramMap.get('job');
    console.log('getJob - job:');
    console.log(this.job);
    if(this.job !== null) {

    }
  }



  // openNav() {
  //     Document.getElementById("myNav").style.width = "100%";
  // }
  //
  // /* Close when someone clicks on the "x" symbol inside the overlay */
  // closeNav() {
  //     document.getElementById("myNav").style.width = "0%";
  // }

  login() {
    this.router.navigate(['/patient-login']);
  }
}
