import { NgModule } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { ToolsMenuComponent } from "./tools-menu/tools-menu.component";
import { NavComponent } from "./nav.component";
import { NgIf } from "@angular/common";


@NgModule({
  declarations: [
    HeaderComponent,
    ToolsMenuComponent,
    NavComponent,
  ],
  imports: [
    NgIf,
  ],
  exports: [NavComponent],
  providers: [],
  bootstrap: [NavComponent]
})
export class NavModule { }
