import { Component } from '@angular/core';
import { formatDate } from "@angular/common";


// TODO - To be sourced from DB.
export enum RelationshipEmergencyContact {
  FRIEND = 'Friend',
  FAMILY = 'Family',
}

// TODO - To be sourced from DB.
export enum StateAbbreviations {
  AL,
  AK,
  AZ,
  AR,
  AS,
  CA,
  CO,
  CT,
  DE,
  DC,
  FL,
  GA,
  GU,
  HI,
  ID,
  IL,
  IN,
  IA,
  KS,
  KY,
  LA,
  ME,
  MD,
  MA,
  MI,
  MN,
  MS,
  MO,
  MT,
  NE,
  NV,
  NH,
  NJ,
  NM,
  NY,
  NC,
  ND,
  MP,
  OH,
  OK,
  OR,
  PA,
  PR,
  RI,
  SC,
  SD,
  TN,
  TX,
  UT,
  VT,
  VA,
  VI,
  WA,
  WV,
  WI,
  WY
}

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  protected readonly Date = Date;
  protected readonly formatDate = formatDate;
  protected readonly relationshipEmergencyContact: {key: string, value: string}[] = Object.keys(RelationshipEmergencyContact).map(key => ({key: key, value: Object(RelationshipEmergencyContact)[key]}));
  protected readonly stateAbbreviation: string[] = Object.keys(StateAbbreviations).filter(option => isNaN(Number(option)));
}
