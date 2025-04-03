import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { createDefaultGuestWithLabels, GuestWithLabels } from "../../../models/guest-with-labels";
import { Participant } from "../../../models/participant";
import { RegistrationWithLabels } from "../../../models/registration-with-labels";

@Component({
  selector: 'guest-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    NgIf,
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

  @Input() showSubmitButton: boolean = false;

  @Output() formSubmit = new EventEmitter<void>();

  constructor() {
    this.guest = createDefaultGuestWithLabels();
    this.registrationList = [];
    this.guestProfileList = [];
  }

  updateRegistration(registrationId: string): void {
    const selectedRegistration: RegistrationWithLabels | undefined = this.registrationList.find((registration: RegistrationWithLabels) => registration.id === Number.parseInt(registrationId, 10));
    if (selectedRegistration) {
      this.guest.registrationId = selectedRegistration.id;
      this.guest.eventInfoId = selectedRegistration.eventInfoId;
      this.guest.eventName = selectedRegistration.eventName;
      this.guest.eventTitle = selectedRegistration.eventTitle;
      this.guest.inviteeProfileId = selectedRegistration.participantId;
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
