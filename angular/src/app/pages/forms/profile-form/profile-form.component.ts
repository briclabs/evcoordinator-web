import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { createDefaultParticipant, Participant } from "../../../models/participant";
import { ErrorMessageComponent } from "../../subcomponents/error-message/error-message.component";
import { ValidatorService } from "../../../services/validator/validator.service";
import { StaticLookupService } from "../../../services/static-lookup/static-lookup.service";

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
  @Output() messagesChange = new EventEmitter<Map<string, string>>();

  @Input() showSubmitButton: boolean = true;

  @Output() formSubmit = new EventEmitter<void>();

  private staticLookupService: StaticLookupService = inject(StaticLookupService);
  stateAbbreviations: string[] = [];
  emergencyContactRelationshipType: string[] = [];

  validatorService: ValidatorService = inject(ValidatorService);

  constructor() {
    this.participant = createDefaultParticipant();

    this.staticLookupService.usStateAbbreviations().subscribe({
      next: (data: string[]) => {
        this.stateAbbreviations = data;
      },
      error: (error: any) => {
        console.error('Error fetching state abbreviations:', error);
      }
    });

    this.staticLookupService.emergencyContactRelationshipType().subscribe({
      next: (data: string[]) => {
        this.emergencyContactRelationshipType = data;
      },
      error: (error: any) => {
        console.error('Error fetching emergency contact relationship types:', error);
      }
    });
  }

  validate(event: Event): void {
    if (event instanceof Event) {
      const clonedMessages = new Map(this.messages);
      const inputValue = (event.target as HTMLInputElement).value?? '';
      const inputId = (event.target as HTMLInputElement).id;

      switch (inputId) {
        case 'nameFirst':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'name_first');
          break;
        case 'nameLast':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'name_last');
          break;
        case 'addrEmail':
          this.validatorService.mustBeValidEmail(inputValue, clonedMessages, 'addr_email');
          break;
        case 'nameNick':
          this.validatorService.mustBeEmptyOrNotBeBlank(inputValue, clonedMessages, 'name_nick');
          break;
        case 'dateBirth':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'dob');
          this.validatorService.mustBePast(inputValue, clonedMessages, 'dob');
          break;
        case 'nameSponsor':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'sponsor');
          break;
        case 'addressStreet1':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'addr_street_1');
          break;
        case 'addressStreet2':
          this.validatorService.mustBeEmptyOrNotBeBlank(inputValue, clonedMessages, 'addr_street_2');
          break;
        case 'addressCity':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'addr_city');
          break;
        case 'addressState':
          this.validatorService.mustBeValidUsState(inputValue.split(':')[1], clonedMessages, 'addr_state_abbr');
          break;
        case 'addressZipcode':
          this.validatorService.mustBeValidZipcode(inputValue, clonedMessages, 'addr_zip');
          break;
        case 'phoneNumber':
          this.validatorService.mustBeValidPhone(inputValue, clonedMessages, 'phone_digits');
          break;
        case 'nameEmergency':
          this.validatorService.mustNotBeBlank(inputValue, clonedMessages, 'name_emergency');
          break;
        case 'phoneEmergency':
          this.validatorService.mustBeValidPhone(inputValue, clonedMessages, 'phone_emergency');
          break;
        case 'relationshipEmergency':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'emergency_contact_relationship_type');
          break;
        case 'participantType':
          this.validatorService.mustBeValidValue(inputValue, clonedMessages, 'participant_type');
          break;
      }
      this.messages = clonedMessages;
      this.messagesChange.emit(this.messages);
    }
  }

  submitForm() {
    this.formSubmit.emit();
  }
}
