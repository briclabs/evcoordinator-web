import { Component, inject, Signal } from '@angular/core';
import { AuthenticatedResult, OidcSecurityService, UserDataResult } from "angular-auth-oidc-client";
import { NgIf } from "@angular/common";

@Component({
  selector: 'evc-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    NgIf,
  ],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private readonly authenticationService: OidcSecurityService = inject(OidcSecurityService);
  protected readonly authenticated: Signal<AuthenticatedResult> = this.authenticationService.authenticated;
  private readonly userData: Signal<UserDataResult> = this.authenticationService.userData;

  login(): void {
    this.authenticationService.authorize();
  }

  getUsername(): string {
    return this.userData().userData['preferred_username'];
  }

  getIsAuthenticated(): boolean {
    return this.authenticated().isAuthenticated;
  }
}
