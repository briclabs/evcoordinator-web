import { Component, inject } from '@angular/core';
import { formatDate } from "@angular/common";
import { ContactUtilityServiceService } from "../app-services/contact-utility-service/contact-utility-service.service";
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'registration',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  protected readonly Date: DateConstructor = Date;
  protected readonly formatDate = formatDate;
  contactUtilityServiceService: ContactUtilityServiceService = inject(ContactUtilityServiceService);
}
