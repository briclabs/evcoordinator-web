import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";
import { ToolsMenuComponent } from "./tools-menu/tools-menu.component";
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'evc-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [
    ToolsMenuComponent,
    HeaderComponent,
  ],
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  protected readonly AppComponent = AppComponent;
}
