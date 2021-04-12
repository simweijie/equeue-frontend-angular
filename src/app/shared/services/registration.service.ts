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
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'x-api-key': 'Pbo1e5P62c9YPYYbmyT8a703Fst9Eb4YaGipoMRd'
  });
  constructor(private http: HttpClient) { }

  customerSignUp(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/registerCustomer', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
      response => {
        if (response.status === 200) {
          console.log('response is 200');
          return response.body;
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

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/registerStaffToExistingClinic', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
      response => {
        if (response.status === 200) {
          console.log('response is 200');
          return response.body;
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

      return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/registerStaffToNewClinic', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
        response => {
          if (response.status === 200) {
            console.log('response is 200');
            return response.body;
          } else {
            console.log('Error - ');
            console.log(response.body);
            return 'ERROR';
          }
        })).pipe(catchError(error => of('ERROR')));
    }



  // acceptStaff(req?: any){
  //   console.log('req: ');
  //   console.log(req);

  //   return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/query-customer-with-uin', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
  //     response => {
  //       if (response.status === 200) {
  //         console.log('response is 200');
  //         return response.body;
  //       } else {
  //         console.log('Error - ');
  //         console.log(response.body);
  //         return 'ERROR';
  //       }
  //     })).pipe(catchError(error => of('ERROR')));
  // }

  // updateStaff(req?: any){
  //   console.log('req: ');
  //   console.log(req);

  //   return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/update-staff', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
  //     response => {
  //       if (response.status === 200) {
  //         console.log('response is 200');
  //         return response.body;
  //       } else {
  //         console.log('Error - ');
  //         console.log(response.body);
  //         return 'ERROR';
  //       }
  //     })).pipe(catchError(error => of('ERROR')));
  // }
}