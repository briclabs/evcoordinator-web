import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { createDefaultGuestWithLabels, GuestWithLabels } from "../../../models/guest-with-labels";
import { Participant } from "../../../models/participant";
import { RegistrationWithLabels } from "../../../models/registration-with-labels";
import { ErrorMessageComponent } from "../../subcomponents/error-message/error-message.component";
import { ValidatorService } from "../../../services/validator/validator.service";

@Component({
  selector: 'guest-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    NgIf,
    ErrorMessageComponent,
  ],
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.css'
})
export class GuestFormComponent {
  @Input() guest: GuestWithLabels;
  @Output() guestChange = new EventEmitter<GuestWithLabels>();

  @Input() registrationList: RegistrationWithLabels[];
  @Input() guestProfileList: Participant[];

  relationshipTypeOptions: string[] = ["ADULT", "CHILD", "PET"]; // TODO - source from DB.

  @Input() messages: Map<string, string> = new Map<string, string>();
  @Output() messagesChange = new EventEmitter<Map<string, string>>();

  @Input() showSubmitButton: boolean = false;

  @Output() formSubmit = new EventEmitter<void>();

  validatorService: ValidatorService = inject(ValidatorService);

  constructor() {
    this.guest = createDefaultGuestWithLabels();
    this.registrationList = [];
    this.guestProfileList = [];
  }

  validate(event: Event): void {
    if (event instanceof Event) {
      const clonedMessages = new Map(this.messages);
      const inputValue = (event.target as HTMLInputElement).value?? '';
      const inputId = (event.target as HTMLInputElement).id;

      switch (inputId) {
        case 'registrationSelect':
          this.validatorService.mustBeValidId(inputValue, clonedMessages, 'registration_id');
          break;
        case 'guestProfileSelect':
          this.validatorService.mustBeValidOptionalId(inputValue, clonedMessages, 'guest_profile_id');
          break;
        case 'relationshipType':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'relationship');
          break;
        case 'guestRawName':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'raw_guest_name');
          break;
      }
      this.messages = clonedMessages;
      this.messagesChange.emit(this.messages);
    }
  }

  updateRegistration(registrationId: string): void {
    const selectedRegistration: RegistrationWithLabels | undefined = this.registrationList.find((registration: RegistrationWithLabels) => registration.id === Number.parseInt(registrationId, 10));
    if (selectedRegistration) {
      this.guest.registrationId = selectedRegistration.id;
      this.guest.eventInfoId = selectedRegistration.eventInfoId;
      this.guest.eventName = selectedRegistration.eventName;
      this.guest.eventTitle = selectedRegistration.eventTitle;
      this.guest.inviteeFirstName = selectedRegistration.participantNameFirst;
      this.guest.inviteeLastName = selectedRegistration.participantNameLast;
    }
  }

  updateGuestProfile(guestProfileId: string): void {
    const selectedGuestProfile: Participant | undefined = this.guestProfileList.find((guestProfile: Participant) => guestProfile.id === Number.parseInt(guestProfileId, 10));
    if (selectedGuestProfile) {
      this.guest.guestProfileId = selectedGuestProfile.id;
      this.guest.guestNameFirst = selectedGuestProfile.nameFirst;
      this.guest.guestNameLast = selectedGuestProfile.nameLast;
    }
  }

  submitForm() {
    this.formSubmit.emit();
  }
}
