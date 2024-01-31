import { Component, inject } from '@angular/core';
import {
  ContactUtilityServiceService
} from "../../app-services/contact-utility-service/contact-utility-service.service";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  contactUtilityServiceService: ContactUtilityServiceService = inject(ContactUtilityServiceService);
}
