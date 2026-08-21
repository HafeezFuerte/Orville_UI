import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  PM_ROWS,
  PmPriority,
  PmStatus,
  PreventiveMaintenanceRow
} from '../preventive-maintenance.data';

@Component({
  selector: 'app-preventive-maintenance-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './preventive-maintenance-list.component.html',
  styleUrl: './preventive-maintenance-list.component.scss'
})
export class PreventiveMaintenanceListComponent {
  private router = inject(Router);

  searchQuery = '';
  showColumnDropdown = false;
  pageIndex = 0;
  pageSize = 10;
  allRows = PM_ROWS;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '90px' },
    { key: 'title', label: 'Title', visible: true, useTemplate: true, width: '160px' },
    { key: 'trigger', label: 'Trigger', visible: true, width: '180px' },
    { key: 'status', label: 'Status', visible: true, useTemplate: true, width: '110px' },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true, width: '110px' },
    { key: 'schedule', label: 'Schedule', visible: true, width: '100px' },
    { key: 'nextSchedule', label: 'Next Schedule', visible: true, width: '120px' },
    { key: 'property', label: 'Property', visible: true, width: '180px' },
    { key: 'unit', label: 'Unit', visible: true, width: '140px' },
    { key: 'category', label: 'Category', visible: true, width: '150px' },
    { key: 'vendor', label: 'Vendor', visible: true, width: '150px' },
    { key: 'asset', label: 'Asset', visible: true, width: '120px' },
    { key: 'commonArea', label: 'Common Area', visible: true, width: '130px' },
    { key: 'lastWorkOrder', label: 'Last work Order', visible: true, width: '130px' },
    { key: 'createdAt', label: 'Created At', visible: true, width: '150px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((c) => c.visible !== false);
  }

  get filteredRows(): PreventiveMaintenanceRow[] {
    let rows = [...this.allRows];
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.trigger.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q) ||
          r.unit.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.vendor.toLowerCase().includes(q)
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

  get paginatedRows(): PreventiveMaintenanceRow[] {
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

  statusClass(status: PmStatus): string {
    switch (status) {
      case 'New':
        return 'pm-chip pm-chip--primary';
      case 'Open':
        return 'pm-chip pm-chip--info';
      case 'In Progress':
        return 'pm-chip pm-chip--warning';
      case 'On Hold':
        return 'pm-chip pm-chip--soft';
      case 'Resolved':
        return 'pm-chip pm-chip--success';
      default:
        return 'pm-chip pm-chip--soft';
    }
  }

  priorityClass(priority: PmPriority): string {
    switch (priority) {
      case 'High':
        return 'pm-chip pm-chip--danger';
      case 'Medium':
        return 'pm-chip pm-chip--soft';
      case 'Low':
        return 'pm-chip pm-chip--info';
      default:
        return 'pm-chip pm-chip--soft';
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

  navigateToCreate(): void {
    this.closeRowAction();
    this.router.navigate(['/facility/preventive-maintenance/create']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-pm-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-pm-columns]')) {
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
