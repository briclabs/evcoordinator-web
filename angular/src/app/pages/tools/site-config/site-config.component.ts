import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import { FormsModule } from "@angular/forms";
import { CreateResponse } from "../../../models/create-response";
import { UpdateResponse } from "../../../models/update-response";
import { Router } from "@angular/router";
import { createDefaultSiteConfiguration, SiteConfiguration } from "../../../models/site-configuration";

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
  protected messages: Map<string, string> = new Map<string, string>();

  siteConfiguration: SiteConfiguration;

  isNewConfiguration: boolean = false;

  private apiUrl = '';

  constructor(private http: HttpClient, private router: Router) {
    this.siteConfiguration = createDefaultSiteConfiguration();
  }

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
      next: (data: SiteConfiguration) => {
        if (data == null || Object.keys(data).length === 0) {
          this.isNewConfiguration = true;
        } else {
          this.isNewConfiguration = false;
          this.siteConfiguration = data;
        }
      },
      error: (error) => {
        console.error('Error fetching latest configuration:', error);
      },
    });
  }

  create() {
    this.http.post<CreateResponse>(this.apiUrl, this.siteConfiguration).subscribe({
      next: () => {
        this.router.navigate([`/`]);
      },
      error: (error) => {
        console.log('Error creating configuration:', error);
        this.messages = CreateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  update() {
    this.http.put<UpdateResponse>(this.apiUrl, this.siteConfiguration).subscribe({
      next: () => {
        this.router.navigate([`/`]);
      },
      error: (error) => {
        console.log('Error saving configuration:', error);
        this.messages = UpdateResponse.getMessagesFromObject(error.error);
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
