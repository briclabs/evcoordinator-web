import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SiteConfiguration } from "../../../models/site-configuration";
import * as bootstrap from 'bootstrap';
import { NgFor } from "@angular/common";
import { RouterModule } from "@angular/router";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'guidelines',
  standalone: true,
  imports: [
    NgFor,
    RouterModule,
  ],
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.css'],
})
export class GuidelinesComponent implements OnInit, AfterViewInit {

  eventGuidelines: { [category: string]: string[] } = {};

  private apiEndpoint = `${environment.apiUrl}/configuration/latest`;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    try {
      this.fetchConfiguration();
    } catch (error) {
      console.error('Error loading app configuration:', error);
    }
  }

  fetchConfiguration(): void {

    this.http.get<SiteConfiguration>(this.apiEndpoint).subscribe({
      next: (data: SiteConfiguration) => {
        const resolvedData = data ?? { eventGuidelines: {} };
        this.eventGuidelines = resolvedData.eventGuidelines;

      },
      error: (error) => {
        console.error('Error fetching configuration:', error);
      },
    });
  }

  getKeys(map: { [key: string]: string[] }): string[] {
    return Object.keys(map);
  }

  formatId(id: string): string {
    return id.toLowerCase().replace(/ /g, '-');
  }

  ngAfterViewInit(): void {
    const scrollElement = document.querySelector('.scrollspy-guidelines');
    if (scrollElement) {
      new bootstrap.ScrollSpy(scrollElement, {
        target: '#guidelines-list',
        smoothScroll: true,
      });
    }
  }

  protected scrollTo(event: Event, category: string): void {
    event.preventDefault();
    const id = this.formatId(category);
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
