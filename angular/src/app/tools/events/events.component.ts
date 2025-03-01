import { Component } from '@angular/core';
import { TableComponent } from "../subcomponents/table/table.component";

@Component({
  selector: 'events',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
}
