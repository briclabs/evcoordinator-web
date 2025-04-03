import { Component, OnInit } from '@angular/core';
import { EventInfo } from "../../../../models/event-info";
import { Participant } from "../../../../models/participant";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { SearchRequest } from "../../../../models/search-request";
import { createDefaultPaymentWithLabels, PaymentWithLabels } from "../../../../models/payment-with-labels";
import { Payment } from "../../../../models/payment";
import { CurrencyPipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-edit-payment',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    CurrencyPipe,
  ],
  templateUrl: './edit-payment.component.html',
  styleUrl: './edit-payment.component.css'
})
export class EditPaymentComponent  implements OnInit {
  protected payment: PaymentWithLabels;

  protected eventInfoList: EventInfo[];
  protected actorList: Participant[];
  protected recipientList: Participant[];

  private apiUrl = '';
  private participantSearchUrl = '';
  private eventInfoSearchUrl = '';

  paymentActionTypeOptions: string[] = ["SENT", "REFUNDED"]; // TODO - source from DB.
  paymentTypeOptions: string[] = ["EXPENSE", "INCOME"]; // TODO - source from DB.
  instrumentTypeOptions: string[] = ["ELECTRONIC", "CHECK", "CASH"]; // TODO - source from DB.

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl + '/payment';
    this.participantSearchUrl = environment.apiUrl + '/participant/search';
    this.eventInfoSearchUrl = environment.apiUrl + '/event/info/search';

    this.eventInfoList = [];
    this.actorList = [];
    this.recipientList = [];
    this.payment = createDefaultPaymentWithLabels();
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
    this.http.get<PaymentWithLabels>(`${this.apiUrl}/${id}`).subscribe({
      next: (data: PaymentWithLabels) => {
        if (data) {
          this.payment = data;
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
    const paymentToCreate: Payment = {
      eventInfoId: this.payment.eventInfoId,
      actorId: this.payment.eventInfoId,
      paymentActionType: this.payment.paymentActionType,
      recipientId: this.payment.recipientId,
      amount: this.payment.amount,
      paymentType: this.payment.paymentType,
      instrumentType: this.payment.instrumentType,
    }
    this.http.post(this.apiUrl, paymentToCreate).subscribe({
      next: (response) => {
        console.log('Payment created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating payment:', error);
      },
    })
  }

  update() {
    const paymentToUpdate: Payment = {
      id: this.payment.id,
      eventInfoId: this.payment.eventInfoId,
      actorId: this.payment.eventInfoId,
      paymentActionType: this.payment.paymentActionType,
      recipientId: this.payment.recipientId,
      amount: this.payment.amount,
      paymentType: this.payment.paymentType,
      instrumentType: this.payment.instrumentType,
      timeRecorded: this.payment.timeRecorded,
    }
    this.http.put(this.apiUrl, paymentToUpdate).subscribe({
      next: (response) => {
        console.log('Payment saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving payment:', error);
      },
    })
  }

  delete(): void {
    this.http.delete(`${this.apiUrl}/${this.payment.id}`).subscribe({
      next: () => {
        this.payment = createDefaultPaymentWithLabels();
      },
      error: (error) => {
        console.error('Error deleting payment:', error);
      }
    });
  }

  updateAmount(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.payment.amount = parseFloat(inputElement.value.replace(/[^0-9.]/g, '')) || 0; // Store raw numeric value
  }
}
