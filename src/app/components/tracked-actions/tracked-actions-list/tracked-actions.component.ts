import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { TRACKED_ACTION_ROWS, TrackedActionRow } from '../tracked-actions.data';

@Component({
  selector: 'app-tracked-actions',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './tracked-actions.component.html',
  styleUrls: ['./tracked-actions.component.scss'],
})
export class TrackedActionsComponent {
  searchQuery = '';
  showColumnDropdown = false;
  showFilterDrawer = false;
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  private rows: TrackedActionRow[] = [...TRACKED_ACTION_ROWS];

  tableColumns = [
    { key: 'eventName', label: 'Event Name', visible: true, useTemplate: true },
    { key: 'user', label: 'User', visible: true, useTemplate: true },
    { key: 'moduleName', label: 'Module Name', visible: true },
    { key: 'recordId', label: 'Record ID', visible: true },
    { key: 'event', label: 'Event', visible: true, useTemplate: true },
    { key: 'date', label: 'Date', visible: true },
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): TrackedActionRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter((row) => {
      const hay = [row.eventName, row.user, row.moduleName, row.recordId, row.event]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get pagedRows(): TrackedActionRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageNo = 0;
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

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
