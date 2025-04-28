import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { createDefaultRegistrationWithLabels, RegistrationWithLabels } from "../../../models/registration-with-labels";
import { Participant } from "../../../models/participant";
import { EventInfo } from "../../../models/event-info";
import { ErrorMessageComponent } from "../../subcomponents/error-message/error-message.component";
import { ValidatorService } from "../../../services/validator/validator.service";

@Component({
  selector: 'registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorMessageComponent],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  @Input() registration: RegistrationWithLabels;
  @Output() registrationChange = new EventEmitter<RegistrationWithLabels>();

  @Input() participantList: Participant[];
  @Input() eventInfoList: EventInfo[];

  @Input() messages: Map<string, string> = new Map<string, string>();
  @Output() messagesChange = new EventEmitter<Map<string, string>>();
  
  @Input() showSubmitButton: boolean = false;

  @Output() formSubmit = new EventEmitter<void>();

  validatorService: ValidatorService = inject(ValidatorService);

  constructor() {
    this.registration = createDefaultRegistrationWithLabels();
    this.participantList = [];
    this.eventInfoList = [];
  }

  validate(event: Event): void {
    if (event instanceof Event) {
      const clonedMessages = new Map(this.messages);
      const inputValue = (event.target as HTMLInputElement).value?? '';
      const inputId = (event.target as HTMLInputElement).id;

      switch (inputId) {
        case 'participantSelect':
          this.validatorService.mustBeValidId(inputValue, clonedMessages, 'participant_id');
          break;
        case 'eventInfoSelect':
          this.validatorService.mustBeValidId(inputValue, clonedMessages, 'event_info_id');
          break;
        case 'amountDonation':
          this.validatorService.mustBePositiveNumber(inputValue, clonedMessages, 'donation_pledge');
          break;
        case 'signature':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'signature');
          break;
      }
      this.messages = clonedMessages;
      this.messagesChange.emit(this.messages);
    }
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
