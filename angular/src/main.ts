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
import { MyProfileComponent } from "./app/tools/my-profile/my-profile.component";
import { SiteConfigComponent } from "./app/tools/site-config/site-config.component";
import { HistoryComponent } from "./app/tools/history/history.component";
import { PaymentsComponent } from "./app/tools/payments/payments.component";
import { ParticipantsComponent } from "./app/tools/participants/participants.component";
import { EventsComponent } from "./app/tools/events/events.component";
import { DonationsComponent } from "./app/donations/donations.component";
import { RegistrationComponent } from "./app/registration/registration.component";
import { GuidelinesComponent } from "./app/guidelines/guidelines.component";

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
        path: 'tools/participants',
        component: ParticipantsComponent,
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
        component: MyProfileComponent,
        canActivate: [() => authGuard()],
      },
      {
        path: 'tools/profile-management',
        component: ProfileManagementComponent,
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
  ],
}).catch((err) => console.error(err));
