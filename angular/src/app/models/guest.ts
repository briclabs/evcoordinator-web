export interface Guest {
  id?: number;
  registrationId?: number;
  rawGuestName: string;
  guestProfileId?: number;
  relationship: string;
  timeRecorded?: string;
}

export function createFromGuestWithLabels(guestWithLabels: any): Guest {
  return {
    id: guestWithLabels.id,
    registrationId: guestWithLabels.registrationId,
    rawGuestName: guestWithLabels.rawGuestName,
    guestProfileId: guestWithLabels.guestProfileId,
    relationship: guestWithLabels.relationship,
    timeRecorded: guestWithLabels.timeRecorded,
  };
}
