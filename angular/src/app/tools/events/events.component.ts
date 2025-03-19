import { Component, OnInit } from '@angular/core';
import { TableComponent } from "../subcomponents/table/table.component";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SearchRequest } from "../../models/search-request";
import { environment } from "../../../environments/environment";
import { EventInfo } from "../../models/event-info-response";

@Component({
  selector: 'events',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  apiUrl = `${environment.apiUrl}/event/info/search`;

  private resultsPerPage = 10;

  columns: string[] = [];
  rows: { [key: string]: any }[] = [];
  pages: number[] = [];
  currentPage = 1;
  searchString: string = '';

  private sortColumn: string = 'id';
  private sortAsc: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents('', this.currentPage, this.sortColumn, this.sortAsc);
  }

  fetchEvents(searchString: string, page: number, sortColumn: string, sortAsc: boolean): void {
    let searchRequest: SearchRequest = {
      searchConfiguration: {
        exactMatch: searchString.length === 0,
        sortColumn: sortColumn,
        sortAsc: sortAsc,
        offset: (page - 1) * this.resultsPerPage,
        max: this.resultsPerPage
      },
      searchCriteria: searchString.length > 0
        ? {
          eventName: searchString,
          eventTitle: searchString,
          dateStart: searchString,
          dateEnd: searchString,
          eventStatus: searchString,
        }
        : {}
    };
    this.http.post<{ list: EventInfo[], count: number }>(`${this.apiUrl}`, searchRequest).subscribe({
      next: (data) => {
        console.log('Event Info:', data);
        if (data && data.list && data.count > 0) {
          this.columns = Object.keys(data.list[0]);
          this.rows = [...data.list]
          const totalPages = Math.ceil(data.count / this.resultsPerPage);
          this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
          this.rows = [];
          this.pages = [];
        }
      },
      error: (error) => {
        console.error('Error fetching event info:', error);
      },
    });
  }

  onRowClick(row: { [key: string]: any }): void {
    this.router.navigate([`/tools/event-info/${row['id']}`]);
  }

  onAddRecord(): void {
    this.router.navigate([`/tools/event-info`]);
  }

  onSearch(searchString: string): void {
    this.searchString = searchString;
    this.currentPage = 1;
    this.fetchEvents(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchEvents(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onColumnSort(event: { column: string, sortAsc: boolean }): void {
    this.sortColumn = event.column;
    this.sortAsc = event.sortAsc;
    this.fetchEvents(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }
}
