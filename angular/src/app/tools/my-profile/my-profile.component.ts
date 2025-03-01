import { Component, inject } from '@angular/core';
import {
  ContactUtilityServiceService
} from "../../app-services/contact-utility-service/contact-utility-service.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  contactUtilityServiceService: ContactUtilityServiceService = inject(ContactUtilityServiceService);
}
