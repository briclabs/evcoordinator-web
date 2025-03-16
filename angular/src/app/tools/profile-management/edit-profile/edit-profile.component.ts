import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Participant } from '../../../models/participant-response';
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { ProfileFormComponent } from "../../../profile-form/profile-form.component";

@Component({
  selector: 'edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileFormComponent,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  isSelf: boolean = false;

  id: number | null = null;
  participantType: string | null = null;
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
  addrEmailFromAuthenticationService: string | null = null;
  phoneDigits: number | null = null;

  participantTypeOptions: string[] = ["VENDOR", "VENUE", "ATTENDEE"]; // TODO - source from DB.

  private apiUrl = '';
  private authenticationService = inject(OidcSecurityService);

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.apiUrl = environment.apiUrl + '/participant';
    const currentUrl = this.route.snapshot.url.map(segment => segment.path).join('/');

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.authenticationService.getUserData().subscribe((userData: any) => {
        if (id) {
          this.fetchProfileById(parseInt(id, 10));
        } else if (currentUrl === 'tools/my-profile' && userData && userData.email) {
          this.fetchProfileByEmailAddress(userData.email);
          this.isSelf = this.addrEmail === userData.email || this.addrEmail === null;
          this.addrEmailFromAuthenticationService = this.isSelf ? userData.email : null;
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

  fetchProfileByEmailAddress(email: string): void {
    try {
      let searchRequest = {
        searchConfiguration: {
          exactMatch: true,
          sortColumn: 'id',
          sortAsc: true,
          offset: 0,
          max: 1,
        },
        searchCriteria: {
          addr_email: email,
        }
      };
      this.http.post<{ list: Participant[], count: number }>(`${this.apiUrl}/search`, searchRequest).subscribe({
        next: (data) => {
          if (!data || !data.list || data.list.length === 0 || !(data.count > 0)) {
            return;
          }
          const participant = data.list[0];
          this.id = participant.id;
          this.participantType = participant.participantType;
          this.sponsor = participant.sponsor;
          this.nameFirst = participant.nameFirst;
          this.nameLast = participant.nameLast;
          this.nameNick = participant.nameNick;
          this.dob = participant.dob;
          this.addrStreet_1 = participant.addrStreet_1;
          this.addrStreet_2 = participant.addrStreet_2 ?? '';
          this.addrCity = participant.addrCity;
          this.addrStateAbbr = participant.addrStateAbbr;
          this.addrZip = participant.addrZip;
          this.addrEmail = participant.addrEmail;
          this.phoneDigits = participant.phoneDigits;
        }
      });
    } catch (error) {
      console.error('Error fetching my profile:', error);
      throw error;
    }
  }

  create() {
    this.http.post(this.apiUrl, {
      participantType: this.authenticationService.isAuthenticated() && !this.isSelf ? this.participantType : 'ATTENDEE',
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
      addrEmail: this.authenticationService.isAuthenticated() && this.isSelf ? this.addrEmailFromAuthenticationService : this.addrEmail,
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
      participantType: this.authenticationService.isAuthenticated() && !this.isSelf ? this.participantType : 'ATTENDEE',
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
