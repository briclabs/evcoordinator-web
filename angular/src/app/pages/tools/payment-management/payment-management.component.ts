import { Component } from '@angular/core';
import { TableComponent } from "../subcomponents/table/table.component";

@Component({
  selector: 'payments',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css'],
})
export class PaymentManagementComponent {
}
