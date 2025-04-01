import { Component, OnInit } from '@angular/core';
import { GuestFormComponent } from "../../../guest-form/guest-form.component";
import { RegistrationWithLabels } from "../../../models/registration-with-labels";
import { Participant } from "../../../models/participant";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { SearchRequest } from "../../../models/search-request";
import { createDefaultGuestWithLabels, GuestWithLabels } from "../../../models/guest-with-labels";
import { Guest } from "../../../models/guest";
import { EventInfo } from "../../../models/event-info";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-edit-guest',
  standalone: true,
  imports: [
    GuestFormComponent,
    NgIf,
  ],
  templateUrl: './edit-guest.component.html',
  styleUrl: './edit-guest.component.css'
})
export class EditGuestComponent implements OnInit {
  protected guest: GuestWithLabels;

  protected registrationList: RegistrationWithLabels[];
  protected guestProfileList: Participant[];

  private guestUrl = '';
  private registrationSearchUrl = '';
  private guestProfileSearchUrl = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.guestUrl = environment.apiUrl + '/guest';
    this.registrationSearchUrl = environment.apiUrl + '/registration/search';
    this.guestProfileSearchUrl = environment.apiUrl + '/participant/search';

    this.registrationList = [];
    this.guestProfileList = [];
    this.guest = createDefaultGuestWithLabels();
  }

  async ngOnInit() {
    this.fetchRegistrationList();
    this.fetchGuestProfileList();
    this.route.paramMap.subscribe(params => {
      const id: string | null = params.get('id');
      if (id) {
        this.fetchGuestById(parseInt(id, 10));
      }
    });
  }

  fetchGuestById(id: number): void {
    this.http.get<GuestWithLabels>(`${this.guestUrl}/${id}`).subscribe({
      next: (data: GuestWithLabels) => {
        if (data) {
          this.guest = data;
        }
      },
      error: (error) => {
        console.error('Error loading guest:', error);
      }
    });
  }

  fetchRegistrationList(): void {
    let searchRequest: SearchRequest = {
      searchConfiguration: {
        exactMatch: true,
        sortColumn: 'event_name',
        sortAsc: false,
        offset: 0,
        max: 10
      },
      searchCriteria: {}
    };
    this.http.post<{list: RegistrationWithLabels[]; count: number}>(`${this.registrationSearchUrl}`, searchRequest).subscribe({
      next: (data) => {
        if (data && data.list) {
          this.registrationList = data.list;
          console.log(this.registrationList);
        }
      },
      error: (error) => {
        console.error('Error loading registration list:', error);
      }
    });
  }

  fetchGuestProfileList(): void {
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
    this.http.post<{ list: Participant[]; count: number }>(`${this.guestProfileSearchUrl}`, searchRequest).subscribe({
      next: (data) => {
        if (data && data.list) {
          this.guestProfileList = data.list;
        }
      },
      error: (error) => {
        console.error('Error loading guest profile list:', error);
      }
    });
  }

  create() {
    const guestToCreate: Guest = {
      inviteeProfileId: this.guest.inviteeProfileId,
      registrationId: this.guest.registrationId,
      rawGuestName: this.guest.rawGuestName,
      guestProfileId: this.guest.guestProfileId,
      relationship: this.guest.relationship,
    }
    this.http.post(this.guestUrl, guestToCreate).subscribe({
      next: (response) => {
        console.log('Guest created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating guest:', error);
      },
    })
  }

  update() {
    const guestToUpdate: Guest = {
      id: this.guest.id,
      inviteeProfileId: this.guest.inviteeProfileId,
      registrationId: this.guest.registrationId,
      rawGuestName: this.guest.rawGuestName,
      guestProfileId: this.guest.guestProfileId,
      relationship: this.guest.relationship,
      timeRecorded: this.guest.timeRecorded,
    }
    this.http.put(this.guestUrl, guestToUpdate).subscribe({
      next: (response) => {
        console.log('Guest saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving guest:', error);
      },
    })
  }

  delete(): void {
    this.http.delete(`${this.guestUrl}/${this.guest.id}`).subscribe({
      next: () => {
        this.guest = createDefaultGuestWithLabels();
      },
      error: (error) => {
        console.error('Error deleting guest:', error);
      }
    });
  }
}
