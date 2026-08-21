import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { QUOTATION_ROWS, QuotationRow, QuotationStatus } from '../quotations.data';

type StatusTab = 'All' | QuotationStatus;

@Component({
  selector: 'app-quotations-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './quotations-list.component.html',
  styleUrl: './quotations-list.component.scss'
})
export class QuotationsListComponent {
  private router = inject(Router);

  searchQuery = '';
  statusFilter: StatusTab = 'All';
  statusTabs: StatusTab[] = ['All', 'Pending', 'Approved', 'Rejected', 'Expired'];
  isDrawerOpen = false;
  showColumnDropdown = false;
  pageIndex = 0;
  pageSize = 10;
  allRows = QUOTATION_ROWS;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  filterTitle = '';
  filterStatus: QuotationStatus | null = null;
  filterVendor = '';

  tableColumns = [
    { key: 'id', label: 'Quotation ID', visible: true, useTemplate: true, width: '120px' },
    { key: 'workOrderId', label: 'Work Order ID', visible: true, useTemplate: true, width: '130px' },
    { key: 'title', label: 'Quotation Title', visible: true, useTemplate: true, width: '220px' },
    { key: 'number', label: 'Quotation Number', visible: true, width: '150px' },
    { key: 'vendor', label: 'Vendor', visible: true, useTemplate: true, width: '200px' },
    { key: 'category', label: 'Quotation Category Name', visible: true, width: '180px' },
    { key: 'status', label: 'Quotation Status', visible: true, useTemplate: true, width: '140px' },
    { key: 'amount', label: 'Quotation Amount', visible: true, width: '140px' },
    { key: 'date', label: 'Quotation Date', visible: true, width: '130px' },
    { key: 'validity', label: 'Quotation Validity', visible: true, width: '140px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((c) => c.visible !== false);
  }

  get filteredRows(): QuotationRow[] {
    let rows = [...this.allRows];
    if (this.statusFilter !== 'All') {
      rows = rows.filter((r) => r.status === this.statusFilter);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.number.toLowerCase().includes(q) ||
          r.vendor.toLowerCase().includes(q) ||
          r.workOrderId.toLowerCase().includes(q)
      );
    }
    if (this.filterTitle.trim()) {
      const t = this.filterTitle.trim().toLowerCase();
      rows = rows.filter((r) => r.title.toLowerCase().includes(t));
    }
    if (this.filterStatus) {
      rows = rows.filter((r) => r.status === this.filterStatus);
    }
    if (this.filterVendor.trim()) {
      const v = this.filterVendor.trim().toLowerCase();
      rows = rows.filter((r) => r.vendor.toLowerCase().includes(v));
    }
    return rows;
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
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

  get paginatedRows(): QuotationRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  setStatusFilter(tab: StatusTab): void {
    this.statusFilter = tab;
    this.pageIndex = 0;
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex += 1;
    }
  }

  goPage(page: number): void {
    this.pageIndex = Math.max(0, Math.min(page - 1, this.totalPages - 1));
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col && key !== 'action') {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(visible: boolean): void {
    this.tableColumns.forEach((col) => {
      if (col.key !== 'action') {
        col.visible = visible;
      }
    });
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.filterTitle = '';
    this.filterStatus = null;
    this.filterVendor = '';
    this.pageIndex = 0;
  }

  statusClass(status: QuotationStatus): string {
    switch (status) {
      case 'Pending':
        return 'qt-chip qt-chip--warning';
      case 'Approved':
        return 'qt-chip qt-chip--success';
      case 'Rejected':
        return 'qt-chip qt-chip--danger';
      case 'Expired':
        return 'qt-chip qt-chip--soft';
      default:
        return 'qt-chip qt-chip--soft';
    }
  }

  toggleRowAction(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openRowActionId === id) {
      this.closeRowAction();
      return;
    }
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.rowMenuStyle = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${Math.max(8, rect.right - 160)}px`,
      zIndex: '1200'
    };
    this.openRowActionId = id;
  }

  closeRowAction(): void {
    this.openRowActionId = null;
    this.rowMenuStyle = null;
  }

  navigateToDetail(id: string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/quotations', id]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/facility/quotations/create']);
  }

  navigateToRequest(): void {
    this.router.navigate(['/facility/quotations/request']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-qt-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-qt-columns]')) {
      this.showColumnDropdown = false;
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.openRowActionId) {
      this.closeRowAction();
    }
  }
}
