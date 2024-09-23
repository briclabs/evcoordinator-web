import { Component } from '@angular/core';
import { AppComponent } from "../app.component";

@Component({
  selector: 'evc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  protected readonly AppComponent = AppComponent;
}
