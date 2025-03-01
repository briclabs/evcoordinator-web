import { Component } from '@angular/core';
import { TableComponent } from "../subcomponents/table/table.component";

@Component({
  selector: 'payments',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
}
