export interface ParticipantAssociation {
  id?: number;
  self?: number;
  rawAssociateName: string;
  associate?: number;
  association: string;
  timeRecorded?: string;
}

export function createDefaultParticipantAssociation(): ParticipantAssociation {
  return {
    association: '',
    rawAssociateName: '',
  };
}
