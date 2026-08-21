import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  REQUEST_ROWS,
  RequestPriority,
  RequestRow,
  RequestStatus
} from '../requests.data';

type StatusTab = 'All' | RequestStatus;

@Component({
  selector: 'app-facility-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class FacilityRequestsComponent {
  searchQuery = '';
  statusFilter: StatusTab = 'All';
  statusTabs: StatusTab[] = [
    'All',
    'Open',
    'New',
    'Pending',
    'Approved',
    'Resolved',
    'Closed',
    'On Hold',
    'Rejected',
    'Re-opened'
  ];
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterTitle = '';
  filterStatus: RequestStatus | null = null;
  filterPriority: RequestPriority | null = null;
  statusOptions: RequestStatus[] = [
    'Open',
    'New',
    'Pending',
    'Approved',
    'Resolved',
    'Closed',
    'On Hold',
    'Rejected',
    'Re-opened'
  ];
  priorityOptions: RequestPriority[] = ['Low', 'Medium', 'High'];
  pageIndex = 0;
  pageSize = 10;
  allRows = REQUEST_ROWS;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  readonly metrics = {
    total: '1,272',
    totalSub: 'Across all buildings',
    open: '284',
    openSub: 'Require team action',
    awaiting: '96',
    awaitingSub: 'Pending manager review',
    due: '42',
    dueSub: 'Need follow-up today'
  };

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
      key: 'title',
      label: 'Title',
      visible: true,
      useTemplate: true,
      width: '220px',
      headerClass: 'text-start sticky left-[90px] z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-[90px] z-[1] bg-white dark:bg-bodybg'
    },
    { key: 'property', label: 'Property', visible: true, width: '180px' },
    { key: 'unit', label: 'Unit', visible: true, width: '140px' },
    {
      key: 'priority',
      label: 'Priority',
      visible: true,
      useTemplate: true,
      width: '110px',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },
    {
      key: 'status',
      label: 'Status',
      visible: true,
      useTemplate: true,
      width: '120px',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },
    { key: 'department', label: 'Department', visible: true, width: '160px' },
    {
      key: 'source',
      label: 'Source',
      visible: true,
      useTemplate: true,
      width: '130px',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },
    { key: 'contact', label: 'Contact', visible: true, useTemplate: true, width: '180px' },
    { key: 'created', label: 'Created', visible: true, width: '110px' },
    { key: 'details', label: 'Details', visible: true, useTemplate: true, width: '240px' },
    {
      key: 'action',
      label: 'Action',
      visible: true,
      useTemplate: true,
      width: '72px',
      headerClass: 'text-end',
      cellClass: 'text-end overflow-visible'
    }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): RequestRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterPriority && row.priority !== this.filterPriority) {
        return false;
      }
      if (this.filterTitle && !row.title.toLowerCase().includes(this.filterTitle.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [
        row.id,
        row.title,
        row.property,
        row.unit,
        row.priority,
        row.status,
        row.department,
        row.source,
        row.contactName
      ].some((value) => String(value).toLowerCase().includes(q));
    });
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

  get paginatedRows(): RequestRow[] {
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

  setStatusFilter(tab: StatusTab): void {
    this.statusFilter = tab;
    this.pageIndex = 0;
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.filterTitle = '';
    this.filterStatus = null;
    this.filterPriority = null;
    this.pageIndex = 0;
  }

  toggleColumnDropdown(event: MouseEvent): void {
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
    this.tableColumns.forEach((col) => (col.visible = checked));
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

  goToPage(page: number): void {
    this.pageIndex = Math.max(0, Math.min(this.totalPages - 1, page - 1));
  }

  toggleRowAction(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showColumnDropdown = false;

    if (this.openRowActionId === id) {
      this.closeRowAction();
      return;
    }

    const target = event.currentTarget as HTMLElement | null;
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const menuWidth = 120;
    const gap = 4;
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8));
    let top = rect.bottom + gap;
    // Flip upward if near bottom of viewport
    if (top + 90 > window.innerHeight) {
      top = Math.max(8, rect.top - gap - 80);
    }

    this.rowMenuStyle = {
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`
    };
    this.openRowActionId = id;
  }

  closeRowAction(): void {
    this.openRowActionId = null;
    this.rowMenuStyle = null;
  }

  priorityClass(priority: RequestPriority): string {
    switch (priority) {
      case 'High':
        return 'req-chip--danger-soft';
      case 'Medium':
        return 'req-chip--warning-soft';
      default:
        return 'req-chip--success-soft';
    }
  }

  statusClass(status: RequestStatus): string {
    switch (status) {
      case 'Open':
      case 'New':
        return 'req-chip--primary';
      case 'Rejected':
        return 'req-chip--danger-soft';
      case 'Closed':
      case 'Resolved':
        return 'req-chip--success-soft';
      case 'Pending':
      case 'On Hold':
      case 'Approved':
      case 'Re-opened':
        return 'req-chip--warning-soft';
      default:
        return 'req-chip--soft';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-requests-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-requests-columns]')) {
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
