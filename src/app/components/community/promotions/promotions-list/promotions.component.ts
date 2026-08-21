import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { PROMOTION_ROWS, PromotionRow, PromotionStatus } from '../promotions.data';

type StatusTab = 'All' | PromotionStatus;

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss'
})
export class PromotionsComponent {
  searchQuery = '';
  statusFilter: StatusTab = 'All';
  statusTabs: StatusTab[] = ['Published', 'Draft'];
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterName = '';
  filterStatus: PromotionStatus | null = null;
  statusOptions: PromotionStatus[] = ['Draft', 'Published'];
  pageIndex = 0;
  pageSize = 10;
  allRows = PROMOTION_ROWS;
  openRowActionId: string | null = null;

  tableColumns = [
    {
      key: 'id',
      label: 'ID',
      visible: true,
      useTemplate: true,
      width: '90px',
      headerClass: 'text-start sticky left-0 z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-0 z-[1] bg-white dark:bg-bodybg'
    },
    {
      key: 'name',
      label: 'Promotion Name',
      visible: true,
      useTemplate: true,
      width: '220px',
      headerClass: 'text-start sticky left-[90px] z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-[90px] z-[1] bg-white dark:bg-bodybg'
    },
    { key: 'category', label: 'Category', visible: true, width: '140px' },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'startDate', label: 'Start Date', visible: true },
    { key: 'endDate', label: 'End Date', visible: true },
    { key: 'createdBy', label: 'Created By', visible: true, width: '140px' },
    { key: 'createdAt', label: 'Created', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '80px' }
  ];

  constructor(private router: Router) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): PromotionRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterName && !row.name.toLowerCase().includes(this.filterName.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [row.id, row.name, row.category, row.status, row.startDate, row.endDate, row.createdBy].some((value) =>
        String(value).toLowerCase().includes(q)
      );
    });
  }

  countFor(tab: StatusTab): number {
    if (tab === 'All') {
      return this.allRows.length;
    }
    return this.allRows.filter((row) => row.status === tab).length;
  }

  setStatusFilter(tab: StatusTab): void {
    this.statusFilter = this.statusFilter === tab ? 'All' : tab;
    this.pageIndex = 0;
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
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

  get paginatedRows(): PromotionRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    const current = this.displayPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const items: (number | string)[] = [1];
    if (current > 3) {
      items.push('...');
    }
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      items.push(p);
    }
    if (current < total - 2) {
      items.push('...');
    }
    items.push(total);
    return items;
  }

  goToAdd(): void {
    void this.router.navigate(['/community/promotions/new']);
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
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

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.openRowActionId = this.openRowActionId === id ? null : id;
  }

  onRowView(row: PromotionRow): void {
    this.openRowActionId = null;
    void this.router.navigate(['/community/promotions', row.id]);
  }

  onRowEdit(): void {
    this.openRowActionId = null;
    void this.router.navigate(['/community/promotions/new']);
  }

  onRowDelete(): void {
    this.openRowActionId = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openRowActionId = null;
  }
}
