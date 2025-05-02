import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import { FormsModule } from "@angular/forms";
import { CreateResponse } from "../../../models/create-response";
import { UpdateResponse } from "../../../models/update-response";
import { Router } from "@angular/router";
import {
  createDefaultSiteConfiguration,
  FundProcessorInstructions,
  SiteConfiguration,
  isValidFundProcessorInstructionsObject,
  isValidEventGuidelinesObject,
} from "../../../models/site-configuration";
import { ErrorMessageComponent } from "../../subcomponents/error-message/error-message.component";
import { ValidatorService } from "../../../services/validator/validator.service";

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

  private apiUrl = `${environment.apiUrl}/configuration`;

  validatorService: ValidatorService = inject(ValidatorService);

  constructor(private http: HttpClient, private router: Router) {
    this.siteConfiguration = createDefaultSiteConfiguration();
    this.stringifiedFundProcessorInstructions = JSON.stringify(this.siteConfiguration.fundProcessorInstructions, null, 4);
    this.stringifiedEventGuidelines = JSON.stringify(this.siteConfiguration.eventGuidelines, null, 4);
  }

  async ngOnInit() {
    try {
      this.fetchLatestConfiguration();
      this.adjustTextAreaSizes();

      setTimeout(() => {
        this.adjustTextAreaSizes();
      }, 0);
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  }

  validate(event: Event): void {
    if (event instanceof Event) {
      const clonedMessages = new Map(this.messages);
      const inputValue = (event.target as HTMLInputElement).value?? '';
      const inputId = (event.target as HTMLInputElement).id;

      switch (inputId) {
        case 'donationMinimum':
          this.validatorService.mustBePositiveNumber(inputValue, clonedMessages, 'recommended_donation');
          break;
        case 'charityName':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'charity_name');
          break;
        case 'charityUrl':
          this.validatorService.mustBeValidUrl(inputValue, clonedMessages, 'charity_url');
          break;
        case 'fundProcessorName':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'fund_processor_name');
          break;
        case 'fundProcessorUrl':
          this.validatorService.mustBeValidUrl(inputValue, clonedMessages, 'fund_processor_url');
          break;
        case 'fundProcessorInstructions':
          if (isValidFundProcessorInstructionsObject(JSON.parse(this.stringifiedFundProcessorInstructions) as FundProcessorInstructions)) {
            clonedMessages.delete('fund_processor_instructions');
          } else {
            clonedMessages.set('fund_processor_instructions', 'Must be a valid Fund Processor Instructions JSON object.');
          }
          break;
        case 'eventGuidelines':
          if (isValidEventGuidelinesObject(JSON.parse(this.stringifiedEventGuidelines) as { [key: string]: string[] })) {
            clonedMessages.delete('event_guidelines');
          } else {
            clonedMessages.set('event_guidelines', 'Must be a valid Event Guidelines JSON object.');
          }
          break;
      }
      this.messages = clonedMessages;
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
      this.validate(event);
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
      this.validate(event);
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
