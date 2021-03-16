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

  constructor(private http: HttpClient) { }

  testPost(req?: any){
    console.log('req: ');
    console.log(req);

    let httpOptions: HttpHeaders = new HttpHeaders();
    httpOptions = httpOptions.append('Content-Type', 'application/json');

    return this.http.post('/testPost', req, { headers: httpOptions, observe: 'response' }).pipe(map(
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
