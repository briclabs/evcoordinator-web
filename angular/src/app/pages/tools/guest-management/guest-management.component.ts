import { Component, OnInit } from '@angular/core';
import { TableComponent } from "../subcomponents/table/table.component";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SearchRequest } from "../../../models/search-request";
import { RegistrationWithLabels } from "../../../models/registration-with-labels";

@Component({
  selector: 'app-guest-management',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './guest-management.component.html',
  styleUrl: './guest-management.component.css'
})
export class GuestManagementComponent implements OnInit {
  guestSearchApiUrl = `${environment.apiUrl}/guest/search`;

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
    this.fetchGuests('', this.currentPage, this.sortColumn, this.sortAsc);
  }

  fetchGuests(searchString: string, page: number, sortColumn: string, sortAsc: boolean): void {
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
          registration_id: searchString,
          event_info_id: searchString,
          event_name: searchString,
          event_title: searchString,
          event_status: searchString,
          raw_guest_name: searchString,
          guest_profile_id: searchString,
          guest_name_first: searchString,
          guest_name_last: searchString,
          invitee_profile_id: searchString,
          invitee_first_name: searchString,
          invitee_last_name: searchString,
          relationship: searchString
        }
        : {}
    };
    this.http.post<{ list: RegistrationWithLabels[], count: number }>(`${this.guestSearchApiUrl}`, searchRequest).subscribe({
      next: (data) => {
        console.log('Guests:', data);
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
        console.error('Error fetching guests:', error);
      },
    });
  }

  onRowClick(row: { [key: string]: any }): void {
    this.router.navigate([`/tools/edit-guest/${row['id']}`]);
  }

  onAddRecord(): void {
    this.router.navigate([`/tools/edit-guest`]);
  }

  onSearch(searchString: string): void {
    this.searchString = searchString;
    this.currentPage = 1;
    this.fetchGuests(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchGuests(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onColumnSort(event: { column: string, sortAsc: boolean }): void {
    this.sortColumn = event.column;
    this.sortAsc = event.sortAsc;
    this.fetchGuests(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }
}
