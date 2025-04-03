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
import { ProfileManagementComponent } from "./app/pages/tools/profile-management/profile-management.component";
import { SiteConfigComponent } from "./app/pages/tools/site-config/site-config.component";
import { HistoryComponent } from "./app/pages/tools/history/history.component";
import { PaymentManagementComponent } from "./app/pages/tools/payment-management/payment-management.component";
import { EventManagementComponent } from "./app/pages/tools/event-management/event-management.component";
import { DonationsComponent } from "./app/pages/public/donations/donations.component";
import { RegistrationComponent } from "./app/pages/public/registration/registration.component";
import { GuidelinesComponent } from "./app/pages/public/guidelines/guidelines.component";
import { EditProfileComponent } from "./app/pages/tools/profile-management/edit-profile/edit-profile.component";
import { EditEventComponent } from "./app/pages/tools/event-management/edit-event/edit-event.component";
import { CsrfInterceptor } from "./app/interceptors/csrf.interceptor";
import { RegistrationManagementComponent } from "./app/pages/tools/registration-management/registration-management.component";
import { GuestManagementComponent } from "./app/pages/tools/guest-management/guest-management.component";
import {
  EditRegistrationComponent
} from "./app/pages/tools/registration-management/edit-registration/edit-registration.component";
import { EditGuestComponent } from "./app/pages/tools/guest-management/edit-guest/edit-guest.component";
import { EditPaymentComponent } from "./app/pages/tools/payment-management/edit-payment/edit-payment.component";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter([
      // PUBLIC FACING
      { path: 'guidelines', component: GuidelinesComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'donations', component: DonationsComponent },
      // HISTORY LOG
      {
        path: 'tools/history',
        component: HistoryComponent,
        canActivate: [() => authGuard()],
      },
      // SITE CONFIGURATION
      {
        path: 'tools/configuration',
        component: SiteConfigComponent,
        canActivate: [() => authGuard()],
      },
      // EVENT MANAGEMENT
      {
        path: 'tools/events',
        component: EventManagementComponent,
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
      // REGISTRATION MANAGEMENT
      {
        path: 'tools/registrations',
        component: RegistrationManagementComponent,
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
      // GUEST MANAGEMENT
      {
        path: 'tools/guests',
        component: GuestManagementComponent,
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
      // PAYMENT MANAGEMENT
      {
        path: 'tools/payments',
        component: PaymentManagementComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/edit-payment/:id',
        component: EditPaymentComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/edit-payment',
        component: EditPaymentComponent,
        canActivate: [() => authGuard()],
      },
      // PROFILE MANAGEMENT
      {
        path: 'tools/profile-management',
        component: ProfileManagementComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/my-profile',
        component: EditProfileComponent,
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
      // FALLBACK
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
