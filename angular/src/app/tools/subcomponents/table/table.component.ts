import { Component } from '@angular/core';
import { TableControlsComponent } from "../table-controls/table-controls.component";
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    TableControlsComponent,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

}
