import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  httpOptions: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': 'Pbo1e5P62c9YPYYbmyT8a703Fst9Eb4YaGipoMRd'
  });

  constructor(private http: HttpClient) { }

  retrieveClinicList(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/list-of-clinics', { headers: this.httpOptions, observe: 'response' }).pipe(map(
      response => {
        if (response === 200) {
          console.log('response is 200');
          return response;
        } else {
          console.log('Error - ');
          console.log(response);
          return 'ERROR';
        }
      })).pipe(catchError(error => of('ERROR')));
  }

  retrieveBranchList(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/list-of-branches', { headers: this.httpOptions, observe: 'response' }).pipe(map(
      response => {
        if (response === 200) {
          console.log('response is 200');
          return response;
        } else {
          console.log('Error - ');
          console.log(response);
          return 'ERROR';
        }
      })).pipe(catchError(error => of('ERROR')));
  }

  listOfBranchesWithClinicId(req?: any){
    console.log('req: ');
    console.log(req);

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/list-of-branches-with-clinic-id', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
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
