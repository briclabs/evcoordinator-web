import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { environment } from "../../environments/environment";
import { createDefaultParticipant, Participant } from "../models/participant";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ProfileFormComponent } from "../profile-form/profile-form.component";
import { createDefaultEventInfo, EventInfo } from "../models/event-info";
import { GuestFormComponent } from "../guest-form/guest-form.component";
import { Registration } from "../models/registration";
import { createDefaultGuestWithLabels, GuestWithLabels } from "../models/guest-with-labels";
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
    GuestFormComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit{
  protected participant: Participant;
  protected guests = signal<GuestWithLabels[]>([]);
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
    this.guests.set([]);
    this.registration = createDefaultRegistrationWithLabels();
  }

  async ngOnInit() {
    this.fetchLatestEventInfo();
  }

  onAddGuest(): void {
    this.guests.set([...this.guests(), createDefaultGuestWithLabels()]);
  }

  onRemoveGuest(index: number): void {
    this.guests.set(this.guests().filter((_, i) => i !== index));
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
        this.registration.eventInfoId = this.eventInfo.id;
        this.registration.eventTitle = this.eventInfo.eventTitle;
        this.registration.eventName = this.eventInfo.eventName;
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

    const guestsToCreate = this.guests().map(guest => ({
      rawGuestName: guest.rawGuestName,
      relationship: guest.relationship,
    }));

    const registrationPacket: RegistrationPacket = {
      participant: this.participant,
      guests: guestsToCreate,
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
