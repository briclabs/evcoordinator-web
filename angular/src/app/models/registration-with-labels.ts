export interface RegistrationWithLabels {
  id?: number;
  participantId?: number;
  eventInfoId: number;
  donationPledge: number;
  signature: string;
  participantNameFirst: string;
  participantNameLast: string;
  eventName: string;
  eventTitle: string;
  timeRecorded?: string;
}

export function createDefaultRegistrationWithLabels(): RegistrationWithLabels {
  return {
    eventInfoId: 0,
    donationPledge: 0,
    signature: '',
    participantNameFirst: '',
    participantNameLast: '',
    eventName: '',
    eventTitle: '',
  };
}
