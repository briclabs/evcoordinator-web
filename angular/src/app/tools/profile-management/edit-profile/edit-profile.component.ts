import { Component, inject, OnInit } from '@angular/core';
import {
  ContactUtilityServiceService
} from "../../../app-services/contact-utility-service/contact-utility-service.service";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Participant } from '../../../models/participant-response';
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  contactUtilityServiceService: ContactUtilityServiceService = inject(ContactUtilityServiceService);

  id: number | null = null;
  participantType: string | null = null;
  profileType: string[] = ["VENDOR", "VENUE", "ATTENDEE"];
  sponsor: string | null = null;
  nameFirst: string | null = null;
  nameLast: string | null = null;
  nameNick: string | null = null;
  dob: string | null = null;
  addrStreet_1: string | null = null;
  addrStreet_2: string | null = null;
  addrCity: string | null = null;
  addrStateAbbr: string | null = null;
  addrZip: number | null = null;
  addrEmail: string | null = null;
  phoneDigits: number | null = null;

  private apiUrl = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.apiUrl = environment.apiUrl + '/participant';

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProfileById(parseInt(id, 10));
      } else {
        this.id = null;
        this.participantType = null;
        this.sponsor = null;
        this.nameFirst = null;
        this.nameLast = null;
        this.nameNick = null;
        this.dob = null;
        this.addrStreet_1 = null;
        this.addrStreet_2 = null;
        this.addrCity = null;
        this.addrStateAbbr = null;
        this.addrZip = null;
        this.addrEmail = null;
        this.phoneDigits = null;
      }
    });
  }

  fetchProfileById(id: number): void {
    this.http.get<Participant>(`${this.apiUrl}/${id}`).subscribe({
      next: (data: Participant) => {
        if (data) {
          this.id = data.id;
          this.participantType = data.participantType;
          this.sponsor = data.sponsor;
          this.nameFirst = data.nameFirst;
          this.nameLast = data.nameLast;
          this.nameNick = data.nameNick;
          this.dob = data.dob;
          this.addrStreet_1 = data.addrStreet_1;
          this.addrStreet_2 = data.addrStreet_2;
          this.addrCity = data.addrCity;
          this.addrStateAbbr = data.addrStateAbbr;
          this.addrZip = data.addrZip;
          this.addrEmail = data.addrEmail;
          this.phoneDigits = data.phoneDigits;
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  create() {
    this.http.post(this.apiUrl, {
      id: this.id,
      participantType: this.participantType,
      sponsor: this.sponsor,
      nameFirst: this.nameFirst,
      nameLast: this.nameLast,
      nameNick: this.nameNick,
      dob: this.dob,
      addrStreet_1: this.addrStreet_1,
      addrStreet_2: this.addrStreet_2,
      addrCity: this.addrCity,
      addrStateAbbr: this.addrStateAbbr,
      addrZip: this.addrZip,
      addrEmail: this.addrEmail,
      phoneDigits: this.phoneDigits,
    }).subscribe({
      next: (response) => {
        console.log('Profile created successfully:', response);
      },
      error: (error) => {
        console.log('Error creating profile:', error);
      },
    })
  }

  update() {
    this.http.put(this.apiUrl, {
      id: this.id,
      participantType: this.participantType,
      sponsor: this.sponsor,
      nameFirst: this.nameFirst,
      nameLast: this.nameLast,
      nameNick: this.nameNick,
      dob: this.dob,
      addrStreet_1: this.addrStreet_1,
      addrStreet_2: this.addrStreet_2,
      addrCity: this.addrCity,
      addrStateAbbr: this.addrStateAbbr,
      addrZip: this.addrZip,
      addrEmail: this.addrEmail,
      phoneDigits: this.phoneDigits,
    }).subscribe({
      next: (response) => {
        console.log('Profile saved successfully:', response);
      },
      error: (error) => {
        console.log('Error saving profile:', error);
      },
    })
  }
}
