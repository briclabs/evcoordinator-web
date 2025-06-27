import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
  AfterViewInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from "angular-auth-oidc-client";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./pages/nav/header/header.component";
import { ToolsMenuComponent } from "./pages/nav/tools-menu/tools-menu.component";
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
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('header', { static: false }) header!: ElementRef;
  @ViewChild('content', { static: false }) content!: ElementRef;

  private resizeObserver?: ResizeObserver;

  constructor(
    private readonly authenticationService: OidcSecurityService,
    @Inject(DOCUMENT) private document: Document
  ) {
    document.title = environment.appTitle;
  }

  ngOnInit(): void {
    this.authenticationService.checkAuth().subscribe();
    this.authenticationService.isAuthenticated().subscribe();
  }

  @HostListener('window:load')
  onWindowLoad() {
    this.syncSpacerHeights();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncSpacerHeights();
  }

  ngAfterViewInit(): void {
    this.syncSpacerHeights();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private syncSpacerHeights(): void {
    const headerElement = this.document.querySelector('.fixed-header');
    const tableControlsElement = this.document.querySelector('.fixed-table-controls');
    const headerSpacer = this.document.querySelector('#headerSpacer');
    const tableControlsSpacer = this.document.querySelector('#tableControlsSpacer');

    if (headerElement && headerSpacer) {
      const headerHeight = headerElement.getBoundingClientRect().height;
      (headerSpacer as HTMLElement).style.height = `${headerHeight}px`;

      if (tableControlsElement) {
        (tableControlsElement as HTMLElement).style.top = `${headerHeight}px`;

        if (tableControlsSpacer) {
          const tableControlsHeight = tableControlsElement.getBoundingClientRect().height;
          (tableControlsSpacer as HTMLElement).style.height = `${tableControlsHeight}px`;
        }
      }
    }
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.syncSpacerHeights();
    });

    const headerElement = this.document.querySelector('.fixed-header');
    const tableControlsElement = this.document.querySelector('.fixed-table-controls');

    if (headerElement) this.resizeObserver.observe(headerElement);
    if (tableControlsElement) this.resizeObserver.observe(tableControlsElement);
  }
}
