import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { createDefaultRegistrationWithLabels, RegistrationWithLabels } from "../models/registration-with-labels";
import { Participant } from "../models/participant";
import { EventInfo } from "../models/event-info";

@Component({
  selector: 'registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  @Input() registration: RegistrationWithLabels;
  @Output() registrationChange = new EventEmitter<RegistrationWithLabels>();

  @Input() participantList: Participant[];
  @Input() eventInfoList: EventInfo[];

  @Input() showSubmitButton: boolean = false;

  @Output() formSubmit = new EventEmitter<void>();

  constructor() {
    this.registration = createDefaultRegistrationWithLabels();
    this.participantList = [];
    this.eventInfoList = [];
  }

  updateParticipant(participantId: string): void {
    const selectedParticipant: Participant | undefined = this.participantList.find((participant: Participant) => participant.id === Number.parseInt(participantId, 10));
    if (selectedParticipant) {
      this.registration.participantId = selectedParticipant.id;
      this.registration.participantNameFirst = selectedParticipant.nameFirst;
      this.registration.participantNameLast = selectedParticipant.nameLast;
    }
  }

  updateEventInfo(eventInfoId: string): void {
    const selectedEventInfo: EventInfo | undefined = this.eventInfoList.find((eventInfo: EventInfo) => eventInfo.id === Number.parseInt(eventInfoId, 10));
    if (selectedEventInfo) {
      this.registration.eventInfoId = selectedEventInfo.id;
      this.registration.eventName = selectedEventInfo.eventName;
      this.registration.eventTitle = selectedEventInfo.eventTitle;
    }
  }

  submitForm() {
    this.formSubmit.emit();
  }
}
