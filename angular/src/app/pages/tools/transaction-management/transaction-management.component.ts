import { Component, OnInit } from '@angular/core';
import { TableComponent } from "../../subcomponents/table/table.component";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SearchRequest } from "../../../models/search-request";
import { TransactionWithLabels } from "../../../models/transaction-with-labels";

@Component({
  selector: 'transactions',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './transaction-management.component.html',
  styleUrls: ['./transaction-management.component.css'],
})
export class TransactionManagementComponent implements OnInit {
  apiUrl = `${environment.apiUrl}/transactions`;

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
    this.fetchTransactions('', this.currentPage, this.sortColumn, this.sortAsc);
  }

  fetchTransactions(searchString: string, page: number, sortColumn: string, sortAsc: boolean): void {
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
          event_name: searchString,
          event_title: searchString,
          actor_id: searchString,
          actor_name_first: searchString,
          actor_name_last: searchString,
          recipient_id: searchString,
          recipient_name_first: searchString,
          recipient_name_last: searchString,
          amount: searchString,
          memo: searchString,
          transaction_type: searchString,
          instrument_type: searchString,
        }
        : {}
    };
    this.http.post<{ list: TransactionWithLabels[], count: number }>(`${this.apiUrl}/search`, searchRequest).subscribe({
      next: (data) => {
        console.log('Transactions:', data);
        if (data && data.list && data.count > 0) {
          const formattedList = data.list.map(transaction => {
            return {
              ...transaction,
              amount: '$' + transaction.amount.toFixed(2)
            };
          });
          this.columns = Object.keys(formattedList[0]);
          this.rows = [...formattedList]
          const totalPages = Math.ceil(data.count / this.resultsPerPage);
          this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
          this.rows = [];
          this.pages = [];
        }
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },
    });
  }

  onRowClick(row: { [key: string]: any }): void {
    this.router.navigate([`/tools/edit-transaction/${row['id']}`]);
  }

  onAddRecord(): void {
    this.router.navigate([`/tools/edit-transaction`]);
  }

  onSearch(searchString: string): void {
    this.searchString = searchString;
    this.currentPage = 1;
    this.fetchTransactions(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchTransactions(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }

  onColumnSort(event: { column: string, sortAsc: boolean }): void {
    this.sortColumn = event.column;
    this.sortAsc = event.sortAsc;
    this.fetchTransactions(this.searchString, this.currentPage, this.sortColumn, this.sortAsc);
  }
}
