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
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthModule, LogLevel } from "angular-auth-oidc-client";
import { GatewayInterceptor } from "./interceptors/gateway.interceptor";
import { AuthInterceptor } from "./interceptors/auth.interceptor";


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
    TableComponent,
  ],
  imports: [
    NavModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      config: {
        authority: 'http://localhost:9000/application/o/evcoordinator/',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'evcoordinator',
        scope: 'openid profile email offline_access',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
      }
    })
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: GatewayInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
