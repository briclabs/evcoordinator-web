import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StaticLookupService {

  private apiUrl = `${environment.apiUrl}/staticLookups`;

  constructor(private http: HttpClient) {}

  emergencyContactRelationshipType(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/emergencyContactRelationshipType`);
  }

  eventStatus(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/eventStatus`);
  }

  guestRelationshipType(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/guestRelationshipType`);
  }

  usStateAbbreviations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/usStateAbbreviations`);
  }

  participantType(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/participantType`);
  }

  transactionInstrument(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/transactionInstrument`);
  }

  transactionType(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/transactionType`);
  }
}
