import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { TableComponent } from "../subcomponents/table/table.component";

@Component({
  selector: 'profile-management',
  standalone: true,
  imports: [
    FormsModule,
    TableComponent,
  ],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.css']
})
export class ProfileManagementComponent {

}
