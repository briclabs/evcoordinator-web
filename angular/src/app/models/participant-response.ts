export interface Participant {
  id: number;
  participantType: string;
  sponsor: string;
  nameFirst: string;
  nameLast: string;
  nameNick: string;
  dob: string;
  addrStreet_1: string;
  addrStreet_2: string | null;
  addrCity: string;
  addrStateAbbr: string;
  addrZip: number;
  addrEmail: string;
  phoneDigits: number;
  timeRecorded: string;
}
