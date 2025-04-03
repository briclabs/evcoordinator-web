import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { createDefaultEventInfo, EventInfo } from "../../../../models/event-info";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  eventInfo: EventInfo;

  eventStatusOptions: string[] = ["CURRENT", "PAST", "CANCELLED"]; // TODO - source from DB.

  private apiUrl = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
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
    this.http.post(this.apiUrl, this.eventInfo).subscribe({
      next: (response) => {
        console.log('Event info created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating event info:', error);
      },
    })
  }

  update() {
    this.http.put(this.apiUrl, this.eventInfo).subscribe({
      next: (response) => {
        console.log('Event info saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving event info:', error);
      },
    })
  }

  delete(): void {
    this.http.delete(`${this.apiUrl}/${this.eventInfo.id}`).subscribe({
      next: () => {
        this.eventInfo = createDefaultEventInfo();
      },
      error: (error) => {
        console.error('Error deleting event info:', error);
      }
    });
  }
}
