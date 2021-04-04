import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestModComponent } from './test-mod/test-mod.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import { GooglePlaceModule} from 'ngx-google-places-autocomplete';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { HomeComponent, HomeModule } from './home';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { MainComponent } from './main/main.component';
import { SmartSearchComponent } from './smart-search/smart-search.component';
import { StaffInfoComponent } from './staff-info/staff-info.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalModule} from 'ngx-bootstrap/modal';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { PatientQueueComponent } from './patient-queue/patient-queue.component';
import {ToastModule} from 'primeng/toast';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MessagesModule} from 'primeng/messages';
import {PaginatorModule} from 'primeng/paginator';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MatRadioModule} from '@angular/material/radio';
import {RadioButtonModule} from 'primeng/radiobutton';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { SmartSearchMemberComponent } from './smart-search-member/smart-search-member.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    TestModComponent,
    RegistrationComponent,
    SmartSearchComponent,
    StaffInfoComponent,
    PatientLoginComponent,
    PatientQueueComponent,
    SmartSearchMemberComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatPaginatorModule, MatTableModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatRadioModule,
    RadioButtonModule, InputTextareaModule,
    PaginatorModule, ConfirmDialogModule,
    MessagesModule,
    // HomeModule,
    FontAwesomeModule,
    GooglePlaceModule,
    FormsModule,
    HttpClientModule,
    ToastModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDmLBT2T5u8ZT3mOheCgFkSv_7OCx8R1tI'
    })
  ],
  // providers: [AppStateService],
  // bootstrap: [AppComponent]
  bootstrap: [MainComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
