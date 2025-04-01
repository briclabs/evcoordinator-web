export interface Guest {
  id?: number;
  inviteeProfileId?: number;
  registrationId?: number;
  rawGuestName: string;
  guestProfileId?: number;
  relationship: string;
  timeRecorded?: string;
}
