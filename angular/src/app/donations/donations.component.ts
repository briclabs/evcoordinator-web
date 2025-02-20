import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationResponse } from "../models/configuration-response";

@Component({
  selector: 'donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {
  configuration: ConfigurationResponse | null = null;

  private apiEndpoint = 'http://localhost:8080/v1/configuration/latest';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchConfiguration();
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
