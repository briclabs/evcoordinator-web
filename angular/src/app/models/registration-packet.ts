import { Participant } from "./participant";
import { Registration } from "./registration";
import { Guest } from "./guest";

export interface RegistrationPacket {
  participant: Participant;
  guests?: Guest[];
  registration: Registration;
}
