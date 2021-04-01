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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'x-api-key': 'Pbo1e5P62c9YPYYbmyT8a703Fst9Eb4YaGipoMRd'
  });

  constructor(private http: HttpClient) { }

  testPost(req?: any){
    console.log('req: ');
    console.log(req);

    // let httpOptions: HttpHeaders = new HttpHeaders(
    //   {'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Credentials': 'true',
    //   'Access-Control-Allow-Headers': 'Content-Type',
    //   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    //   'key': 'x-api-key',
    //   'value': 'Pbo1e5P62c9YPYYbmyT8a703Fst9Eb4YaGipoMRd'}
    //   );
    // httpOptions = httpOptions.append('Content-Type', 'application/json');
    // httpOptions = httpOptions.append('x-api-key', 'Pbo1e5P62c9YPYYbmyT8a703Fst9Eb4YaGipoMRd');

    return this.http.post('https://c3cwmli2ne.execute-api.us-east-1.amazonaws.com/equeue/api/query-customer-with-uin', req, { headers: this.httpOptions, observe: 'response' }).pipe(map(
      response => {
        if (response.status === 200) {
          console.log('response is 200');
          return response.body;
        } else if (response.status === 403) {
          console.log('Access Denied - 403');
          return 'Error 403';
        } else {
          console.log('Error - ');
          console.log(response.body);
          return response.body;
        }
      })).pipe(catchError(error => of('ERROR')));
  }

  testDelete(req?: any){
    console.log('req: ');
    console.log(req);

    let httpOptions: HttpHeaders = new HttpHeaders();
    httpOptions = httpOptions.append('Content-Type', 'application/json');

    return this.http.delete('http://www.url.com/deleteOpeningHours/' + req, { headers: httpOptions, observe: 'response' }).pipe(map(
      response => {
        if (response.status === 200) {
          console.log('response is 200');
          return response.body;
        } else if (response.status === 403) {
          console.log('Access Denied - 403');
          return 'Error 403';
        } else {
          console.log('Error - ');
          console.log(response.status);
          return response.statusText;
        }
      })).pipe(catchError(error => of('ERROR')));
  }
}
