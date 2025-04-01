export interface Registration {
  id?: number;
  participantId?: number;
  eventInfoId: number;
  donationPledge: number;
  signature: string;
  timeRecorded?: string;
}
