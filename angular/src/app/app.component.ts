import { Component, ElementRef, ViewChild, inject, OnInit, HostListener } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./pages/nav/header/header.component";
import { ToolsMenuComponent } from "./pages/nav/tools-menu/tools-menu.component";

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
  @HostListener('window:resize') onResize() {
    this.updateTops();
  }

  @ViewChild('header', { static: false }) header!: ElementRef;
  @ViewChild('content', { static: false }) content!: ElementRef;

  private readonly authenticationService = inject(OidcSecurityService);

  @HostListener('window:load', ['$event'])
  onWindowLoad() {
    this.updateTops();
  }

  ngOnInit(): void {
    this.authenticationService.checkAuth().subscribe();
    this.authenticationService.isAuthenticated().subscribe();
  }

  updateTops() {
    const contentBody = this.content.nativeElement;
    const headerHeight: number = this.header.nativeElement.querySelector('.fixed-top').getBoundingClientRect().height;
    const tableControls: HTMLElement | null = document.querySelector('table-controls .fixed-top');
    const tableHeader: HTMLElement | null = document.querySelector('app-table thead');
    const tableHeaderHeight: number = tableHeader?.getBoundingClientRect().height ?? 0;
    const headerHeightPlusTableControlsHeight: number = headerHeight + (tableControls?.getBoundingClientRect().height ?? 0);
    const tableBody: HTMLElement | null = document.querySelector('app-table tbody');

    console.log('Table header: ', tableHeader);
    console.log('Table header height: ', tableHeaderHeight);

    // set the content top
    contentBody?.setAttribute('style', 'top: ' + headerHeightPlusTableControlsHeight + 'px');

    // set the top of the table controls, if present
    tableControls?.setAttribute('style', 'top: ' + headerHeight + 'px;');

    // set the top of the table header, if present
    tableHeader?.setAttribute('style', 'top: ' + headerHeightPlusTableControlsHeight + 'px;');
  }
}
