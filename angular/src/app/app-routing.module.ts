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

const routes: Routes = [
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
    component: EventsComponent
  },
  {
    path: 'tools/participants',
    component: ParticipantsComponent
  },
  {
    path: 'tools/payments',
    component: PaymentsComponent
  },
  {
    path: 'tools/history',
    component: HistoryComponent
  },
  {
    path: 'tools/configuration',
    component: SiteConfigComponent
  },
  {
    path: 'tools/my-profile',
    component: MyProfileComponent
  },
  {
    path: 'tools/profile-management',
    component: ProfileManagementComponent
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
