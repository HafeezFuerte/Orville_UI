import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  EXPENSE_KPIS,
  EXPENSE_ROWS,
  EXPENSE_STATUS_TABS,
  ExpenseRow,
  ExpenseStatus
} from './expenses.data';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {
  searchQuery = '';
  statusFilter: 'All' | ExpenseStatus = 'All';
  statusTabs = EXPENSE_STATUS_TABS;
  kpis = EXPENSE_KPIS;
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;

  filterName = '';
  filterAccount = '';
  filterStatus: ExpenseStatus | null = null;
  statusOptions: ExpenseStatus[] = EXPENSE_STATUS_TABS.filter((tab): tab is ExpenseStatus => tab !== 'All');

  pageIndex = 0;
  pageSize = 5;
  allRows = EXPENSE_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'billNumber', label: 'Bill Number', visible: true },
    { key: 'unitCommonArea', label: 'Unit / Common Area', visible: true },
    { key: 'leaseDetails', label: 'Lease Details', visible: true },
    { key: 'chequeNo', label: 'Cheque no', visible: true },
    { key: 'account', label: 'Account', visible: true },
    { key: 'bankName', label: 'Bank Name', visible: true },
    { key: 'totalAmount', label: 'Total Amount', visible: true },
    { key: 'dueDate', label: 'Due Date', visible: true },
    { key: 'issueDate', label: 'Issue Date', visible: true },
    { key: 'paidDate', label: 'Paid Date', visible: true },
    { key: 'createdBy', label: 'Created By', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): ExpenseRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterName && !row.createdBy.toLowerCase().includes(this.filterName.toLowerCase()) && !row.billNumber.toLowerCase().includes(this.filterName.toLowerCase())) {
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
        row.billNumber.toLowerCase().includes(q) ||
        row.unitCommonArea.toLowerCase().includes(q) ||
        row.account.toLowerCase().includes(q) ||
        row.createdBy.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): ExpenseRow[] {
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

  setStatusFilter(status: 'All' | ExpenseStatus): void {
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
    this.filterName = '';
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

  statusClass(status: ExpenseStatus): string {
    const map: Record<string, string> = {
      Paid: 'inv-badge inv-badge--paid',
      Unpaid: 'inv-badge inv-badge--rejected',
      Overdue: 'inv-badge inv-badge--rejected',
      Draft: 'inv-badge inv-badge--draft',
      Hold: 'inv-badge inv-badge--pending',
      Void: 'inv-badge inv-badge--draft',
      'Write Off': 'inv-badge inv-badge--draft',
      Bounced: 'inv-badge inv-badge--rejected'
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
