import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { createDefaultParticipant, Participant } from "../../../models/participant";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ProfileFormComponent } from "../../forms/profile-form/profile-form.component";
import { createDefaultEventInfo, EventInfo } from "../../../models/event-info";
import { GuestFormComponent } from "../../forms/guest-form/guest-form.component";
import { Registration } from "../../../models/registration";
import { createDefaultGuestWithLabels, GuestWithLabels } from "../../../models/guest-with-labels";
import { RegistrationPacket } from "../../../models/registration-packet";
import { catchError, map, Observable, of } from "rxjs";
import { RegistrationFormComponent } from "../../forms/registration-form/registration-form.component";
import { createDefaultRegistrationWithLabels, RegistrationWithLabels } from "../../../models/registration-with-labels";
import { CreateResponse } from "../../../models/create-response";
import { Router } from "@angular/router";

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
  protected profileMessages: Map<string, string> = new Map<string, string>();
  protected guestMessages: Map<string, string> = new Map<string, string>();
  protected registrationMessages: Map<string, string> = new Map<string, string>();

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

  constructor(private http: HttpClient, private router: Router) {
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

    this.http.post<CreateResponse>(this.registrationUrl, registrationPacket).subscribe({
      next: () => {
        this.router.navigate([`/`]);
      },
      error: error => {
        console.error('Error creating profile:', error);
        this.getMessagesFromObject(error);
      }
    });
  }

  private getMessagesFromObject(error: any): void {
    if (!(error.error && typeof error.error === 'object' && 'messages' in error.error && 'insertedId' in error.error)) {
      console.log('Object was not of the correct type.')
      return;
    }
    const createResponse: CreateResponse = error.error as CreateResponse;
    console.log('Create Response:', createResponse);

    let receivedMessages: Map<string, string> = new Map<string, string>();
    if (createResponse.messages instanceof Map) {
      receivedMessages = new Map<string, string>(createResponse.messages);
    } else if (typeof createResponse.messages === 'object') {
      receivedMessages = new Map<string, string>(Object.entries(createResponse.messages));
    }

    this.profileMessages = this.extractMessagesForSection(receivedMessages, 'PARTICIPANT.');
    this.guestMessages = this.extractMessagesForSection(receivedMessages, 'GUESTS.');
    this.registrationMessages = this.extractMessagesForSection(receivedMessages, 'REGISTRATION.');
  }

  private extractMessagesForSection(messages: Map<string, string>, sectionPrefix: string): Map<string, string> {
    const filteredMessages: Map<string, string> = new Map<string, string>();
    messages.forEach((value, key) => {
      if (key.startsWith(sectionPrefix)) {
        filteredMessages.set(key.replace(sectionPrefix, '').trim(), value);
      }
    })
    console.log('Filtered Messages:', filteredMessages);
    return filteredMessages;
  }
}
