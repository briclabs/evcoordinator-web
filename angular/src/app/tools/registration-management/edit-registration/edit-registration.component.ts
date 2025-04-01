import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Participant } from '../../../models/participant';
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { RegistrationFormComponent } from "../../../registration-form/registration-form.component";
import { createDefaultRegistrationWithLabels, RegistrationWithLabels } from "../../../models/registration-with-labels";
import { EventInfo } from "../../../models/event-info";
import { Registration } from "../../../models/registration";
import { SearchRequest } from "../../../models/search-request";
import { createDefaultGuestWithLabels } from "../../../models/guest-with-labels";

@Component({
  selector: 'edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RegistrationFormComponent,
  ],
  templateUrl: './edit-registration.component.html',
  styleUrls: ['./edit-registration.component.css']
})
export class EditRegistrationComponent implements OnInit {
  protected registration: RegistrationWithLabels;

  protected eventInfoList: EventInfo[];
  protected participantList: Participant[];

  private registrationUrl = '';
  private participantSearchUrl = '';
  private eventInfoSearchUrl = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
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
          console.log(this.eventInfoList);
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
    const registrationToCreate: Registration = {
      participantId: this.registration.participantId,
      eventInfoId: this.registration.eventInfoId,
      donationPledge: this.registration.donationPledge,
      signature: this.registration.signature,
    }
    this.http.post(this.registrationUrl, registrationToCreate).subscribe({
      next: (response) => {
        console.log('Registration created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating registration:', error);
      },
    })
  }

  update() {
    const registrationToUpdate: Registration = {
      id: this.registration.id,
      participantId: this.registration.participantId,
      eventInfoId: this.registration.eventInfoId,
      donationPledge: this.registration.donationPledge,
      signature: this.registration.signature,
      timeRecorded: this.registration.timeRecorded,
    }
    this.http.put(this.registrationUrl, registrationToUpdate).subscribe({
      next: (response) => {
        console.log('Profile saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving profile:', error);
      },
    })
  }

  delete(): void {
    this.http.delete(`${this.registrationUrl}/${this.registration.id}`).subscribe({
      next: () => {
        this.registration = createDefaultRegistrationWithLabels();
      },
      error: (error) => {
        console.error('Error deleting guest:', error);
      }
    });
  }
}
