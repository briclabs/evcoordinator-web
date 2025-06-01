import { Component, OnInit } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SearchRequest } from "../../../models/search-request";
import { TableComponent } from "../../subcomponents/table/table.component";
import { RegistrationWithLabels } from "../../../models/registration-with-labels";

@Component({
  selector: 'app-registration-management',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './registration-management.component.html',
  styleUrl: './registration-management.component.css'
})
export class RegistrationManagementComponent implements OnInit {
  private registrationSearchApiUrl = `${environment.apiUrl}/registration/search`;

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
    this.fetchRegistrations('', this.currentPage, this.sortColumn, this.sortAsc);
  }

  fetchRegistrations(searchString: string, page: number, sortColumn: string, sortAsc: boolean): void {
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
          event_info_id: searchString,
          donation_pledge: searchString,
          signature: searchString,
          participant_name_first: searchString,
          participant_name_last: searchString,
          event_name: searchString,
          event_title: searchString
        }
        : {}
    };
    this.http.post<{ list: RegistrationWithLabels[], count: number }>(`${this.registrationSearchApiUrl}`, searchRequest).subscribe({
      next: (data) => {
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
        console.error('Error fetching registrations:', error);
      },
    });
  }

  onRowClick(row: { [key: string]: any }): void {
    this.router.navigate([`/tools/edit-registration/${row['id']}`]);
  }

  onAddRecord(): void {
    this.router.navigate([`/tools/edit-registration`]);
  }

  onSearch(searchString: string): void {
    this.searchString = searchString;
    this.currentPage = 1;
    this.fetchRegistrations(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchRegistrations(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onColumnSort(event: { column: string, sortAsc: boolean }): void {
    this.sortColumn = event.column;
    this.sortAsc = event.sortAsc;
    this.fetchRegistrations(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }
}
