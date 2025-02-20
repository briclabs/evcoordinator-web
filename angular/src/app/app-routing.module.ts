import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DonationsComponent } from './donations/donations.component'
import { GuidelinesComponent } from "./guidelines/guidelines.component";
import { RegistrationComponent } from "./registration/registration.component";
import { SiteConfigComponent } from "./tools/site-config/site-config.component";
import { HistoryComponent } from "./tools/history/history.component";
import { PaymentsComponent } from "./tools/payments/payments.component";
import { ParticipantsComponent } from "./tools/participants/participants.component";
import { EventsComponent } from "./tools/events/events.component";
import { ProfileManagementComponent } from "./tools/profile-management/profile-management.component";
import { MyProfileComponent } from "./tools/my-profile/my-profile.component";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
  {
    path: 'guidelines',
    component: GuidelinesComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'donations',
    component: DonationsComponent
  },
  {
    path: 'tools/events',
    component: EventsComponent,
    canActivate: [() => authGuard()],
  },
  {
    path: 'tools/participants',
    component: ParticipantsComponent,
    canActivate: [() => authGuard()]
  },
  {
    path: 'tools/payments',
    component: PaymentsComponent,
    canActivate: [() => authGuard()]
  },
  {
    path: 'tools/history',
    component: HistoryComponent,
    canActivate: [() => authGuard()]
  },
  {
    path: 'tools/configuration',
    component: SiteConfigComponent,
    canActivate: [() => authGuard()]
  },
  {
    path: 'tools/my-profile',
    component: MyProfileComponent,
    canActivate: [() => authGuard()]
  },
  {
    path: 'tools/profile-management',
    component: ProfileManagementComponent,
    canActivate: [() => authGuard()]
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
