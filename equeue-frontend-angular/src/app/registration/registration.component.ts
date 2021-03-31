import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'ic-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['registration.component.css']
})
export class RegistrationComponent implements OnInit {
    fullname: string;
    nric: string;

    constructor(private router: Router) {
        this.fullname = '';
        // this.input.fullname = '';
        // this.serverErrorMsg = 'errorMsg';
        // this.errorFlag = false;
        this.nric =';'
    }

    loadAll() {}
    ngOnInit() {
      console.log("here at registration hello");
    }

    // handleKeyboardEvent(event: KeyboardEvent, editForm: NgForm) {
    //     if (event.key === 'Enter') {
    //         this.onSignUp(editForm);
    //     }
    // }

    // @HostListener('window:keydown', ['$event'])
    // onEvent(event: any) {
    //     // backspace
    //     const activeTextInputArea = document.activeElement;
    //     if (activeTextInputArea.id === 'docRefNo') {
    //         this.docRefNoFocus = true;
    //     } else {
    //         this.docRefNoFocus = false;
    //     }
    //     if (this.docRefNoFocus === true) {
    //         if (event.keyCode === 8 && (this.document.docRefNo === null || this.document.docRefNo === undefined)) {
    //             console.log(' backspace and null ');
    //             event.preventDefault();
    //         }
    //     } else {
    //         if (event.keyCode === 8) {
    //             console.log(' backspace and null ');
    //             event.preventDefault();
    //         }
    //     }
    // }

    onSignUp(editForm: NgForm){
        console.log("here at registration, signup test completed");
    }

    onCancel() {

    }

    onClear(){

    }
}