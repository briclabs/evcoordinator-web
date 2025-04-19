import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ContactUtilityServiceService } from "../../../services/contact-utility-service/contact-utility-service.service";
import { createDefaultParticipant, Participant } from "../../../models/participant";
import { ErrorMessageComponent } from "../../subcomponents/error-message/error-message.component";

@Component({
  selector: 'profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorMessageComponent],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent {
  @Input() participant: Participant;
  @Output() participantChange = new EventEmitter<Participant>();

  @Input() isPreexisting: boolean = false;
  @Input() participantTypeOptions: string[] = [];
  @Input() isParticipantTypeDropdown: boolean = true;
  @Input() isEmailAddressChangeable: boolean = true;

  @Input() messages: Map<string, string> = new Map<string, string>();
  @Input() showSubmitButton: boolean = true;

  @Output() formSubmit = new EventEmitter<void>();

  contactUtilityServiceService: ContactUtilityServiceService = inject(ContactUtilityServiceService);

  constructor() {
    this.participant = createDefaultParticipant();
  }

  submitForm() {
    this.formSubmit.emit();
  }
}
