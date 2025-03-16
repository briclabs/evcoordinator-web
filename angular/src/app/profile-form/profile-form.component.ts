import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ContactUtilityServiceService } from "../app-services/contact-utility-service/contact-utility-service.service";

@Component({
  selector: 'profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent {

  @Input() nameFirst: string | null = null;
  @Output() nameFirstChange = new EventEmitter<string | null>();

  @Input() nameLast: string | null = null;
  @Output() nameLastChange = new EventEmitter<string | null>();

  @Input() nameNick: string | null = null;
  @Output() nameNickChange = new EventEmitter<string | null>();

  @Input() dob: string | null = null;
  @Output() dobChange = new EventEmitter<string | null>();

  @Input() addrStreet_1: string | null = null;
  @Output() addrStreet_1Change = new EventEmitter<string | null>();

  @Input() addrStreet_2: string | null = null;
  @Output() addrStreet_2Change = new EventEmitter<string | null>();

  @Input() addrCity: string | null = null;
  @Output() addrCityChange = new EventEmitter<string | null>();

  @Input() addrStateAbbr: string | null = null;
  @Output() addrStateAbbrChange = new EventEmitter<string | null>();

  @Input() addrZip: number | null = null;
  @Output() addrZipChange = new EventEmitter<number | null>();

  @Input() addrEmail: string | null = null;
  @Output() addrEmailChange = new EventEmitter<string | null>();

  @Input() phoneDigits: number | null = null;
  @Output() phoneDigitsChange = new EventEmitter<number | null>();

  @Input() sponsor: string | null = null;
  @Output() sponsorChange = new EventEmitter<string | null>();

  @Input() participantType: string | null = null;
  @Output() participantTypeChange = new EventEmitter<string | null>();

  @Input() participantTypeOptions: string[] = [];
  @Input() isParticipantTypeDropdown: boolean = true;
  @Input() isEmailAddressChangeable: boolean = true;

  @Input() showSubmitButton: boolean = true;

  @Output() formSubmit = new EventEmitter<void>();

  contactUtilityServiceService: ContactUtilityServiceService = inject(ContactUtilityServiceService);

  submitForm() {
    this.formSubmit.emit();
  }
}
