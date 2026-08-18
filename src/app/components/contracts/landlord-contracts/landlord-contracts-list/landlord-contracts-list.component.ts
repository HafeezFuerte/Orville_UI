import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  LANDLORD_CONTRACT_ROWS,
  LANDLORD_CONTRACT_STATUS_TABS,
  LandlordContractRow,
  LandlordContractStatus
} from '../landlord-contracts.data';

@Component({
  selector: 'app-landlord-contracts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './landlord-contracts-list.component.html',
  styleUrl: './landlord-contracts-list.component.scss'
})
export class LandlordContractsListComponent {
  searchQuery = '';
  statusFilter: 'All' | LandlordContractStatus = 'All';
  statusTabs = LANDLORD_CONTRACT_STATUS_TABS;
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;

  filterLandlord = '';
  filterProperty = '';
  filterStatus: LandlordContractStatus | null = null;
  statusOptions: LandlordContractStatus[] = ['Active', 'Draft', 'Completed', 'Offered'];

  pageNo = 0;
  pageSize = 10;
  allRows = LANDLORD_CONTRACT_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'landlord', label: 'Landlord', visible: true, useTemplate: true },
    { key: 'name', label: 'Name', visible: true, useTemplate: true },
    { key: 'properties', label: 'Properties', visible: true, useTemplate: true },
    { key: 'unitsRooms', label: 'Units / Rooms', visible: true, useTemplate: true },
    { key: 'startDate', label: 'Start Date', visible: true },
    { key: 'endDate', label: 'End Date', visible: true },
    { key: 'createDate', label: 'Create Date', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'value', label: 'Value', visible: true, useTemplate: true },
    { key: 'daysLeft', label: 'Days Left', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  constructor(private router: Router) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((c) => c.visible !== false);
  }

  get filteredRows(): LandlordContractRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterLandlord && !row.landlord.toLowerCase().includes(this.filterLandlord.toLowerCase())) {
        return false;
      }
      if (this.filterProperty && !row.properties.toLowerCase().includes(this.filterProperty.toLowerCase())) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.includes(q) ||
        row.landlord.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.properties.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): LandlordContractRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get displayPage(): number {
    return this.pageNo + 1;
  }

  get startRecord(): number {
    if (!this.totalRecords) {
      return 0;
    }
    return this.pageNo * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalRecords);
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  setStatusFilter(status: 'All' | LandlordContractStatus): void {
    this.statusFilter = status;
    this.pageNo = 0;
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterLandlord = '';
    this.filterProperty = '';
    this.filterStatus = null;
    this.statusFilter = 'All';
    this.pageNo = 0;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((c) => (c.visible = checked));
  }

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.openActionId = this.openActionId === id ? null : id;
  }

  goToCreate(): void {
    this.router.navigate(['/landlord-contracts/create']);
  }

  goToDetail(id: string): void {
    this.router.navigate(['/landlord-contracts', id]);
  }

  onPageSizeChange(): void {
    this.pageNo = 0;
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages) {
      this.pageNo = target;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionId = null;
  }
}
