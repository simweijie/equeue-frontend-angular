import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { TestModComponent } from './test-mod/test-mod.component';
import {SmartSearchComponent} from './smart-search/smart-search.component';
import {StaffInfoComponent} from './staff-info/staff-info.component';
import {PatientLoginComponent} from './patient-login/patient-login.component';
import {PatientQueueComponent} from './patient-queue/patient-queue.component';
import {SmartSearchMemberComponent} from './smart-search-member/smart-search-member.component';
import { RegistrationStaffComponent } from './registration/registration-staff.component';
import { RegistrationClinicComponent } from './registration/registration-clinic.component';
import { StaffLoginComponent } from './staff-login/staff-login.component';
import { PatientViewDetailsComponent } from './patient-view-details/patient-view-details.component';
import {GlobalConstants} from "./shared/global-constants";

const routes: Routes = [
  // {path: '', component: AppComponent},
  {path: '', component: SmartSearchComponent},
  {path: 'test-mod', component: TestModComponent},
  // {path: 'registration', component: RegistrationComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'registration-staff', component: RegistrationStaffComponent},
  {path: 'registration-clinic', component: RegistrationClinicComponent},
  {path: 'smart-search', component: SmartSearchComponent},
  // {path: 'staff-info/:staffId', component: StaffInfoComponent},
  // {path: 'patient-login/:clinicId', component: PatientLoginComponent},
  {path: 'staff-info', component: StaffInfoComponent},
  // {path: 'patient-login', component: PatientLoginComponent, data: {branchId: GlobalConstants.branchId}},
  {path: 'patient-login', component: PatientLoginComponent},
  {path: 'patient-queue', component: PatientQueueComponent},
  {path: 'smart-search-member', component: SmartSearchMemberComponent},
  {path: 'staff-login', component: StaffLoginComponent},
  {path: 'patient-view-details', component: PatientViewDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
