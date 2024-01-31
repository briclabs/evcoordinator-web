import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavModule } from "./nav/nav.module";
import { DonationsComponent } from "./donations/donations.component";
import { GuidelinesComponent } from "./guidelines/guidelines.component";
import { RegistrationComponent } from "./registration/registration.component";
import { EventsComponent } from "./tools/events/events.component";
import { HistoryComponent } from "./tools/history/history.component";
import { ParticipantsComponent } from "./tools/participants/participants.component";
import { PaymentsComponent } from "./tools/payments/payments.component";
import { SiteConfigComponent } from "./tools/site-config/site-config.component";
import { MyProfileComponent } from './tools/my-profile/my-profile.component';
import { ProfileManagementComponent } from "./tools/profile-management/profile-management.component";
import { TableControlsComponent } from './tools/subcomponents/table-controls/table-controls.component';
import { TableComponent } from './tools/subcomponents/table/table.component';


@NgModule({
  declarations: [
    AppComponent,
    DonationsComponent,
    GuidelinesComponent,
    RegistrationComponent,
    EventsComponent,
    HistoryComponent,
    ParticipantsComponent,
    PaymentsComponent,
    SiteConfigComponent,
    ProfileManagementComponent,
    MyProfileComponent,
    TableControlsComponent,
    TableComponent
  ],
  imports: [
    NavModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
