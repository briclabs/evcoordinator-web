import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client";
import { NavComponent } from "./pages/nav/nav.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly authenticationService = inject(OidcSecurityService);

  ngOnInit(): void {
    this.authenticationService.checkAuth().subscribe();
    this.authenticationService.isAuthenticated().subscribe();
  }
}
