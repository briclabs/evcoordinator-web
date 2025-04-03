import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'table-controls',
  standalone: true,
  templateUrl: './table-controls.component.html',
  imports: [
    CommonModule,
    FormsModule,
  ],
  styleUrls: ['./table-controls.component.css'],
})
export class TableControlsComponent {

  @Input() pages: number[] = [];
  @Input() currentPage: number = 1;
  @Output() addRecord = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  searchString: string = '';

  onAddRecord(): void {
    this.addRecord.emit();
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'string') {
      return;
    }
    this.currentPage = page;
    this.pageChange.emit(page);
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  onSearch(): void {
    this.search.emit(this.searchString);
  }

  get visiblePages(): (number | string)[] {
    const maxVisible = 5;
    const total = this.pages.length;
    const current = this.currentPage;

    if (total <= maxVisible) {
      return this.pages;
    }

    const firstPage = 1;
    const lastPage = total;

    const range = (start: number, end: number): number[] => {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    };

    // Case: Current page is near the start.
    if (current <= maxVisible - 2) {
      return [...range(firstPage, maxVisible), '...', lastPage];
    }

    // Case: current page is near the end.
    if (current >= total - (maxVisible - 2)) {
      return [firstPage, '...', ...range(lastPage - (maxVisible - 1), lastPage)];
    }

    // Case: current page is in the middle.
    return [
      firstPage,
      '...',
      ...range(current - 2, current + 2),
      '...',
      lastPage,
    ];
  }

  protected readonly Number = Number;
}
