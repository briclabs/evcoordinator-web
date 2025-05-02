import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { createDefaultParticipant, Participant } from "../../../models/participant";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ProfileFormComponent } from "../../forms/profile-form/profile-form.component";
import { createDefaultEventInfo, EventInfo } from "../../../models/event-info";
import { GuestFormComponent } from "../../forms/guest-form/guest-form.component";
import { Registration } from "../../../models/registration";
import { RegistrationPacket } from "../../../models/registration-packet";
import { catchError, map, Observable, of } from "rxjs";
import { RegistrationFormComponent } from "../../forms/registration-form/registration-form.component";
import { createDefaultRegistrationWithLabels, RegistrationWithLabels } from "../../../models/registration-with-labels";
import { CreateResponse } from "../../../models/create-response";
import { Router } from "@angular/router";
import {
  createDefaultGuestWithLabelsAndMessages,
  GuestWithLabelsAndMessages,
} from "../../../models/guest-with-labels-and-messages";
import { ErrorMessageComponent } from "../../subcomponents/error-message/error-message.component";

@Component({
  selector: 'registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileFormComponent,
    RegistrationFormComponent,
    GuestFormComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit{
  protected generalMessages: Map<string, string> = new Map<string, string>();

  protected participant: Participant;
  protected profileMessages: Map<string, string> = new Map<string, string>();

  protected guestsWithMessages: WritableSignal<GuestWithLabelsAndMessages[]> = signal<GuestWithLabelsAndMessages[]>([]);

  protected registration: RegistrationWithLabels;
  protected registrationMessages: Map<string, string> = new Map<string, string>();

  protected eventInfo: EventInfo;

  protected isPreexisting: boolean = false;

  private registrationUrl = `${environment.apiUrl}/registrationPacket`;
  private participantUrl = `${environment.apiUrl}/participant`;
  private eventInfoUrl = `${environment.apiUrl}/event/info`;

  currentStep: number = 1;
  totalSteps: number = 3;

  constructor(private http: HttpClient, private router: Router) {
    this.eventInfo = createDefaultEventInfo();
    this.participant = createDefaultParticipant();
    this.guestsWithMessages.set([]);
    this.registration = createDefaultRegistrationWithLabels();
  }

  async ngOnInit() {
    this.fetchLatestEventInfo();
  }

  onAddGuest(): void {
    this.guestsWithMessages.set([...this.guestsWithMessages(), createDefaultGuestWithLabelsAndMessages()]);
  }

  onRemoveGuest(index: number): void {
    console.log('Guest Messages before removal:', this.guestsWithMessages().map(guest => guest.messages));
    this.guestsWithMessages.set(this.guestsWithMessages().filter((_, i) => i !== index));
    console.log('Guest Messages after removal:', this.guestsWithMessages().map(guest => guest.messages));
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
    if (this.isPreexisting) {
      this.profileMessages = new Map<string, string>();
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

    const guestsToCreate = this.guestsWithMessages().map(guest => ({
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
        document.getElementById('cancel')?.click();
        this.router.navigate([`/`]);
      },
      error: error => {
        console.error('Error creating profile:', error);
        this.getMessagesFromObject(error);
        document.getElementById('cancel')?.click();
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

    this.generalMessages = this.extractMessagesForSection(receivedMessages, 'GENERAL_MESSAGE|');
    this.profileMessages = this.extractMessagesForSection(receivedMessages, 'PARTICIPANT|');
    this.extractIndexedMessagesForSection(receivedMessages, 'GUESTS|');
    this.registrationMessages = this.extractMessagesForSection(receivedMessages, 'REGISTRATION|');
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

  private extractIndexedMessagesForSection(messages: Map<string, string>, sectionPrefix: string): void {
    messages.forEach((value, key) => {
      if (key.startsWith(sectionPrefix)) {
        const keyParts = key.split('|');
        const guestIndex = parseInt(keyParts[1]);
        const guestField = keyParts[2];
        const matchingGuest = this.guestsWithMessages()[guestIndex];
        matchingGuest.messages.set(guestField, value);
      }
    })
  }

  hasMessages(): boolean {
    return (!this.isPreexisting && this.profileMessages?.size > 0) || this.guestsWithMessages().some(guest => guest.messages && guest.messages.size > 0) || this.registrationMessages?.size > 0;
  }
}
