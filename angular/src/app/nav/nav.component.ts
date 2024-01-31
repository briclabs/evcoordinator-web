import { Component, inject } from '@angular/core';
import { AppComponent } from "../app.component";
import { AuthenticationService } from "../app-services/authentication/authentication.service";

@Component({
  selector: 'evc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  protected readonly AppComponent = AppComponent;
  authenticationService: AuthenticationService = inject(AuthenticationService)
}
