import { Component, inject, OnInit } from '@angular/core';
import {
  ContactUtilityServiceService
} from "../../../app-services/contact-utility-service/contact-utility-service.service";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Participant } from '../../../models/participant-response';
import { CommonModule } from "@angular/common";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  contactUtilityServiceService: ContactUtilityServiceService = inject(ContactUtilityServiceService);

  id: number | null = null;
  participantType: string | null = null;
  sponsor: string | null = null;
  nameFirst: string | null = null;
  nameLast: string | null = null;
  nameNick: string | null = null;
  dob: string | null = null;
  addrStreet_1: string | null = null;
  addrStreet_2: string | null = null;
  addrCity: string | null = null;
  addrStateAbbr: string | null = null;
  addrZip: number | null = null;
  addrEmail: string | null = null;
  phoneDigits: number | null = null;

  private apiUrl = '';
  private authenticationService = inject(OidcSecurityService);

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.apiUrl = environment.apiUrl + '/participant';

    this.authenticationService.getUserData().subscribe((userData: any) => {
      if (userData && userData.email) {
        this.fetchMyProfile(userData.email);
      }
      if (!this.id) {
        this.addrEmail = userData.email;
      }
    });
  }

  fetchMyProfile(email: string): void {
    try {
      let searchRequest = {
        searchConfiguration: {
          exactMatch: true,
          sortColumn: 'id',
          sortAsc: true,
          offset: 0,
          max: 1,
        },
        searchCriteria: {
          addr_email: email,
        }
      };
      this.http.post<{ list: Participant[], count: number }>(`${this.apiUrl}/search`, searchRequest).subscribe({
        next: (data) => {
          if (!data || !data.list || data.list.length === 0 || !(data.count > 0)) {
            return;
          }
          const participant = data.list[0];
          this.id = participant.id;
          this.participantType = participant.participantType;
          this.sponsor = participant.sponsor;
          this.nameFirst = participant.nameFirst;
          this.nameLast = participant.nameLast;
          this.nameNick = participant.nameNick;
          this.dob = participant.dob;
          this.addrStreet_1 = participant.addrStreet_1;
          this.addrStreet_2 = participant.addrStreet_2 ?? '';
          this.addrCity = participant.addrCity;
          this.addrStateAbbr = participant.addrStateAbbr;
          this.addrZip = participant.addrZip;
          this.addrEmail = participant.addrEmail;
          this.phoneDigits = participant.phoneDigits;
        }
      });
    } catch (error) {
      console.error('Error fetching my profile:', error);
      throw error;
    }
  }

  create() {
    this.http.post(this.apiUrl, {
      id: this.id,
      participantType: 'ATTENDEE',
      sponsor: this.sponsor,
      nameFirst: this.nameFirst,
      nameLast: this.nameLast,
      nameNick: this.nameNick,
      dob: this.dob,
      addrStreet_1: this.addrStreet_1,
      addrStreet_2: this.addrStreet_2,
      addrCity: this.addrCity,
      addrStateAbbr: this.addrStateAbbr,
      addrZip: this.addrZip,
      addrEmail: this.addrEmail,
      phoneDigits: this.phoneDigits,
    }).subscribe({
      next: (response) => {
        console.log('Profile created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating profile:', error);
      },
    })
  }

  update() {
    this.http.put(this.apiUrl, {
      id: this.id,
      participantType: this.participantType,
      sponsor: this.sponsor,
      nameFirst: this.nameFirst,
      nameLast: this.nameLast,
      nameNick: this.nameNick,
      dob: this.dob,
      addrStreet_1: this.addrStreet_1,
      addrStreet_2: this.addrStreet_2,
      addrCity: this.addrCity,
      addrStateAbbr: this.addrStateAbbr,
      addrZip: this.addrZip,
      addrEmail: this.addrEmail,
      phoneDigits: this.phoneDigits,
    }).subscribe({
      next: (response) => {
        console.log('Profile saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving profile:', error);
      },
    })
  }
}
