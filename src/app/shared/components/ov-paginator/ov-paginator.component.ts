import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ov-paginator',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './ov-paginator.component.html'
})
export class OvPaginatorComponent {
  @Input() totalRecords = 0;
  @Input() pageSize = 50;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  @Input() showPageSize = true;
  @Output() pageChange = new EventEmitter<PageEvent>();

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil((this.totalRecords || 0) / (this.pageSize || 1)));
  }

  get startRecord(): number {
    if (!this.totalRecords) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = (this.pageIndex + 1) * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    const current = this.displayPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.emit(this.pageIndex - 1, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.emit(this.pageIndex + 1, this.pageSize);
    }
  }

  goToPage(page: number): void {
    const nextIndex = page - 1;
    if (nextIndex === this.pageIndex || nextIndex < 0 || nextIndex >= this.totalPages) {
      return;
    }
    this.emit(nextIndex, this.pageSize);
  }

  onPageSizeChange(size: number): void {
    const next = Number(size);
    if (next === this.pageSize) {
      return;
    }
    this.emit(0, next);
  }

  private emit(pageIndex: number, pageSize: number): void {
    this.pageChange.emit({
      pageIndex,
      previousPageIndex: this.pageIndex,
      pageSize,
      length: this.totalRecords
    });
  }
}
