import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartSearchService {
  httpOptions: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': 'Pbo1e5P62c9YPYYbmyT8a703Fst9Eb4YaGipoMRd'
  });

  constructor(private http: HttpClient) { }

  searchByGP(req?: any){
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

  searchByDistrictOrMGroup(req?: any){
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

  changeQueue(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/change-queue', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
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
}
