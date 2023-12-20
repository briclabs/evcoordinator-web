import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DonationsComponent } from './donations/donations.component'
import { GuidelinesComponent } from "./guidelines/guidelines.component";
import { RegistrationComponent } from "./registration/registration.component";

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
