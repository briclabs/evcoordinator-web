import { Component } from '@angular/core';
import { TableComponent } from "../subcomponents/table/table.component";

@Component({
  selector: 'history',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
}
