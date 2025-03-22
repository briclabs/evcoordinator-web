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
import { catchError, map, Observable, of } from "rxjs";

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

  protected isPreexisting: boolean = false;

  private registrationUrl = '';
  private participantUrl = '';
  private eventInfoUrl = '';

  currentStep: number = 1;
  totalSteps: number = 3;

  constructor(private http: HttpClient) {
    this.registrationUrl = environment.apiUrl + '/registration';
    this.participantUrl = environment.apiUrl + '/participant';
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

  preexists(): Observable<boolean> {
    return this.http.post<void>(this.participantUrl + '/preexists', this.participant, { observe: 'response' }).pipe(
      map(response => {
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

    this.http.post<{ id: number }>(this.isPreexisting ? this.registrationUrl + '/preExisting' : this.registrationUrl + '/newProfile', registrationPacket).subscribe({
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
