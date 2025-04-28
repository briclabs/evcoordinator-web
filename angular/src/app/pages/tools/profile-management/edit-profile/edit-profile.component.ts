import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { createDefaultParticipant, Participant } from '../../../../models/participant';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { ProfileFormComponent } from "../../../forms/profile-form/profile-form.component";
import { Observable, of } from "rxjs";
import { CreateResponse } from "../../../../models/create-response";
import { UpdateResponse } from "../../../../models/update-response";
import { ErrorMessageComponent } from "../../../subcomponents/error-message/error-message.component";

@Component({
  selector: 'edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileFormComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  protected messages: Map<string, string> = new Map<string, string>();

  isSelf: boolean = false;
  addrEmailFromAuthenticationService: string;

  protected participant: Participant;

  participantTypeOptions: string[] = ["VENDOR", "VENUE", "ATTENDEE"]; // TODO - source from DB.

  private apiUrl = '';
  private authenticationService = inject(OidcSecurityService);

  protected isPreexisting: boolean = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.participant = createDefaultParticipant();
    this.addrEmailFromAuthenticationService = '';
  }

  async ngOnInit() {
    this.apiUrl = environment.apiUrl + '/participant';
    const currentUrl = this.route.snapshot.url.map(segment => segment.path).join('/');

    this.route.paramMap.subscribe(params => {
      const id: string | null = params.get('id');
      this.authenticationService.getUserData().subscribe((userData: any) => {
        if (id) {
          this.fetchProfileById(parseInt(id, 10));
        } else if (currentUrl === 'tools/my-profile' && userData && userData.email) {
          this.fetchProfileByEmailAddress(userData.email);
          this.isSelf = this.participant.addrEmail === userData.email || this.participant.addrEmail === '';
          this.addrEmailFromAuthenticationService = this.isSelf ? userData.email : '';

          this.participant.participantType = this.authenticationService.isAuthenticated() && !this.isSelf ? this.participant.participantType : 'ATTENDEE';
          this.participant.addrEmail = this.authenticationService.isAuthenticated() && this.isSelf ? this.addrEmailFromAuthenticationService : this.participant.addrEmail;
        }
      });
    });
  }

  fetchProfileById(id: number): void {
    this.http.get<Participant>(`${this.apiUrl}/${id}`).subscribe({
      next: (data: Participant) => {
        if (data) {
          this.participant = data;
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
        next: (data: { list: Participant[]; count: number }) => {
          if (!data || !data.list || data.list.length === 0 || !(data.count > 0)) {
            return;
          }
          this.participant = data.list[0];
        }
      });
    } catch (error) {
      console.error('Error fetching my profile:', error);
      throw error;
    }
  }

  preexists(): Observable<boolean> {
    return of(this.isPreexisting = false);
  }

  checkPreexistingProfile(): void {
    if (this.participant.nameFirst && this.participant.nameLast && this.participant.addrEmail) {
      this.preexists().subscribe((exists: boolean) => {
        this.isPreexisting = exists;
      });
    }
  }

  create() {
    this.http.post<CreateResponse>(this.apiUrl, this.participant).subscribe({
      next: (response: CreateResponse) => {
        this.router.navigate([`/tools/edit-profile/${response.insertedId}`]);
      },
      error: (error) => {
        this.messages = CreateResponse.getMessagesFromObject(error.error);
      },
    })
  }

  update() {
    this.http.put(this.apiUrl, this.participant).subscribe({
      next: () => {
      },
      error: (error) => {
        this.messages = UpdateResponse.getMessagesFromObject(error.error);
      },
    })
  }
}
