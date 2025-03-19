import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-participant-association',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
  ],
  templateUrl: './participant-association.component.html',
  styleUrl: './participant-association.component.css'
})
export class ParticipantAssociationComponent {
  @Input() associationType: string | null = null;
  @Output() associationTypeChange = new EventEmitter<string | null>();

  @Input() associationName: string | null = null;
  @Output() associationNameChange = new EventEmitter<string | null>();

  participantAssociationTypeOptions: string[] = ["INVITEE", "CHILD", "PET"]; // TODO - source from DB.
}
