import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LogLevel, provideAuth } from 'angular-auth-oidc-client';
import { environment } from './environments/environment';
import { GatewayInterceptor } from './app/interceptors/gateway.interceptor';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { provideRouter } from "@angular/router";
import { authGuard } from "./app/auth.guard";
import { ProfileManagementComponent } from "./app/tools/profile-management/profile-management.component";
import { SiteConfigComponent } from "./app/tools/site-config/site-config.component";
import { HistoryComponent } from "./app/tools/history/history.component";
import { PaymentsComponent } from "./app/tools/payments/payments.component";
import { EventsComponent } from "./app/tools/events/events.component";
import { DonationsComponent } from "./app/donations/donations.component";
import { RegistrationComponent } from "./app/registration/registration.component";
import { GuidelinesComponent } from "./app/guidelines/guidelines.component";
import { EditProfileComponent } from "./app/tools/profile-management/edit-profile/edit-profile.component";
import { EditEventComponent } from "./app/tools/events/edit-event/edit-event.component";
import { CsrfInterceptor } from "./app/interceptors/csrf.interceptor";
import { RegistrationManagementComponent } from "./app/tools/registration-management/registration-management.component";
import { GuestManagementComponent } from "./app/tools/guest-management/guest-management.component";
import {
  EditRegistrationComponent
} from "./app/tools/registration-management/edit-registration/edit-registration.component";
import { EditGuestComponent } from "./app/tools/guest-management/edit-guest/edit-guest.component";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter([
      { path: 'guidelines', component: GuidelinesComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'donations', component: DonationsComponent },
      {
        path: 'tools/events',
        component: EventsComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/event-info/:id',
        component: EditEventComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/event-info',
        component: EditEventComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/registrations',
        component: RegistrationManagementComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/guests',
        component: GuestManagementComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/payments',
        component: PaymentsComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/history',
        component: HistoryComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/configuration',
        component: SiteConfigComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/my-profile',
        component: EditProfileComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/profile-management',
        component: ProfileManagementComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/edit-profile/:id',
        component: EditProfileComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/edit-profile',
        component: EditProfileComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/edit-registration/:id',
        component: EditRegistrationComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/edit-registration',
        component: EditRegistrationComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/edit-guest/:id',
        component: EditGuestComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/edit-guest',
        component: EditGuestComponent,
        canActivate: [() => authGuard()],
      },
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '**', redirectTo: '/', pathMatch: 'full' },
    ]),
    provideAuth({
      config: {
        authority: environment.authAuthority,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: environment.clientId,
        scope: 'openid profile email offline_access',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
      },
    }),
    { provide: HTTP_INTERCEPTORS, useClass: GatewayInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
  ],
}).catch((err) => console.error(err));
