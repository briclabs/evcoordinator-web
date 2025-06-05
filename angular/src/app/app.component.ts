import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
  Renderer2,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from "angular-auth-oidc-client";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./pages/nav/header/header.component";
import { ToolsMenuComponent } from "./pages/nav/tools-menu/tools-menu.component";
import { filter } from "rxjs/operators";
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    ToolsMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('header', { static: false }) header!: ElementRef;
  @ViewChild('content', { static: false }) content!: ElementRef;

  constructor(
    private readonly authenticationService: OidcSecurityService,
    private readonly router: Router,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    document.title = environment.appTitle;
  }

  ngOnInit(): void {
    this.authenticationService.checkAuth().subscribe();
    this.authenticationService.isAuthenticated().subscribe();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.updateTops();
        });
      });
  }

  @HostListener('window:load')
  onWindowLoad() {
    this.updateTops();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateTops();
  }

  updateTops() {
    if (!this.header || !this.content) {
      return;
    }

    const headerHeight: number = this.header.nativeElement.querySelector('.fixed-top')?.getBoundingClientRect()?.height || 0;

    const contentHeight = this.updateTopOfTableControlsIfPresent(headerHeight);
    this.updateTopOfTableHeaderIfPresent(contentHeight);
    this.updateTopOfContentBody(contentHeight);
  }

  private updateTopOfTableControlsIfPresent(headerHeight: number) {
    const tableControls: HTMLElement | null = this.document.querySelector('table-controls .fixed-top');
    const contentHeight = headerHeight + (tableControls?.getBoundingClientRect()?.height || 0);
    if (tableControls) {
      this.renderer.setStyle(tableControls, 'top', `${headerHeight}px`);
    }
    return contentHeight;
  }

  private updateTopOfTableHeaderIfPresent(contentHeight: number) {
    const tableHeader: HTMLElement | null = this.document.querySelector('app-table thead');
    if (tableHeader) {
      this.renderer.setStyle(tableHeader, 'top', `${contentHeight}px`);
    }
  }

  private updateTopOfContentBody(contentHeight: number) {
    const contentBody = this.content.nativeElement;
    this.renderer.setStyle(contentBody, 'top', `${contentHeight}px`);
  }
}
