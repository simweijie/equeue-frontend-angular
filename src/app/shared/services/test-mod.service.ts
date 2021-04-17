import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {ITestMod} from '../modals/test-mod.modal';

type EntityArrayResponseType = HttpResponse<ITestMod[]>;

@Injectable({
  providedIn: 'root'
})
export class TestModService {
  httpOptions: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'Pbo1e5P62c9YPYYbmyT8a703Fst9Eb4YaGipoMRd'
  });

  constructor(private http: HttpClient) { }

  testPost(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/query-customer-with-uin', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
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

  testListOfClinic(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/list-of-clinics', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
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

  testDelete(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.delete('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/deleteOpeningHours/' + req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
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
