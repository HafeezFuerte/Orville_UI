import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  PURCHASE_ORDER_ROWS,
  PurchaseOrderRow
} from '../purchase-orders.data';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.scss'
})
export class PurchaseOrderListComponent {
  private router = inject(Router);

  searchQuery = '';
  showColumnDropdown = false;
  pageIndex = 0;
  pageSize = 10;
  allRows = PURCHASE_ORDER_ROWS;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '80px' },
    { key: 'poNumber', label: 'PO Number', visible: true, width: '110px' },
    { key: 'title', label: 'Title', visible: true, useTemplate: true, width: '200px' },
    { key: 'status', label: 'Status', visible: true, useTemplate: true, width: '100px' },
    { key: 'category', label: 'Category', visible: true, width: '110px' },
    { key: 'totalAmount', label: 'Total Amount', visible: true, useTemplate: true, width: '130px' },
    { key: 'poDate', label: 'PO Date', visible: true, width: '110px' },
    { key: 'dueDate', label: 'Due Date', visible: true, width: '110px' },
    { key: 'vendor', label: 'Vendor', visible: true, useTemplate: true, width: '160px' },
    { key: 'property', label: 'Property', visible: true, width: '160px' },
    { key: 'unit', label: 'Unit', visible: true, width: '140px' },
    { key: 'workOrder', label: 'Work Order', visible: true, width: '110px' },
    { key: 'invoice', label: 'Invoice', visible: true, width: '90px' },
    { key: 'addedBy', label: 'Added By', visible: true, width: '120px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((c) => c.visible !== false);
  }

  get filteredRows(): PurchaseOrderRow[] {
    let rows = [...this.allRows];
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.poNumber.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.vendor.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q) ||
          r.addedBy.toLowerCase().includes(q)
      );
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

  get paginatedRows(): PurchaseOrderRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
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

  navigateToCreate(): void {
    this.closeRowAction();
    this.router.navigate(['/facility/purchase-orders/create']);
  }

  navigateToDetail(id: string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/purchase-orders', id]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-po-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-po-columns]')) {
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
