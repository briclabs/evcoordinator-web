import { Component, inject } from '@angular/core';
import { AuthenticationService } from "../../app-services/authentication/authentication.service";

@Component({
  selector: 'evc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  authenticationService: AuthenticationService = inject(AuthenticationService)
}
