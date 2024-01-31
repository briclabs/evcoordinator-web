import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactUtilityServiceService {

  private readonly relationshipEmergencyContact: {key: string, value: string}[];
  private readonly stateAbbreviation: string[];

  constructor() {

    // TODO - To be sourced from DB.
    enum RelationshipEmergencyContact {
      FRIEND = 'Friend',
      FAMILY = 'Family',
    }

    this.relationshipEmergencyContact = Object.keys(RelationshipEmergencyContact).map(key => ({key: key, value: Object(RelationshipEmergencyContact)[key]}));

    // TODO - To be sourced from DB.
    enum StateAbbreviations {
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

    this.stateAbbreviation = Object.keys(StateAbbreviations).filter(option => isNaN(Number(option)));
  }

  getRelationshipEmergencyContact(): { key: string; value: string }[] {
    return this.relationshipEmergencyContact;
  }

  getStateAbbreviations(): string[] {
    return this.stateAbbreviation;
  }
}
