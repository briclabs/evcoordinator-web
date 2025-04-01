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
  nameEmergency: string;
  phoneEmergency: number;
  emergencyContactRelationshipType: string;
  timeRecorded: string;
}

export function createDefaultParticipant(): Participant {
  return {
    id: 0,
    participantType: '',
    sponsor: '',
    nameFirst: '',
    nameLast: '',
    nameNick: '',
    dob: '',
    addrStreet_1: '',
    addrStreet_2: null,
    addrCity: '',
    addrStateAbbr: '',
    addrZip: 0,
    addrEmail: '',
    phoneDigits: 0,
    nameEmergency: '',
    phoneEmergency: 0,
    emergencyContactRelationshipType: '',
    timeRecorded: '',
  };
}
