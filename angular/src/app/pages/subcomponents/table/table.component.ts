import { AfterViewInit, Component, EventEmitter, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { TableControlsComponent } from "../table-controls/table-controls.component";
import { CommonModule } from "@angular/common";
import { TitleCasePipe } from "../../../pipes/title-case/title-case.pipe";
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
export class TableComponent implements AfterViewInit {
  @ViewChild('tableHeader', { static: true }) tableHeader!: ElementRef;

  @Input() columns: string[] = [];
  @Input() rows: { [key: string]: any }[] = [];
  @Input() pages: number[] = [];
  @Input() currentPage: number = 1;
  @Input() excludedColumns: string[] = [
    'id',
    'sponsor',
    'timeRecorded',
    'participantId',
    'eventInfoId',
    'registrationId',
    'guestProfileId',
    'inviteeProfileId',
    'actorId',
    'recipientId'
  ];

  @Output() rowClick = new EventEmitter<{ [key: string]: any }>();
  @Output() addRecord = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() columnSort = new EventEmitter<{ column: string, sortAsc: boolean }>();
  @Output() search = new EventEmitter<string>();

  currentSortColumn?: string;
  sortAsc?: boolean;

  ngAfterViewInit() {
    const tableHeaderHeight = this.tableHeader.nativeElement.offsetTop;
    this.setStickyTheadTop(tableHeaderHeight);
  }

  setStickyTheadTop(offset: number): void {
    const theadElement = document.querySelector('thead.sticky-top') as HTMLElement;
    if (theadElement) {
      theadElement.style.top = `${offset}px`;
    }
  }

  get filteredColumns(): string[] {
    return this.columns.filter(column => !this.excludedColumns.includes(column));
  }

  isJson(value: any): boolean {
    if (typeof value === 'object' && value !== null) {
      return true;
    }

    if (typeof value === 'string') {
      try {
        return !!JSON.parse(value);
      } catch {
        return false;
      }
    }

    return false;
  }

  formatJson(value: any): string {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return typeof parsed === 'object' && parsed !== null ? JSON.stringify(parsed, null, 2) : value;
    } catch {
      return value;
    }
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
