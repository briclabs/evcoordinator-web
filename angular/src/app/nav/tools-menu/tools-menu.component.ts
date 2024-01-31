import { Component, inject } from '@angular/core';
import { AuthenticationService } from "../../app-services/authentication/authentication.service";

@Component({
  selector: 'evc-tools-menu',
  templateUrl: './tools-menu.component.html',
  styleUrls: ['./tools-menu.component.css']
})
export class ToolsMenuComponent {
  authenticationService: AuthenticationService = inject(AuthenticationService);
}
