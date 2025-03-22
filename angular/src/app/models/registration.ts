export interface Registration {
  id?: number;
  participantId?: number;
  eventInfoId: number;
  donationPledge: number;
  signature: string;
  timeRecorded?: string;
}

export function createDefaultRegistration(): Registration {
  return {
    eventInfoId: 0,
    donationPledge: 0,
    signature: '',
  };
}
