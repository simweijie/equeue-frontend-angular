import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  httpOptions: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': 'Pbo1e5P62c9YPYYbmyT8a703Fst9Eb4YaGipoMRd'
  });
  constructor(private http: HttpClient) { }

  customerSignUp(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/register-customer', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
      response => {
        if (response.status === 200) {
          console.log('response is 200');
          return 'SUCCESS';
        } else {
          console.log('Error - ');
          console.log(response.body);
          return 'ERROR';
        }
      })).pipe(catchError(error => of('ERROR')));
  }

  registerStaffToExistingClinic(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/register-staff-to-existing-clinic', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
      response => {
        if (response.status === 200) {
          console.log('response is 200');
          return 'SUCCESS';
        } else {
          console.log('Error - ');
          console.log(response.body);
          return 'ERROR';
        }
      })).pipe(catchError(error => of('ERROR')));
  }

  
  registerStaffToNewClinic(req?: any){
      console.log('req: ');
      console.log(req);

      return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/register-staff-to-new-clinic', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
        response => {
          if (response.status === 200) {
            console.log('response is 200');
            return 'SUCCESS';
          } else {
            console.log('Error - ');
            console.log(response.body);
            return 'ERROR';
          }
        })).pipe(catchError(error => of('ERROR')));
    }

    testGeoCode(req?: any){
      console.log('req: ');
      console.log(req);
      // var httpOptions1: HttpHeaders = new HttpHeaders({
      //   // 'Content-Type': 'application/json'
      // });
  
      return this.http.get('https://geocode.xyz/' + req + '?json=1&auth=610971777398867696537x51416').pipe(map(
        response => {
          return response;
          // if (response.status === 200) {
          //   console.log('response is 200');
          //   return response.body;
          // } else {
          //   console.log('Error - ');
          //   console.log(response.body);
          //   return 'ERROR';
          // }
        })).pipe(catchError(error => of('ERROR')));
    }
}
