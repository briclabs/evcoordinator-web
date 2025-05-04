import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { createDefaultEventInfo, EventInfo } from "../../../../models/event-info";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { CreateResponse } from "../../../../models/create-response";
import { UpdateResponse } from "../../../../models/update-response";
import { DeleteResponse } from "../../../../models/delete-response";
import { ErrorMessageComponent } from "../../../subcomponents/error-message/error-message.component";
import { ValidatorService } from "../../../../services/validator/validator.service";
import { StaticLookupService } from "../../../../services/static-lookup/static-lookup.service";
import { EventStatisticsComponent } from "../../../public/event-statistics/event-statistics.component";

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ErrorMessageComponent,
    EventStatisticsComponent,
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  protected messages: Map<string, string> = new Map<string, string>();

  eventInfo: EventInfo;

  eventStatusOptions: string[] = [];

  private apiUrl = `${environment.apiUrl}/event/info`;

  validatorService: ValidatorService = inject(ValidatorService);

  private staticLookupService: StaticLookupService = inject(StaticLookupService);

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.eventInfo = createDefaultEventInfo();

    this.staticLookupService.eventStatus().subscribe({
      next: (data: string[]) => {
        this.eventStatusOptions = data;
      },
      error: (error: any) => {
        console.error('Error fetching event statuses:', error);
      }
    });
  }

  async ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchEventInfoById(parseInt(id, 10));
      }
    });
  }

  validate(event: Event): void {
    if (event instanceof Event) {
      const clonedMessages = new Map(this.messages);
      const inputValue = (event.target as HTMLInputElement).value?? '';
      const inputId = (event.target as HTMLInputElement).id;

      switch (inputId) {
        case 'eventName':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'event_name');
          break;
        case 'eventTitle':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'event_title');
          break;
        case 'dateStart':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'date_start');
          this.validatorService.mustBeBeforeEnd(inputValue, this.eventInfo.dateEnd, clonedMessages, 'date_start');
          break;
        case 'dateEnd':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'date_end');
          this.validatorService.mustBeBeforeEnd(this.eventInfo.dateStart, inputValue, clonedMessages, 'date_start');
          if (this.eventInfo.eventStatus.includes('CURRENT')) {
            this.validatorService.mustBeNowOrFuture(inputValue, clonedMessages, 'date_end');
          }
          if (this.eventInfo.eventStatus.includes('PAST')) {
            this.validatorService.mustBePast(inputValue, clonedMessages, 'date_end');
          }
          break;
        case 'eventStatus':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'event_status');
          if (inputValue.includes('CURRENT')) {
            this.validatorService.mustBeNowOrFuture(this.eventInfo.dateEnd, clonedMessages, 'date_end');
          }
          if (inputValue.includes('PAST')) {
            this.validatorService.mustBePast(this.eventInfo.dateEnd, clonedMessages, 'date_end');
          }
          if (inputValue.includes('CANCELLED')) {
            clonedMessages.delete('date_end');
          }
          break;
      }
      this.messages = clonedMessages;
    }
  }

  fetchEventInfoById(id: number): void {
    this.http.get<EventInfo>(`${this.apiUrl}/${id}`).subscribe({
      next: (data: EventInfo) => {
        this.eventInfo = data;
      },
      error: (error) => {
        console.error('Error loading event info:', error);
      }
    });
  }

  create() {
    this.http.post<CreateResponse>(this.apiUrl, this.eventInfo).subscribe({
      next: (response: CreateResponse) => {
        this.router.navigate([`/tools/event-info/${response.insertedId}`]);
      },
      error: (error) => {
        this.messages = CreateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  update() {
    this.http.put(this.apiUrl, this.eventInfo).subscribe({
      next: () => {
      },
      error: (error) => {
        this.messages = UpdateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  delete(): void {
    this.http.delete<DeleteResponse>(`${this.apiUrl}/${this.eventInfo.id}`).subscribe({
      next: () => {
        this.router.navigate([`/tools/events`]);
      },
      error: (error) => {
        this.messages = DeleteResponse.getMessagesFromObject(error.error);
      }
    });
  }
}
