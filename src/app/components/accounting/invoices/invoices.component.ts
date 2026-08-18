import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  INVOICE_KPIS,
  INVOICE_ROWS,
  INVOICE_STATUS_TABS,
  InvoiceRow,
  InvoiceStatus
} from './invoices.data';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent {
  constructor(private router: Router) {}

  searchQuery = '';
  statusFilter: 'All' | InvoiceStatus = 'All';
  statusTabs = INVOICE_STATUS_TABS;
  kpis = INVOICE_KPIS;
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;

  filterTo = '';
  filterAccount = '';
  filterStatus: InvoiceStatus | null = null;
  statusOptions: InvoiceStatus[] = INVOICE_STATUS_TABS.filter((tab): tab is InvoiceStatus => tab !== 'All');

  pageIndex = 0;
  pageSize = 5;
  allRows = INVOICE_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'to', label: 'To', visible: true },
    { key: 'unitCommonArea', label: 'Unit / Common Area', visible: true },
    { key: 'invoiceNumber', label: 'Invoice Number', visible: true },
    { key: 'chequeNo', label: 'Cheque no', visible: true },
    { key: 'invoiceDate', label: 'Invoice Date', visible: true },
    { key: 'invoiceType', label: 'Invoice Type', visible: true },
    { key: 'account', label: 'Account', visible: true },
    { key: 'currency', label: 'Currency', visible: true },
    { key: 'propertyName', label: 'Property Name', visible: true },
    { key: 'propertyId', label: 'Property ID', visible: true },
    { key: 'leaseId', label: 'Lease ID', visible: true },
    { key: 'leaseStatus', label: 'Lease Status', visible: true, useTemplate: true },
    { key: 'note', label: 'Note', visible: true },
    { key: 'workOrder', label: 'Work Order', visible: true },
    { key: 'amount', label: 'Amount', visible: true },
    { key: 'grossAmount', label: 'Gross Amount', visible: true },
    { key: 'paid', label: 'Paid', visible: true },
    { key: 'paymentVia', label: 'Payment Via', visible: true },
    { key: 'moneyHeldBy', label: 'Money Held By', visible: true },
    { key: 'ddRefNo', label: 'DD Ref No', visible: true },
    { key: 'bankName', label: 'Bank Name', visible: true },
    { key: 'internalStatus', label: 'Internal Status', visible: true },
    { key: 'archived', label: 'Archived', visible: true },
    { key: 'dueDate', label: 'Due Date', visible: true },
    { key: 'paidDate', label: 'Paid Date', visible: true },
    { key: 'cheques', label: 'Cheque(s)', visible: true },
    { key: 'days', label: 'Days', visible: true },
    { key: 'writeAmountOff', label: 'Write Amount Off', visible: true },
    { key: 'createdBy', label: 'Created By', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): InvoiceRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterTo && !row.to.toLowerCase().includes(this.filterTo.toLowerCase())) {
        return false;
      }
      if (this.filterAccount && !row.account.toLowerCase().includes(this.filterAccount.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.includes(q) ||
        row.to.toLowerCase().includes(q) ||
        row.invoiceNumber.toLowerCase().includes(q) ||
        row.unitCommonArea.toLowerCase().includes(q) ||
        row.account.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): InvoiceRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    if (!this.totalRecords) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
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

  setStatusFilter(status: 'All' | InvoiceStatus): void {
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
    this.filterTo = '';
    this.filterAccount = '';
    this.filterStatus = null;
    this.statusFilter = 'All';
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

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.openActionId = this.openActionId === id ? null : id;
  }

  viewInvoice(id: string): void {
    this.openActionId = null;
    void this.router.navigate(['/accounting/invoices', id]);
  }

  statusClass(status: InvoiceStatus): string {
    const map: Record<string, string> = {
      Paid: 'inv-badge inv-badge--paid',
      Unpaid: 'inv-badge inv-badge--rejected',
      Overdue: 'inv-badge inv-badge--rejected',
      Draft: 'inv-badge inv-badge--draft',
      Hold: 'inv-badge inv-badge--pending',
      Void: 'inv-badge inv-badge--draft',
      'Write Off': 'inv-badge inv-badge--draft',
      Bounced: 'inv-badge inv-badge--rejected',
      'Pending Approvals': 'inv-badge inv-badge--pending'
    };
    return map[status] || 'inv-badge inv-badge--draft';
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
    this.openActionId = null;
  }
}
