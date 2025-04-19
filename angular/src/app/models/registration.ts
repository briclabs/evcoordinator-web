import { RegistrationWithLabels } from "./registration-with-labels";

export interface Registration {
  id?: number;
  participantId?: number;
  eventInfoId: number;
  donationPledge: number;
  signature: string;
  timeRecorded?: string;
}

export function createRegistrationFromRegistrationWithLabels(registrationWithLabels: RegistrationWithLabels): Registration {
  return {
    id: registrationWithLabels.id,
    participantId: registrationWithLabels.participantId,
    eventInfoId: registrationWithLabels.eventInfoId,
    donationPledge: registrationWithLabels.donationPledge,
    signature: registrationWithLabels.signature,
    timeRecorded: registrationWithLabels.timeRecorded,
  };
}
