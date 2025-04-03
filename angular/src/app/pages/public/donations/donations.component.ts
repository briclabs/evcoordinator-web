import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationResponse } from "../../../models/configuration-response";
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
  configuration: ConfigurationResponse | null = null;

  private apiEndpoint = '';

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    try {
      this.apiEndpoint = environment.apiUrl + '/configuration/latest';

      this.fetchConfiguration();
    } catch (error) {
      console.error('Error loading app configuration:', error);
    }
  }

  fetchConfiguration(): void {

    this.http.get<ConfigurationResponse>(this.apiEndpoint).subscribe({
      next: (data: ConfigurationResponse) => {
        this.configuration = data;
      },
      error: (error) => {
        console.error('Error fetching configuration:', error);
      },
    });
  }
}
