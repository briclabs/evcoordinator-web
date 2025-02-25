import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  protected readonly appName: string = 'EVCoordinator';

  private readonly authenticationService = inject(OidcSecurityService);

  ngOnInit(): void {
    this.authenticationService.checkAuth().subscribe();
    this.authenticationService.isAuthenticated().subscribe();
  }
}
