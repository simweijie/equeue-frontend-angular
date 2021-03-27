import { Injectable } from '@angular/core';
import { scan } from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AppStateService{
  private trigger = new Subject();
  private state: any;

  constructor(){
    this.state = this.trigger.pipe(
      scan(current => !current, true)
    );
  }

  public toggleDim(): void {
    this.trigger.next();
  }

  public getDim(): Observable<boolean> {
    return this.state.asObservable();
  }
}
