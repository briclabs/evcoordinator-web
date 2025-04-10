import { Component, OnInit } from '@angular/core';
import { EventInfo } from "../../../../models/event-info";
import { Participant } from "../../../../models/participant";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { SearchRequest } from "../../../../models/search-request";
import { createDefaultTransactionWithLabels, TransactionWithLabels } from "../../../../models/transaction-with-labels";
import { Transaction } from "../../../../models/transaction";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
  ],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css'
})
export class EditTransactionComponent implements OnInit {
  protected transaction: TransactionWithLabels;

  protected eventInfoList: EventInfo[];
  protected actorList: Participant[];
  protected recipientList: Participant[];

  private apiUrl = '';
  private participantSearchUrl = '';
  private eventInfoSearchUrl = '';

  transactionTypeOptions: string[] = ["INVOICE", "EXPENSE", "INCOME"]; // TODO - source from DB.
  instrumentTypeOptions: string[] = ["ELECTRONIC", "CHECK", "CASH"]; // TODO - source from DB.

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl + '/transactions';
    this.participantSearchUrl = environment.apiUrl + '/participant/search';
    this.eventInfoSearchUrl = environment.apiUrl + '/event/info/search';

    this.eventInfoList = [];
    this.actorList = [];
    this.recipientList = [];
    this.transaction = createDefaultTransactionWithLabels();
  }

  async ngOnInit() {
    this.fetchEventInfoList();
    this.fetchActorList();
    this.fetchRecipientList();
    this.route.paramMap.subscribe(params => {
      const id: string | null = params.get('id');
      if (id) {
        this.fetchRegistrationById(parseInt(id, 10));
      }
    });
  }

  fetchRegistrationById(id: number): void {
    this.http.get<TransactionWithLabels>(`${this.apiUrl}/${id}`).subscribe({
      next: (data: TransactionWithLabels) => {
        if (data) {
          this.transaction = data;
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  fetchEventInfoList(): void {
    let searchRequest: SearchRequest = {
      searchConfiguration: {
        exactMatch: true,
        sortColumn: 'date_start',
        sortAsc: false,
        offset: 0,
        max: 10
      },
      searchCriteria: {
        eventStatus: 'CURRENT',
      }
    };
    this.http.post<{list: EventInfo[]; count: number}>(`${this.eventInfoSearchUrl}`, searchRequest).subscribe({
      next: (data) => {
        if (data && data.list) {
          this.eventInfoList = data.list;
          console.log(this.eventInfoList);
        }
      },
      error: (error) => {
        console.error('Error loading event info list:', error);
      }
    });
  }

  fetchActorList(): void {
    let searchRequest: SearchRequest = {
      searchConfiguration: {
        exactMatch: true,
        sortColumn: 'name_last',
        sortAsc: false,
        offset: 0,
        max: 10
      },
      searchCriteria: {}
    };
    this.http.post<{ list: Participant[]; count: number }>(`${this.participantSearchUrl}`, searchRequest).subscribe({
      next: (data) => {
        if (data && data.list) {
          this.actorList = data.list;
        }
      },
      error: (error) => {
        console.error('Error loading actor list:', error);
      }
    });
  }

  fetchRecipientList(): void {
    let searchRequest: SearchRequest = {
      searchConfiguration: {
        exactMatch: true,
        sortColumn: 'name_last',
        sortAsc: false,
        offset: 0,
        max: 10
      },
      searchCriteria: {}
    };
    this.http.post<{ list: Participant[]; count: number }>(`${this.participantSearchUrl}`, searchRequest).subscribe({
      next: (data) => {
        if (data && data.list) {
          this.recipientList = data.list;
        }
      },
      error: (error) => {
        console.error('Error loading recipient list:', error);
      }
    });
  }

  create() {
    const transactionToCreate: Transaction = {
      eventInfoId: this.transaction.eventInfoId,
      actorId: this.transaction.eventInfoId,
      recipientId: this.transaction.recipientId,
      amount: this.transaction.amount,
      memo: this.transaction.memo,
      transactionType: this.transaction.transactionType,
      instrumentType: this.transaction.instrumentType,
    }
    this.http.post(this.apiUrl, transactionToCreate).subscribe({
      next: (response) => {
        console.log('Transaction created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating transaction:', error);
      },
    })
  }

  update() {
    const transactionToUpdate: Transaction = {
      id: this.transaction.id,
      eventInfoId: this.transaction.eventInfoId,
      actorId: this.transaction.eventInfoId,
      recipientId: this.transaction.recipientId,
      amount: this.transaction.amount,
      memo: this.transaction.memo,
      transactionType: this.transaction.transactionType,
      instrumentType: this.transaction.instrumentType,
      timeRecorded: this.transaction.timeRecorded,
    }
    this.http.put(this.apiUrl, transactionToUpdate).subscribe({
      next: (response) => {
        console.log('Transaction saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving transaction:', error);
      },
    })
  }

  delete(): void {
    this.http.delete(`${this.apiUrl}/${this.transaction.id}`).subscribe({
      next: () => {
        this.transaction = createDefaultTransactionWithLabels();
      },
      error: (error) => {
        console.error('Error deleting transaction:', error);
      }
    });
  }
}
