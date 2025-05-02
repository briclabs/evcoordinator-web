import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { TableComponent } from "../../subcomponents/table/table.component";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Participant } from "../../../models/participant";
import { Router } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { SearchRequest } from "../../../models/search-request";

@Component({
  selector: 'profile-management',
  standalone: true,
  imports: [
    FormsModule,
    TableComponent,
  ],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.css']
})
export class ProfileManagementComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/participant/search`;
  private authenticationService = inject(OidcSecurityService);

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
    this.fetchParticipants('', this.currentPage, this.sortColumn, this.sortAsc);
  }

  fetchParticipants(searchString: string, page: number, sortColumn: string, sortAsc: boolean): void {
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
          participant_type: searchString,
          sponsor: searchString,
          name_first: searchString,
          name_last: searchString,
          name_nick: searchString,
          dob: searchString,
          addr_street_1: searchString,
          addr_street_2: searchString,
          addr_city: searchString,
          addr_state_abbr: searchString,
          addr_zip: searchString,
          addr_email: searchString,
          phone_digits: searchString,
        }
        : {}
    };
    this.http.post<{ list: Participant[], count: number }>(`${this.apiUrl}`, searchRequest).subscribe({
      next: (data) => {
        console.log('Participants:', data);
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
        console.error('Error fetching participants:', error);
      },
    });
  }

  onRowClick(row: { [key: string]: any }): void {
    this.authenticationService.getUserData().subscribe((userData: any) => {
      if (userData && userData.email && row['addrEmail'] === userData.email) {
        this.router.navigate([`/tools/my-profile/`]);
      } else {
        this.router.navigate([`/tools/edit-profile/${row['id']}`]);
      }
    });
  }

  onAddRecord(): void {
    this.router.navigate([`/tools/edit-profile`]);
  }

  onSearch(searchString: string): void {
    this.searchString = searchString;
    this.currentPage = 1;
    this.fetchParticipants(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchParticipants(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onColumnSort(event: { column: string, sortAsc: boolean }): void {
    this.sortColumn = event.column;
    this.sortAsc = event.sortAsc;
    this.fetchParticipants(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }
}
