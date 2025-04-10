import { Component, OnInit } from '@angular/core';
import { TableComponent } from "../subcomponents/table/table.component";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { SearchRequest } from "../../../models/search-request";
import { HistoryWithLabels } from "../../../models/history-with-labels";

@Component({
  selector: 'history',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  apiUrl = `${environment.apiUrl}/history`;

  private resultsPerPage = 10;

  columns: string[] = [];
  rows: { [key: string]: any }[] = [];
  pages: number[] = [];
  currentPage = 1;
  searchString: string = '';

  private sortColumn: string = 'id';
  private sortAsc: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchHistoryRecords('', this.currentPage, this.sortColumn, this.sortAsc);
  }

  fetchHistoryRecords(searchString: string, page: number, sortColumn: string, sortAsc: boolean): void {
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
          actor_id: searchString,
          actor_name_first: searchString,
          actor_name_last: searchString,
          action_name: searchString,
          table_source: searchString,
          new_data: searchString,
          old_data: searchString,
        }
        : {}
    };
    this.http.post<{ list: HistoryWithLabels[], count: number }>(`${this.apiUrl}/search`, searchRequest).subscribe({
      next: (data) => {
        console.log('History Records:', data);
        if (data && data.list && data.count > 0) {
          this.columns = [ // manually determine the order of columns
            'timeRecorded',
            'actorNameLast',
            'actorNameFirst',
            'actionName',
            'tableSource',
            'oldData',
            'newData'
          ];
          this.rows = [...data.list]
          const totalPages = Math.ceil(data.count / this.resultsPerPage);
          this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
          this.rows = [];
          this.pages = [];
        }
      },
      error: (error) => {
        console.error('Error fetching history records:', error);
      },
    });
  }

  onSearch(searchString: string): void {
    this.searchString = searchString;
    this.currentPage = 1;
    this.fetchHistoryRecords(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchHistoryRecords(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onColumnSort(event: { column: string, sortAsc: boolean }): void {
    this.sortColumn = event.column;
    this.sortAsc = event.sortAsc;
    this.fetchHistoryRecords(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }
}
