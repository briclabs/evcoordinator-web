import { Component } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { createDefaultEventStatistics, EventStatistics } from "../../../models/event-statistics";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-event-statistics',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './event-statistics.component.html',
  styleUrl: './event-statistics.component.css'
})
export class EventStatisticsComponent {
  apiUrl = `${environment.apiUrl}/statistics`;

  statistics: EventStatistics = createDefaultEventStatistics();

  constructor(private http: HttpClient) {
    this.http.get<EventStatistics>(`${this.apiUrl}/latest`).subscribe({
      next: (data) => {
        console.log('Latest Event Statistics:', data);
        this.statistics = data;
      },
      error: (error) => {
        console.error('Error fetching statistics:', error);
      },
    });
  }
}
