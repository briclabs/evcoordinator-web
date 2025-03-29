import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { environment } from "../../environments/environment";
import { createDefaultParticipant, Participant } from "../models/participant";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ProfileFormComponent } from "../profile-form/profile-form.component";
import { createDefaultEventInfo, EventInfo } from "../models/event-info";
import { ParticipantAssociationComponent } from "../participant-association/participant-association.component";
import { Registration } from "../models/registration";
import { createDefaultParticipantAssociation, ParticipantAssociation } from "../models/participant-association";
import { RegistrationPacket } from "../models/registration-packet";
import { catchError, map, Observable, of } from "rxjs";
import { RegistrationFormComponent } from "../registration-form/registration-form.component";
import { createDefaultRegistrationWithLabels, RegistrationWithLabels } from "../models/registration-with-labels";

@Component({
  selector: 'registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileFormComponent,
    RegistrationFormComponent,
    ParticipantAssociationComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit{
  protected participant: Participant;
  protected participantAssociations: ParticipantAssociation[];
  protected registration: RegistrationWithLabels;

  protected eventInfo: EventInfo;

  protected isPreexisting: boolean = false;

  private registrationUrl = '';
  private participantUrl = '';
  private eventInfoUrl = '';

  currentStep: number = 1;
  totalSteps: number = 3;

  constructor(private http: HttpClient) {
    this.registrationUrl = environment.apiUrl + '/registrationPacket';
    this.participantUrl = environment.apiUrl + '/participant';
    this.eventInfoUrl = environment.apiUrl + '/event/info';

    this.eventInfo = createDefaultEventInfo();

    this.participant = createDefaultParticipant();
    this.participantAssociations = [];
    this.registration = createDefaultRegistrationWithLabels();
  }

  async ngOnInit() {
    this.fetchLatestEventInfo();
    this.registration.eventInfoId = this.eventInfo.id;
    this.registration.eventTitle = this.eventInfo.eventTitle;
    this.registration.eventName = this.eventInfo.eventName;
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

  preexists(): Observable<boolean> {
    return this.http.post<void>(this.participantUrl + '/preexists', this.participant, { observe: 'response' }).pipe(
      map((response: HttpResponse<void>) => {
        return response.status === 200;
      }),
      catchError(err => {
        if (err.status === 404) {
          console.warn('Profile not found:', err);
          return of(false);
        }
        console.error('Unexpected error while checking profile preexists:', err);
        return of(false);
      })
    );
  }


  checkPreexistingProfile(): void {
    if (this.participant.nameFirst && this.participant.nameLast && this.participant.addrEmail) {
      this.preexists().subscribe((exists: boolean) => {
        this.isPreexisting = exists;
      });
    }
  }

  fetchLatestEventInfo(): void {
    this.http.get<EventInfo>(`${this.eventInfoUrl}/latest`).subscribe({
      next: (data: EventInfo) => {
        this.eventInfo = data;
      },
      error: (error) => {
        console.error('Error loading event info:', error);
      }
    });
  }

  submitRegistration(): void {
    this.participant.participantType = 'ATTENDEE';

    const registrationToCreate: Registration = {
      eventInfoId: this.registration.eventInfoId,
      donationPledge: this.registration.donationPledge,
      signature: this.registration.signature,
    }

    const registrationPacket: RegistrationPacket = {
      participant: this.participant,
      associations: this.participantAssociations,
      registration: registrationToCreate,
    }

    this.http.post<{ id: number }>(this.isPreexisting ? this.registrationUrl + '/preExisting' : this.registrationUrl + '/newProfile', registrationPacket).subscribe({
      next: (response: { id: number }) => {
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
