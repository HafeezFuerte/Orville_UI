import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ACTIVITY_LOG_ROWS, ActivityLogRow } from '../activity-logs.data';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss'],
})
export class ActivityLogsComponent {
  searchQuery = '';
  showColumnDropdown = false;
  showFilterDrawer = false;
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  private rows: ActivityLogRow[] = [...ACTIVITY_LOG_ROWS];

  tableColumns = [
    { key: 'event', label: 'Event', visible: true, useTemplate: true },
    { key: 'module', label: 'Module', visible: true, useTemplate: true },
    { key: 'moduleRef', label: 'Module Ref', visible: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'user', label: 'User', visible: true },
    { key: 'browserIp', label: 'Browser / IP', visible: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'changes', label: 'Changes', visible: true, useTemplate: true },
  ];

  constructor(private toastr: ToastrService) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): ActivityLogRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter((row) => row.user.toLowerCase().includes(q));
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalLabel(): string {
    return this.totalRecords.toLocaleString('en-US');
  }

  get pagedRows(): ActivityLogRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  onExport(): void {
    this.toastr.info('Export is not connected yet.', 'Activity Logs');
  }

  toggleDrawer(show: boolean): void {
    this.showFilterDrawer = show;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = col.visible === false ? true : false;
    }
  }

  toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableColumns.forEach((col) => (col.visible = checked));
  }

  onSharedTablePageChange(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  eventClass(event: string): string {
    if (event === 'Create') {
      return 'activity-event activity-event--create';
    }
    if (event === 'Delete') {
      return 'activity-event activity-event--delete';
    }
    return 'activity-event activity-event--update';
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
