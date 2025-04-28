export interface GuestWithLabelsAndMessages {
  id?: number;
  registrationId?: number;
  eventInfoId: number;
  eventName: string;
  eventTitle: string;
  eventStatus: string;
  rawGuestName: string;
  guestProfileId?: number;
  guestNameFirst?: string;
  guestNameLast?: string;
  inviteeFirstName: string;
  inviteeLastName: string;
  relationship: string;
  timeRecorded?: string;
  messages: Map<string, string>;
}

export function createDefaultGuestWithLabelsAndMessages(): GuestWithLabelsAndMessages {
  return {
    eventInfoId: 0,
    eventName: '',
    eventTitle: '',
    eventStatus: '',
    rawGuestName: '',
    inviteeFirstName: '',
    inviteeLastName: '',
    relationship: '',
    messages: new Map<string, string>(),
  };
}
