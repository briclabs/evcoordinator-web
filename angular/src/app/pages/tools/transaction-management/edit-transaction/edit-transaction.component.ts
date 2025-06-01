import { Component, inject, OnInit } from '@angular/core';
import { EventInfo } from "../../../../models/event-info";
import { Participant } from "../../../../models/participant";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { SearchRequest } from "../../../../models/search-request";
import { createDefaultTransactionWithLabels, TransactionWithLabels } from "../../../../models/transaction-with-labels";
import { createTransactionFromTransactionWithLabels } from "../../../../models/transaction";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { CreateResponse } from "../../../../models/create-response";
import { UpdateResponse } from "../../../../models/update-response";
import { DeleteResponse } from "../../../../models/delete-response";
import { ErrorMessageComponent } from "../../../subcomponents/error-message/error-message.component";
import { ValidatorService } from "../../../../services/validator/validator.service";
import { StaticLookupService } from "../../../../services/static-lookup/static-lookup.service";

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    ErrorMessageComponent,
  ],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css'
})
export class EditTransactionComponent implements OnInit {
  protected messages: Map<string, string> = new Map<string, string>();

  protected transaction: TransactionWithLabels;

  protected eventInfoList: EventInfo[];
  protected actorList: Participant[];
  protected recipientList: Participant[];

  private apiUrl = `${environment.apiUrl}/transactions`;
  private participantSearchUrl = `${environment.apiUrl}/participant/search`;
  private eventInfoSearchUrl = `${environment.apiUrl}/event/info/search`;

  transactionTypeOptions: string[] = [];
  instrumentTypeOptions: string[] = [];

  validatorService: ValidatorService = inject(ValidatorService);

  private staticLookupService: StaticLookupService = inject(StaticLookupService);

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.eventInfoList = [];
    this.actorList = [];
    this.recipientList = [];
    this.transaction = createDefaultTransactionWithLabels();

    this.staticLookupService.transactionType().subscribe({
      next: (data: string[]) => {
        this.transactionTypeOptions = data;
      },
      error: (error: any) => {
        console.error('Error fetching transaction types:', error);
      }
    });

    this.staticLookupService.transactionInstrument().subscribe({
      next: (data: string[]) => {
        this.instrumentTypeOptions = data;
      },
      error: (error: any) => {
        console.error('Error fetching instrument types:', error);
      }
    });
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

  validate(event: Event): void {
    if (event instanceof InputEvent) {
      const clonedMessages = new Map(this.messages);
      const inputValue = (event.target as HTMLInputElement).value?? '';
      const inputId = (event.target as HTMLInputElement).id;

      switch (inputId) {
        case 'event':
          this.validatorService.mustBeValidId(inputValue, clonedMessages, 'event_info_id');
          break;
        case 'type':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'transaction_type');
          break;
        case 'actor':
          this.validatorService.mustBeValidId(inputValue, clonedMessages, 'actor_id');
          break;
        case 'amount':
          this.validatorService.mustBePositiveNumber(inputValue, clonedMessages, 'amount');
          break;
        case 'recipient':
          this.validatorService.mustBeValidId(inputValue, clonedMessages, 'recipient_id');
          break;
        case 'instrument':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'instrument_type');
          break;
        case 'memo':
          this.validatorService.mustBeEmptyOrNotBeBlank(inputValue, clonedMessages, 'memo');
          break;
      }
      this.messages = clonedMessages;
    }
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
    this.http.post<CreateResponse>(this.apiUrl, createTransactionFromTransactionWithLabels(this.transaction)).subscribe({
      next: (response: CreateResponse) => {
        this.router.navigate([`/tools/edit-transaction/${response.insertedId}`]);
      },
      error: (error) => {
        this.messages = CreateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  update() {
    this.http.put(this.apiUrl, createTransactionFromTransactionWithLabels(this.transaction)).subscribe({
      next: () => {
      },
      error: (error) => {
        this.messages = UpdateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  delete(): void {
    this.http.delete<DeleteResponse>(`${this.apiUrl}/${this.transaction.id}`).subscribe({
      next: (response: DeleteResponse) => {
        this.router.navigate([`/tools/transactions`]);
      },
      error: (error) => {
        this.messages = DeleteResponse.getMessagesFromObject(error.error);
      }
    });
  }
}
