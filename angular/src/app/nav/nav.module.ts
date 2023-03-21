import { NgModule } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import {CoordinatorToolsMenuComponent} from "./coordinator-tools-menu/coordinator-tools-menu.component";
import {NavComponent} from "./nav.component";


@NgModule({
  declarations: [
    HeaderComponent,
    CoordinatorToolsMenuComponent,
    NavComponent,
  ],
  imports: [],
  exports: [NavComponent],
  providers: [],
  bootstrap: [NavComponent]
})
export class NavModule { }
