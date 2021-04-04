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

const routes: Routes = [
  // {path: '', component: AppComponent},
  {path: '', component: HomeComponent},
  {path: 'test-mod', component: TestModComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'smart-search', component: SmartSearchComponent},
  {path: 'staff-info/:adminId', component: StaffInfoComponent},
  {path: 'patient-login/:clinicId', component: PatientLoginComponent},
  {path: 'patient-queue', component: PatientQueueComponent},
  {path: 'smart-search-member', component: SmartSearchMemberComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
