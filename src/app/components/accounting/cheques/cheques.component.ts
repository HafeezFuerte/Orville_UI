import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  CHEQUE_KPIS,
  CHEQUE_ROWS,
  CHEQUE_STATUS_TABS,
  ChequeRow,
  ChequeStatus
} from './cheques.data';

@Component({
  selector: 'app-cheques',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './cheques.component.html',
  styleUrl: './cheques.component.scss'
})
export class ChequesComponent {
  searchQuery = '';
  statusFilter: 'All' | ChequeStatus = 'All';
  statusTabs = CHEQUE_STATUS_TABS;
  kpis = CHEQUE_KPIS;
  showColumnDropdown = false;
  pageIndex = 0;
  pageSize = 10;
  allRows = CHEQUE_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'invoiceId', label: 'Invoice ID', visible: true },
    { key: 'chequeNo', label: 'Cheque No', visible: true },
    { key: 'bankNo', label: 'Bank No', visible: true },
    { key: 'bankName', label: 'Bank Name', visible: true },
    { key: 'chequeDate', label: 'Cheque Date', visible: true },
    { key: 'heldBy', label: 'Held By', visible: true },
    { key: 'amount', label: 'Amount Cents', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'inHand', label: 'In Hand', visible: true, useTemplate: true },
    { key: 'returned', label: 'Returned', visible: true, useTemplate: true },
    { key: 'returnedDate', label: 'Returned Date', visible: true },
    { key: 'bounceDate', label: 'Bounce Date', visible: true },
    { key: 'bounceReason', label: 'Bounce Reason', visible: true },
    { key: 'withdrawalReason', label: 'Withdrawal Reason', visible: true },
    { key: 'contactName', label: 'Contact Name', visible: true },
    { key: 'landlord', label: 'Landlord', visible: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'attachment', label: 'Attachment', visible: true }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): ChequeRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.toLowerCase().includes(q) ||
        row.invoiceId.toLowerCase().includes(q) ||
        row.chequeNo.toLowerCase().includes(q) ||
        row.bankName.toLowerCase().includes(q) ||
        row.contactName.toLowerCase().includes(q) ||
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

  get paginatedRows(): ChequeRow[] {
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

  setStatusFilter(status: 'All' | ChequeStatus): void {
    this.statusFilter = status;
    this.pageIndex = 0;
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  statusClass(status: ChequeStatus): string {
    if (status === 'Cleared' || status === 'Deposited' || status === 'Redeposited') {
      return 'chq-pill chq-pill--navy';
    }
    if (status === 'Pending') {
      return 'chq-pill chq-pill--warn';
    }
    if (status === 'Bounced') {
      return 'chq-pill chq-pill--danger';
    }
    return 'chq-pill chq-pill--muted';
  }

  yesNoClass(value: 'Yes' | 'No'): string {
    return value === 'Yes' ? 'chq-pill chq-pill--navy' : 'chq-pill chq-pill--muted';
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
