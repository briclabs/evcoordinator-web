import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { EventInfo } from "../../../models/event-info-response";
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
  ],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.css'
})
export class EventInfoComponent implements OnInit {
  id: number | null = null;
  eventName: string | null = null;
  eventTitle: string | null = null;
  dateStart: string | null = null;
  dateEnd: string | null = null;
  eventStatus: string | null = null;
  timeRecorded: string | null = null;

  eventStatusOptions: string[] = ["CURRENT", "PAST", "CANCELLED"]; // TODO - source from DB.

  private apiUrl = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.apiUrl = environment.apiUrl + '/event/info';

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchEventInfoById(parseInt(id, 10));
      } else {
        this.id = null;
        this.eventName = null;
        this.eventTitle = null;
        this.dateStart = null;
        this.dateEnd = null;
        this.eventStatus = null;
        this.timeRecorded = null;
      }
    });
  }

  fetchEventInfoById(id: number): void {
    this.http.get<EventInfo>(`${this.apiUrl}/${id}`).subscribe({
      next: (data: EventInfo) => {
        if (data) {
          this.id = data.id;
          this.eventName = data.eventName;
          this.eventTitle = data.eventTitle;
          this.dateStart = data.dateStart;
          this.dateEnd = data.dateEnd;
          this.eventStatus = data.eventStatus;
          this.timeRecorded = data.timeRecorded;
        }
      },
      error: (error) => {
        console.error('Error loading event info:', error);
      }
    });
  }

  create() {
    this.http.post(this.apiUrl, {
      eventName: this.eventName,
      eventTitle: this.eventTitle,
      dateStart: this.dateStart,
      dateEnd: this.dateEnd,
      eventStatus: this.eventStatus,
    }).subscribe({
      next: (response) => {
        console.log('Event info created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating event info:', error);
      },
    })
  }

  update() {
    this.http.put(this.apiUrl, {
      id: this.id,
      eventName: this.eventName,
      eventTitle: this.eventTitle,
      dateStart: this.dateStart,
      dateEnd: this.dateEnd,
      eventStatus: this.eventStatus,
    }).subscribe({
      next: (response) => {
        console.log('Event info saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving event info:', error);
      },
    })
  }
}
