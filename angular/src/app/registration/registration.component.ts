import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { environment } from "../../environments/environment";
import { createDefaultParticipant, Participant } from "../models/participant";
import { HttpClient } from "@angular/common/http";
import { ProfileFormComponent } from "../profile-form/profile-form.component";
import { createDefaultEventInfo, EventInfo } from "../models/event-info";
import { ParticipantAssociationComponent } from "../participant-association/participant-association.component";
import { createDefaultRegistration, Registration } from "../models/registration";
import { createDefaultParticipantAssociation, ParticipantAssociation } from "../models/participant-association";
import { RegistrationPacket } from "../models/registration-packet";

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
  protected participant: Participant;
  protected participantAssociations: ParticipantAssociation[];
  protected registration: Registration;

  protected latestEventInfo: EventInfo;

  private registrationUrl = '';
  private eventInfoUrl = '';

  currentStep: number = 1;
  totalSteps: number = 3;

  constructor(private http: HttpClient) {
    this.registrationUrl = environment.apiUrl + '/registration';
    this.eventInfoUrl = environment.apiUrl + '/event/info';

    this.latestEventInfo = createDefaultEventInfo();

    this.participant = createDefaultParticipant();
    this.participantAssociations = [];
    this.registration = createDefaultRegistration();
  }

  async ngOnInit() {
    this.fetchLatestEventInfo();
  }

  onAddAssociation(): void {
    this.participantAssociations.push(createDefaultParticipantAssociation());
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
          this.participant = data.list[0];
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
        this.latestEventInfo = data;
      },
      error: (error) => {
        console.error('Error loading event info:', error);
      }
    });
  }

  submitRegistration(): void {
    this.participant.participantType = 'ATTENDEE';
    this.registration.eventInfoId = this.latestEventInfo.id;

    const registrationPacket: RegistrationPacket = {
      participant: this.participant,
      associations: this.participantAssociations,
      registration: this.registration,
    }

    this.http.post<{ id: number }>(this.registrationUrl, registrationPacket).subscribe({
      next: response => {
        if (response && response.id) {
          this.registration.id = response.id;
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
