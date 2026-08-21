import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  TICKET_ROWS,
  TicketPriority,
  TicketRow,
  TicketStatus
} from '../tickets.data';

type StatusTab = 'All' | TicketStatus;
type ViewMode = 'list' | 'board';

@Component({
  selector: 'app-facility-tickets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class FacilityTicketsComponent {
  private router = inject(Router);

  searchQuery = '';
  viewMode: ViewMode = 'list';
  statusFilter: StatusTab = 'All';
  statusTabs: StatusTab[] = [
    'All',
    'New',
    'Open',
    'In Progress',
    'On Hold',
    'Resolved',
    'Rejected',
    'Accepted',
    'Vendor Rejected',
    'Tenant Rejected',
    'Escalated',
    'Re-opened'
  ];

  /** Figma kanban column order (3041:95309) */
  kanbanColumns: TicketStatus[] = [
    'New',
    'Open',
    'In Progress',
    'On Hold',
    'Resolved',
    'Rejected',
    'Accepted',
    'Vendor Rejected',
    'Tenant Rejected',
    'Escalated',
    'Re-opened'
  ];

  isDrawerOpen = false;
  showColumnDropdown = false;
  filterTitle = '';
  filterStatus: TicketStatus | null = null;
  filterPriority: TicketPriority | null = null;
  statusOptions: TicketStatus[] = [...this.kanbanColumns];
  priorityOptions: TicketPriority[] = ['Low', 'Medium', 'High', 'Emergency'];
  pageIndex = 0;
  pageSize = 10;
  allRows = TICKET_ROWS;
  openRowActionId: string | null = null;
  openKanbanStatusId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  readonly metrics = {
    New: { value: '48', sub: '+6 this week' },
    Open: { value: '184', sub: '21 due today' },
    'In Progress': { value: '63', sub: '12 with vendors' },
    Resolved: { value: '536', sub: '92% SLA met' }
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
      width: '130px',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },
    { key: 'department', label: 'Department', visible: true, width: '160px' },
    {
      key: 'source',
      label: 'Source',
      visible: true,
      useTemplate: true,
      width: '140px',
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

  get filteredRows(): TicketRow[] {
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
      if (this.filterTitle && !row.title.toLowerCase().includes(this.filterTitle.trim().toLowerCase())) {
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
        row.contactName,
        row.details,
        row.category
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
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
    if (!this.totalRecords) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.totalRecords, (this.pageIndex + 1) * this.pageSize);
  }

  get paginatedRows(): TicketRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get pagerItems(): Array<number | '...'> {
    const total = this.totalPages;
    const current = this.displayPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const items: Array<number | '...'> = [1];
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

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.closeRowAction();
    this.openKanbanStatusId = null;
    this.showColumnDropdown = false;
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

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col && key !== 'action') {
      col.visible = col.visible === false;
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
    this.filterPriority = null;
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
    }
  }

  goToPage(page: number): void {
    this.pageIndex = Math.max(0, Math.min(this.totalPages - 1, page - 1));
  }

  columnCount(status: TicketStatus): number {
    return this.filteredRows.filter((row) => row.status === status).length;
  }

  cardsForColumn(status: TicketStatus): TicketRow[] {
    return this.filteredRows.filter((row) => row.status === status);
  }

  cardLocation(row: TicketRow): string {
    return `${row.property} · ${row.category}`;
  }

  toggleKanbanStatus(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.openKanbanStatusId = this.openKanbanStatusId === id ? null : id;
  }

  toggleRowAction(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showColumnDropdown = false;
    this.openKanbanStatusId = null;

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

  priorityClass(priority: TicketPriority): string {
    switch (priority) {
      case 'Emergency':
      case 'High':
        return 'tk-chip--danger-soft';
      case 'Medium':
        return 'tk-chip--warning-soft';
      default:
        return 'tk-chip--success-soft';
    }
  }

  statusClass(status: TicketStatus): string {
    switch (status) {
      case 'Open':
      case 'New':
        return 'tk-chip--primary';
      case 'Rejected':
      case 'Vendor Rejected':
      case 'Tenant Rejected':
        return 'tk-chip--danger-soft';
      case 'Closed':
      case 'Resolved':
      case 'Accepted':
        return 'tk-chip--success-soft';
      case 'In Progress':
      case 'On Hold':
      case 'Escalated':
      case 'Re-opened':
        return 'tk-chip--warning-soft';
      default:
        return 'tk-chip--soft';
    }
  }

  kanbanPriorityClass(priority: TicketPriority): string {
    switch (priority) {
      case 'Emergency':
        return 'tk-kanban-card__priority--emergency';
      case 'High':
        return 'tk-kanban-card__priority--high';
      case 'Medium':
        return 'tk-kanban-card__priority--medium';
      case 'Low':
        return 'tk-kanban-card__priority--low';
      default:
        return '';
    }
  }

  navigateToDetail(id: string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/tickets', id]);
  }

  navigateToEdit(): void {
    this.closeRowAction();
    this.router.navigate(['/facility/tickets/create']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-tickets-action]')) {
      return;
    }
    this.closeRowAction();
    this.openKanbanStatusId = null;
    if (!target?.closest('[data-tickets-columns]')) {
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
