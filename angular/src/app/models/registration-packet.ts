import { Participant } from "./participant";
import { ParticipantAssociation } from "./participant-association";
import { Registration } from "./registration";

export interface RegistrationPacket {
  participant: Participant;
  associations?: ParticipantAssociation[];
  registration: Registration;
}
