import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'site-config',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './site-config.component.html',
  styleUrls: ['./site-config.component.css'],
})
export class SiteConfigComponent implements OnInit {
  charityName: string = '';
  charityUrl: string = '';
  eventGuidelines: string = '';
  fundProcessorInstructions: string = '';
  fundProcessorName: string = '';
  fundProcessorUrl: string = '';
  recommendedDonationAmount: number = 0;

  isNewConfiguration: boolean = false;

  private apiUrl = '';

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    try {
      this.apiUrl = environment.apiUrl + '/configuration';

      this.fetchLatestConfiguration();

      setTimeout(() => {
        this.adjustTextAreaSizes();
      }, 0);
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  }

  fetchLatestConfiguration(): void {
    this.http.get<any>(this.apiUrl + "/latest").subscribe({
      next: (data) => {
        if (data == null || Object.keys(data).length === 0) {
          // Empty JSON, so flag as a new configuration
          this.isNewConfiguration = true;
        } else {
          // Complete JSON, populate the fields and flag as an update
          this.isNewConfiguration = false;

          this.charityName = data.charityName;
          this.charityUrl = data.charityUrl;
          this.eventGuidelines = JSON.stringify(data.eventGuidelines, null, 2);
          this.fundProcessorInstructions = JSON.stringify(data.fundProcessorInstructions, null, 2);
          this.fundProcessorName = data.fundProcessorName;
          this.fundProcessorUrl = data.fundProcessorUrl;
          this.recommendedDonationAmount = data.recommendedDonation;
        }
      },
      error: (error) => {
        console.error('Error fetching latest configuration:', error);
      },
    });
  }

  create() {
    this.http.post(this.apiUrl, {
      charityName: this.charityName,
      charityUrl: this.charityUrl,
      eventGuidelines: this.eventGuidelines,
      fundProcessorInstructions: this.fundProcessorInstructions,
      fundProcessorName: this.fundProcessorName,
      fundProcessorUrl: this.fundProcessorUrl,
      recommendedDonation: this.recommendedDonationAmount,
    }).subscribe({
      next: (response) => {
        console.log('Configuration created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating configuration:', error);
      },
    })
  }

  update() {
    this.http.put(this.apiUrl, {
      charityName: this.charityName,
      charityUrl: this.charityUrl,
      eventGuidelines: this.eventGuidelines,
      fundProcessorInstructions: this.fundProcessorInstructions,
      fundProcessorName: this.fundProcessorName,
      fundProcessorUrl: this.fundProcessorUrl,
      recommendedDonation: this.recommendedDonationAmount,
    }).subscribe({
      next: (response) => {
        console.log('Configuration saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving configuration:', error);
      },
    })
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    textarea.style.height = 'auto';

    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  adjustTextAreaSizes(): void {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }

}
