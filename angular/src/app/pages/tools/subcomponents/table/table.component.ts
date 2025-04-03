import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableControlsComponent } from "../table-controls/table-controls.component";
import { CommonModule } from "@angular/common";
import { TitleCasePipe } from "../../../../pipes/title-case/title-case.pipe";
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    TableControlsComponent,
    CommonModule,
    TitleCasePipe,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() columns: string[] = [];
  @Input() rows: { [key: string]: any }[] = [];
  @Input() pages: number[] = [];
  @Input() currentPage: number = 1;
  @Output() rowClick = new EventEmitter<{ [key: string]: any }>();
  @Output() addRecord = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() columnSort = new EventEmitter<{ column: string, sortAsc: boolean }>();
  @Output() search = new EventEmitter<string>();

  currentSortColumn?: string;
  sortAsc?: boolean;

  get filteredColumns(): string[] {
    return this.columns.filter(column =>
      column !== 'id' &&
      column !== 'sponsor' &&
      column !== 'timeRecorded' &&
      column !== 'participantId' &&
      column !== 'eventInfoId' &&
      column !== 'registrationId' &&
      column !== 'guestProfileId' &&
      column !== 'inviteeProfileId' &&
      column !== 'actorId' &&
      column !== 'recipientId'
    );
  }

  onTableRowClick(row: { [key: string]: any }): void {
    this.rowClick.emit(row);
  }

  onAddRecord(): void {
    this.addRecord.emit();
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onSearch(searchString: string): void {
    this.search.emit(searchString);
  }

  onColumnHeaderClick(column: string): void {
    if (this.currentSortColumn === column) {
      if (this.sortAsc) {
        this.sortAsc = false;
      } else if (!this.sortAsc) {
        this.currentSortColumn = undefined; // Reset column sorting
        this.sortAsc = undefined;
        this.columnSort.emit({column: 'ID', sortAsc: true}); // Apply default sorting
        return;
      }
    } else {
      // If a new column is clicked, start sorting by descending (default behavior)
      this.currentSortColumn = column;
      this.sortAsc = true;
    }

    this.columnSort.emit({ column: this.currentSortColumn, sortAsc: this.sortAsc });
  }

  getSortDirection(column: string): 'asc' | 'desc' | null {
    if (this.currentSortColumn === column) {
      return this.sortAsc ? 'asc' : 'desc';
    }
    return null;
  }
}
