import { Component, HostListener, inject, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
  selector: 'evc-tools-menu',
  templateUrl: './tools-menu.component.html',
  standalone: true,
  styleUrls: ['./tools-menu.component.css'],
})
export class ToolsMenuComponent implements OnInit {
  readonly authenticationService: OidcSecurityService = inject(OidcSecurityService);
  protected isSmallScreen: boolean = false;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  logout(): void {
    this.authenticationService
      .logoff()
      .subscribe((result) => console.log(result));
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
    this.modifyOffCanvasStyle();
  }

  private modifyOffCanvasStyle() {
    const offcanvasElement = this.document.querySelector('.offcanvas.offcanvas-end') as HTMLElement;

    if (offcanvasElement) {
      if (this.isSmallScreen) {
        this.renderer.setStyle(offcanvasElement, 'right', 'auto');
      } else {
        this.renderer.removeStyle(offcanvasElement, 'right');
      }
    }
  }

}
