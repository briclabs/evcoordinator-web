import { Component, OnInit, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { Participant } from '../../../../models/participant';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { RegistrationFormComponent } from "../../../forms/registration-form/registration-form.component";
import { createDefaultRegistrationWithLabels, RegistrationWithLabels } from "../../../../models/registration-with-labels";
import { EventInfo } from "../../../../models/event-info";
import { SearchRequest } from "../../../../models/search-request";
import { CreateResponse } from "../../../../models/create-response";
import { UpdateResponse } from "../../../../models/update-response";
import { DeleteResponse } from "../../../../models/delete-response";
import { createRegistrationFromRegistrationWithLabels } from "../../../../models/registration";
import { ErrorMessageComponent } from "../../../subcomponents/error-message/error-message.component";

@Component({
  selector: 'edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RegistrationFormComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './edit-registration.component.html',
  styleUrls: ['./edit-registration.component.css']
})
export class EditRegistrationComponent implements OnInit {
  protected messages: Map<string, string> = new Map<string, string>();

  protected registration: RegistrationWithLabels;

  protected eventInfoList: EventInfo[];
  protected participantList: Participant[];

  private registrationUrl = '';
  private participantSearchUrl = '';
  private eventInfoSearchUrl = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.registrationUrl = environment.apiUrl + '/registration';
    this.participantSearchUrl = environment.apiUrl + '/participant/search';
    this.eventInfoSearchUrl = environment.apiUrl + '/event/info/search';

    this.eventInfoList = [];
    this.participantList = [];
    this.registration = createDefaultRegistrationWithLabels();
  }

  async ngOnInit() {
    this.fetchEventInfoList();
    this.fetchParticipantList();
    this.route.paramMap.subscribe(params => {
      const id: string | null = params.get('id');
      if (id) {
        this.fetchRegistrationById(parseInt(id, 10));
      }
    });
  }

  fetchRegistrationById(id: number): void {
    this.http.get<RegistrationWithLabels>(`${this.registrationUrl}/${id}`).subscribe({
      next: (data: RegistrationWithLabels) => {
        if (data) {
          this.registration = data;
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

  fetchParticipantList(): void {
    let searchRequest: SearchRequest = {
      searchConfiguration: {
        exactMatch: true,
        sortColumn: 'name_last',
        sortAsc: false,
        offset: 0,
        max: 10
      },
      searchCriteria: {
        participant_type: 'ATTENDEE',
      }
    };
    this.http.post<{ list: Participant[]; count: number }>(`${this.participantSearchUrl}`, searchRequest).subscribe({
      next: (data) => {
        if (data && data.list) {
          this.participantList = data.list;
        }
      },
      error: (error) => {
        console.error('Error loading participant list:', error);
      }
    });
  }

  create() {
    this.http.post<CreateResponse>(this.registrationUrl, createRegistrationFromRegistrationWithLabels(this.registration)).subscribe({
      next: (response: CreateResponse) => {
        this.router.navigate([`/tools/edit-registration/${response.insertedId}`]);
      },
      error: (error) => {
        this.messages = CreateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  update() {
    this.http.put(this.registrationUrl, createRegistrationFromRegistrationWithLabels(this.registration)).subscribe({
      next: () => {
      },
      error: (error) => {
        this.messages = UpdateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  delete(): void {
    this.http.delete<DeleteResponse>(`${this.registrationUrl}/${this.registration.id}`).subscribe({
      next: () => {
        this.router.navigate([`/tools/registrations`]);
      },
      error: (error) => {
        this.messages = DeleteResponse.getMessagesFromObject(error.error);
      }
    });
  }
}
