import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  ACCOUNT_TYPE_TABS,
  AccountType,
  CHART_ACCOUNT_ROWS,
  ChartAccountRow
} from './chart-of-accounts.data';

@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './chart-of-accounts.component.html',
  styleUrl: './chart-of-accounts.component.scss'
})
export class ChartOfAccountsComponent {
  searchQuery = '';
  typeFilter: 'All' | AccountType = 'All';
  typeTabs = ACCOUNT_TYPE_TABS;
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;

  filterName = '';
  filterType: AccountType | null = null;
  filterSubAccount: 'Yes' | 'No' | null = null;
  typeOptions: AccountType[] = ACCOUNT_TYPE_TABS.filter((tab): tab is AccountType => tab !== 'All');
  subAccountOptions: Array<'Yes' | 'No'> = ['Yes', 'No'];

  pageIndex = 0;
  pageSize = 5;
  allRows: ChartAccountRow[] = [...CHART_ACCOUNT_ROWS];

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'accountNumber', label: 'Account Number', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'description', label: 'Description', visible: true },
    { key: 'type', label: 'Type', visible: true, useTemplate: true },
    { key: 'subType', label: 'Sub Type', visible: true },
    { key: 'subAccount', label: 'Sub Account', visible: true, useTemplate: true },
    { key: 'createdBy', label: 'Created By', visible: true },
    { key: 'created', label: 'Created', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  constructor(private router: Router) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): ChartAccountRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.typeFilter !== 'All' && row.type !== this.typeFilter) {
        return false;
      }
      if (this.filterType && row.type !== this.filterType) {
        return false;
      }
      if (this.filterSubAccount && row.subAccount !== this.filterSubAccount) {
        return false;
      }
      if (this.filterName && !row.name.toLowerCase().includes(this.filterName.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.includes(q) ||
        row.accountNumber.includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
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

  get paginatedRows(): ChartAccountRow[] {
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

  setTypeFilter(type: 'All' | AccountType): void {
    this.typeFilter = type;
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
    this.filterType = null;
    this.filterSubAccount = null;
    this.typeFilter = 'All';
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

  typeClass(type: AccountType): string {
    if (type === 'Asset') {
      return 'coa-pill coa-pill--navy';
    }
    if (type === 'Liability') {
      return 'coa-pill coa-pill--danger';
    }
    return 'coa-pill coa-pill--muted';
  }

  subAccountClass(value: 'Yes' | 'No'): string {
    return value === 'Yes' ? 'coa-pill coa-pill--navy' : 'coa-pill coa-pill--muted';
  }

  openAccount(): void {
    this.openActionId = null;
    void this.router.navigate(['/accounting/chart-of-accounts/create']);
  }

  deleteAccount(id: string): void {
    this.allRows = this.allRows.filter((row) => row.id !== id);
    this.openActionId = null;
    if (this.pageIndex >= this.totalPages) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
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
