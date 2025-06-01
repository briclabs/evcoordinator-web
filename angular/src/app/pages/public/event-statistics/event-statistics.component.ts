import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class EventStatisticsComponent implements OnChanges {
  private apiUrl = `${environment.apiUrl}/statistics`;

  @Input() statisticsTarget: string = 'latest';

  statistics: EventStatistics = createDefaultEventStatistics();

  constructor(private http: HttpClient) {
    this.getEventStatistics();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statisticsTarget']) {
      this.getEventStatistics();
    }
  }

  private getEventStatistics() {
    this.http.get<EventStatistics>(`${this.apiUrl}/${(this.statisticsTarget)}`).subscribe({
      next: (data) => {
        this.statistics = data;
      },
      error: (error) => {
        console.error('Error fetching statistics:', error);
      },
    });
  }
}
