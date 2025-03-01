import { Component } from '@angular/core';
import { TableComponent } from "../subcomponents/table/table.component";

@Component({
  selector: 'participants',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css'],
})
export class ParticipantsComponent {
}
