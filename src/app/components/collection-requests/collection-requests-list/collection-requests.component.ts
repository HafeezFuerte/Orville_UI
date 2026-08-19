import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  COLLECTION_REQUEST_ROWS,
  COLLECTION_STATUS_TABS,
  CollectionRequestRow,
  CollectionRequestStatus
} from '../collection-requests.data';

@Component({
  selector: 'app-collection-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './collection-requests.component.html'
})
export class CollectionRequestsComponent {
  searchQuery = '';
  statusFilter: 'All' | CollectionRequestStatus = 'All';
  statusTabs = COLLECTION_STATUS_TABS;
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterCollector = '';
  filterStatus: CollectionRequestStatus | null = null;
  statusOptions: CollectionRequestStatus[] = ['Pending', 'Received', 'Processed', 'Rejected'];
  pageIndex = 0;
  pageSize = 10;
  allRows = COLLECTION_REQUEST_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'collector', label: 'Collector', visible: true },
    { key: 'invoiceId', label: 'Invoice Id', visible: true, useTemplate: true },
    { key: 'amount', label: 'Amount', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' },
    { key: 'createdAt', label: 'Created At', visible: true }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): CollectionRequestRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterCollector && !row.collector.toLowerCase().includes(this.filterCollector.toLowerCase())) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.toLowerCase().includes(q) ||
        row.collector.toLowerCase().includes(q) ||
        row.invoiceId.toLowerCase().includes(q) ||
        row.amount.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): CollectionRequestRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageIndex * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalRecords);
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  setStatusFilter(status: 'All' | CollectionRequestStatus): void {
    this.statusFilter = status;
    this.pageIndex = 0;
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterCollector = '';
    this.filterStatus = null;
    this.pageIndex = 0;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => (col.visible = checked));
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex++;
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages) {
      this.pageIndex = target;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
