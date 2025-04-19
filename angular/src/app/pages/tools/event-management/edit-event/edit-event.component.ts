import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ErrorMessageComponent,
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  protected messages: Map<string, string> = new Map<string, string>();

  eventInfo: EventInfo;

  eventStatusOptions: string[] = ["CURRENT", "PAST", "CANCELLED"]; // TODO - source from DB.

  private apiUrl = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.eventInfo = createDefaultEventInfo();
  }

  async ngOnInit() {
    this.apiUrl = environment.apiUrl + '/event/info';

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchEventInfoById(parseInt(id, 10));
      }
    });
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
