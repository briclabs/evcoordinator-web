import { Component, HostListener, inject, OnInit, Signal } from '@angular/core';
import { AuthenticatedResult, OidcSecurityService, UserDataResult } from "angular-auth-oidc-client";
import { NgClass, NgIf } from "@angular/common";

@Component({
  selector: 'evc-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
  ],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private readonly authenticationService: OidcSecurityService = inject(OidcSecurityService);
  protected readonly authenticated: Signal<AuthenticatedResult> = this.authenticationService.authenticated;
  private readonly userData: Signal<UserDataResult> = this.authenticationService.userData;
  protected isSmallScreen: boolean = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  login(): void {
    this.authenticationService.authorize();
  }

  getUsername(): string {
    return this.userData().userData['preferred_username'];
  }

  getIsAuthenticated(): boolean {
    return this.authenticated().isAuthenticated;
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
