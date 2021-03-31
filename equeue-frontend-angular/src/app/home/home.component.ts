import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { sharedURL } from '../shared/url/sharedurl';

@Component({
    selector: 'ic-home',
    templateUrl: './home.component.html',
  
})
export class HomeComponent implements OnInit {
    sharedURL: sharedURL;
    constructor(
        private router: Router,
    ) {
        this.sharedURL = new sharedURL();
    }

    ngOnInit() {}

    gpSearch() {
        console.log("at home page, test");
        this.router.navigate(['/registration']);
    }

    @HostListener('window:keydown', ['$event'])
    onEvent(event: any) {
        if (event.keyCode === 8) {
            event.preventDefault();
        }
    }
}
