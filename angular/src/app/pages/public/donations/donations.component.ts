import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteConfiguration } from "../../../models/site-configuration";
import { environment } from "../../../../environments/environment";
import { NgFor } from "@angular/common";

@Component({
  selector: 'donations',
  standalone: true,
  imports: [
    NgFor,
  ],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {
  configuration: SiteConfiguration | null = null;

  private apiEndpoint = `${environment.apiUrl}/configuration/latest`;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    try {
      this.fetchConfiguration();
    } catch (error) {
      console.error('Error loading app configuration:', error);
    }
  }

  fetchConfiguration(): void {
    this.http.get<SiteConfiguration>(this.apiEndpoint).subscribe({
      next: (data: SiteConfiguration) => {
        this.configuration = data;
      },
      error: (error) => {
        console.error('Error fetching configuration:', error);
      },
    });
  }
}
