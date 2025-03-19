import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { environment } from "../../environments/environment";
import { Participant } from "../models/participant-response";
import { HttpClient } from "@angular/common/http";
import { ProfileFormComponent } from "../profile-form/profile-form.component";
import { EventInfo } from "../models/event-info-response";
import { ParticipantAssociationComponent } from "../participant-association/participant-association.component";

@Component({
  selector: 'registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileFormComponent,
    ParticipantAssociationComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit{
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
  participantAssociations: { association: string | null, rawAssociateName: string | null }[] = [];
  pledgedAmount: number | null = null;
  signature: string | null = null;

  private registrationUrl = '';
  private eventInfoUrl = '';
  private latestEventInfoId: number | null = null;
  protected latestEventInfoName: string | null = null;
  protected latestEventInfoTitle: string | null = null;

  constructor(private http: HttpClient) { }

  currentStep: number = 1;
  totalSteps: number = 3;

  async ngOnInit() {
    this.registrationUrl = environment.apiUrl + '/registration';
    this.eventInfoUrl = environment.apiUrl + '/event/info';

    this.id = null;
    this.participantType = null;
    this.sponsor = null;
    this.nameFirst = null;
    this.nameLast = null;
    this.nameNick = null;
    this.dob = null;
    this.addrStreet_1 = null;
    this.addrStreet_2 = null;
    this.addrCity = null;
    this.addrStateAbbr = null;
    this.addrZip = null;
    this.addrEmail = null;
    this.phoneDigits = null;

    this.fetchLatestEventInfo();
  }

  onAddAssociation(): void {
    this.participantAssociations.push({ association: null, rawAssociateName: null });
  }

  onRemoveAssociation(index: number): void {
    if (index > -1 && index < this.participantAssociations.length) {
      this.participantAssociations.splice(index, 1);
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  fetchProfileByEmailAddress(email: string): void {
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
      this.http.post<{ list: Participant[], count: number }>(`${this.registrationUrl}/search`, searchRequest).subscribe({
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

  fetchLatestEventInfo(): void {
    this.http.get<EventInfo>(`${this.eventInfoUrl}/latest`).subscribe({
      next: (data: EventInfo) => {
        if (data) {
          this.latestEventInfoId = data.id;
          this.latestEventInfoName = data.eventName;
          this.latestEventInfoTitle = data.eventTitle;
        }
      },
      error: (error) => {
        console.error('Error loading event info:', error);
      }
    });
  }

  submitRegistration(): void {
    const participant = {
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
    };

    const registration = {
      participant: participant,
      associations: this.participantAssociations,
      eventInfoId: this.latestEventInfoId,
      donationPledge: this.pledgedAmount,
      signature: this.signature,
    }

    this.http.post<{ id: number }>(this.registrationUrl, registration).subscribe({
      next: response => {
        if (response && response.id) {
          this.id = response.id;
          console.log('Profile created with ID:', response.id);
        } else {
          console.error('Invalid response: Missing id');
        }
      },
      error: err => {
        console.error('Error creating profile:', err);
      }
    });
  }
}
