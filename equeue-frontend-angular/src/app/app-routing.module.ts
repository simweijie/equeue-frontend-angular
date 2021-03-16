import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TestModComponent } from './test-mod/test-mod.component';

const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'test-mod', component: TestModComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
