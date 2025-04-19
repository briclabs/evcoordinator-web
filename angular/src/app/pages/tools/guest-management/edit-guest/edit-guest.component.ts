import { Component, OnInit } from '@angular/core';
import { GuestFormComponent } from "../../../forms/guest-form/guest-form.component";
import { RegistrationWithLabels } from "../../../../models/registration-with-labels";
import { Participant } from "../../../../models/participant";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { SearchRequest } from "../../../../models/search-request";
import { createDefaultGuestWithLabels, GuestWithLabels } from "../../../../models/guest-with-labels";
import { CreateResponse } from "../../../../models/create-response";
import { UpdateResponse } from "../../../../models/update-response";
import { DeleteResponse } from "../../../../models/delete-response";
import { createFromGuestWithLabels } from "../../../../models/guest";

@Component({
  selector: 'app-edit-guest',
  standalone: true,
  imports: [
    GuestFormComponent,
  ],
  templateUrl: './edit-guest.component.html',
  styleUrl: './edit-guest.component.css'
})
export class EditGuestComponent implements OnInit {
  protected messages: Map<string, string> = new Map<string, string>();

  protected guest: GuestWithLabels;

  protected registrationList: RegistrationWithLabels[];
  protected guestProfileList: Participant[];

  private guestUrl = '';
  private registrationSearchUrl = '';
  private guestProfileSearchUrl = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
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
    this.http.post<CreateResponse>(this.guestUrl, createFromGuestWithLabels(this.guest)).subscribe({
      next: (response: CreateResponse) => {
        this.router.navigate([`/tools/edit-guest/${response.insertedId}`]);
      },
      error: (error) => {
        this.messages = CreateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  update() {
    this.http.put(this.guestUrl, createFromGuestWithLabels(this.guest)).subscribe({
      next: () => {
      },
      error: (error) => {
        this.messages = UpdateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  delete(): void {
    this.http.delete<DeleteResponse>(`${this.guestUrl}/${this.guest.id}`).subscribe({
      next: () => {
        this.router.navigate([`/tools/guests`]);
      },
      error: (error) => {
        this.messages = DeleteResponse.getMessagesFromObject(error.error);
      }
    });
  }
}
