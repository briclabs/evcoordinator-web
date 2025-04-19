export interface GuestWithLabels {
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
}

export function createDefaultGuestWithLabels(): GuestWithLabels {
  return {
    eventInfoId: 0,
    eventName: '',
    eventTitle: '',
    eventStatus: '',
    rawGuestName: '',
    inviteeFirstName: '',
    inviteeLastName: '',
    relationship: '',
  };
}
