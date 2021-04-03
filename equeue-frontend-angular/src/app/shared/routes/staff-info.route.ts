import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import {StaffInfoEditComponent} from '../../staff-info-edit/staff-info-edit.component';
import {StaffInfoService} from '../services/staff-info.service';

@Injectable({providedIn: 'root'})
export class StaffInfoResolve implements Resolve<any> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params['id'] ? route.params['id'] : null;
  }
}

export const staffInfoRoute: Routes = [
  {
    path: 'status/:id/edit',
    component: StaffInfoEditComponent,
    resolve: {
      ruleAdmin: StaffInfoResolve
    }
  },
];

export const staffInfoPopupRoute: Routes = [
];
