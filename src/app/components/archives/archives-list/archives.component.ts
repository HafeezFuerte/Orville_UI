import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import {
  ARCHIVE_TABS,
  ArchiveTabId,
  ArchivedRecord,
  getArchivedRows,
} from '../archives.data';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent],
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss'],
})
export class ArchivesComponent {
  readonly tabs = ARCHIVE_TABS;

  activeTab: ArchiveTabId = 'properties';
  searchQuery = '';
  showColumnDropdown = false;
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];
  selectedIds = new Set<string>();

  private rows: ArchivedRecord[] = getArchivedRows('properties');

  propertyColumns = [
    { key: 'select', label: '', visible: true, useTemplate: true, width: '44px' },
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true, useTemplate: true },
    { key: 'address', label: 'Address', visible: true },
    { key: 'totalLeases', label: 'Total Leases', visible: true },
    { key: 'totalUnits', label: 'Total Units', visible: true },
    { key: 'deletedAt', label: 'Deleted At', visible: true },
    { key: 'archivedBy', label: 'Archived By', visible: true },
    { key: 'actions', label: 'Actions', visible: true, useTemplate: true, width: '96px' },
  ];

  genericColumns = [
    { key: 'select', label: '', visible: true, useTemplate: true, width: '44px' },
    { key: 'name', label: 'Name', visible: true, useTemplate: true },
    { key: 'deletedAt', label: 'Deleted At', visible: true },
    { key: 'archivedBy', label: 'Archived By', visible: true },
    { key: 'actions', label: 'Actions', visible: true, useTemplate: true, width: '96px' },
  ];

  constructor(private toastr: ToastrService) {}

  get isPropertiesTab(): boolean {
    return this.activeTab === 'properties';
  }

  get tableColumns() {
    return this.isPropertiesTab ? this.propertyColumns : this.genericColumns;
  }

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns
      .filter((col) => col.key !== 'select' && col.key !== 'actions')
      .every((col) => col.visible !== false);
  }

  get filteredRows(): ArchivedRecord[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter((row) => {
      const hay = [row.id, row.name, row.address, row.city, row.archivedBy]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get pagedRows(): ArchivedRecord[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get allPageSelected(): boolean {
    const page = this.pagedRows;
    return page.length > 0 && page.every((row) => this.selectedIds.has(row.id));
  }

  setTab(tab: ArchiveTabId): void {
    this.activeTab = tab;
    this.rows = getArchivedRows(tab);
    this.searchQuery = '';
    this.pageNo = 0;
    this.selectedIds.clear();
    this.showColumnDropdown = false;
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    if (key === 'select' || key === 'actions') {
      return;
    }
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = col.visible === false ? true : false;
    }
  }

  toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableColumns.forEach((col) => {
      if (col.key !== 'select' && col.key !== 'actions') {
        col.visible = checked;
      }
    });
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const next = new Set(this.selectedIds);
    if (checked) {
      this.pagedRows.forEach((row) => next.add(row.id));
    } else {
      this.pagedRows.forEach((row) => next.delete(row.id));
    }
    this.selectedIds = next;
  }

  toggleRowSelect(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const next = new Set(this.selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selectedIds = next;
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  onExport(): void {
    this.toastr.info('Export is not connected yet.', 'Archives');
  }

  restoreRow(row: ArchivedRecord): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    this.selectedIds.delete(row.id);
    this.toastr.success(`${row.name} restored.`, 'Archives');
    if (this.pageNo > 0 && this.pagedRows.length === 0) {
      this.pageNo -= 1;
    }
  }

  deleteRow(row: ArchivedRecord): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    this.selectedIds.delete(row.id);
    this.toastr.success(`${row.name} permanently deleted.`, 'Archives');
    if (this.pageNo > 0 && this.pagedRows.length === 0) {
      this.pageNo -= 1;
    }
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
