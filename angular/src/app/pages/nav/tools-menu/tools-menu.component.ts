import { Component, inject } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
  selector: 'evc-tools-menu',
  templateUrl: './tools-menu.component.html',
  standalone: true,
  styleUrls: ['./tools-menu.component.css'],
})
export class ToolsMenuComponent {
  private readonly authenticationService: OidcSecurityService = inject(OidcSecurityService);

  logout(): void {
    this.authenticationService
      .logoff()
      .subscribe((result) => console.log(result));
  }
}
