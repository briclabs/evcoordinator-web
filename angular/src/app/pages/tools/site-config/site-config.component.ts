import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import { FormsModule } from "@angular/forms";
import { CreateResponse } from "../../../models/create-response";
import { UpdateResponse } from "../../../models/update-response";
import { Router } from "@angular/router";
import { createDefaultSiteConfiguration, SiteConfiguration } from "../../../models/site-configuration";
import { ErrorMessageComponent } from "../../subcomponents/error-message/error-message.component";

@Component({
  selector: 'site-config',
  standalone: true,
  imports: [
    FormsModule,
    ErrorMessageComponent,
  ],
  templateUrl: './site-config.component.html',
  styleUrls: ['./site-config.component.css'],
})
export class SiteConfigComponent implements OnInit {
  protected messages: Map<string, string> = new Map<string, string>();

  siteConfiguration: SiteConfiguration;
  stringifiedFundProcessorInstructions: string;
  stringifiedEventGuidelines: string;

  isNewConfiguration: boolean = false;

  private apiUrl = '';

  constructor(private http: HttpClient, private router: Router) {
    this.siteConfiguration = createDefaultSiteConfiguration();
    this.stringifiedFundProcessorInstructions = JSON.stringify(this.siteConfiguration.fundProcessorInstructions, null, 4);
    this.stringifiedEventGuidelines = JSON.stringify(this.siteConfiguration.eventGuidelines, null, 4);
  }

  async ngOnInit() {
    try {
      this.apiUrl = environment.apiUrl + '/configuration';

      this.fetchLatestConfiguration();
      this.adjustTextAreaSizes();

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
          this.stringifiedFundProcessorInstructions = JSON.stringify(data.fundProcessorInstructions, null, 4);
          this.stringifiedEventGuidelines = JSON.stringify(data.eventGuidelines, null, 4);
        }
      },
      error: (error) => {
        console.error('Error fetching latest configuration:', error);
        this.isNewConfiguration = error.status === 404;
      },
    });
  }

  create() {
    this.http.post<CreateResponse>(this.apiUrl, this.siteConfiguration).subscribe({
      next: () => {
        this.clearModal()
        this.router.navigate([`/`]);
      },
      error: (error) => {
        console.log('Error creating configuration:', error);
        this.messages = CreateResponse.getMessagesFromObject(error.error);
        this.clearModal();
      },
    })
  }

  update() {
    this.http.put<UpdateResponse>(this.apiUrl, this.siteConfiguration).subscribe({
      next: () => {
        this.clearModal()
        this.router.navigate([`/`]);
      },
      error: (error) => {
        console.log('Error saving configuration:', error);
        this.messages = UpdateResponse.getMessagesFromObject(error.error);
        this.clearModal();
      },
    })
  }

  updateFundProcessorInstructions(event: Event): void {
    const textarea = this.resizeTextArea(event);

    try {
      this.siteConfiguration.fundProcessorInstructions = JSON.parse(textarea.value);
      this.stringifiedFundProcessorInstructions = JSON.stringify(this.siteConfiguration.fundProcessorInstructions, null, 4);
      const clonedMessages = new Map(this.messages);
      clonedMessages.delete('fund_processor_instructions');
      this.messages = clonedMessages;
    } catch (error) {
      const clonedMessages = new Map(this.messages);
      clonedMessages.set('fund_processor_instructions', 'Invalid JSON.');
      this.messages = clonedMessages;
    }
  }

  updateEventGuidelines(event: Event): void {
    const textarea = this.resizeTextArea(event);

    try {
      this.siteConfiguration.eventGuidelines = JSON.parse(textarea.value);
      this.stringifiedEventGuidelines = JSON.stringify(this.siteConfiguration.eventGuidelines, null, 4);
      const clonedMessages = new Map(this.messages);
      clonedMessages.delete('event_guidelines');
      this.messages = clonedMessages;
    } catch (error) {
      const clonedMessages = new Map(this.messages);
      clonedMessages.set('event_guidelines', 'Invalid JSON.');
      this.messages = clonedMessages;
    }
  }

  private clearModal(): void {
    document.getElementById('cancelButton')?.click();
  }

  private resizeTextArea(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    textarea.style.height = 'auto';

    textarea.style.height = `${textarea.scrollHeight}px`;
    return textarea;
  }

  private adjustTextAreaSizes(): void {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }

}
