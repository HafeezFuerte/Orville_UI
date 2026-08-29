import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  CUSTOM_FIELD_DATA_TYPES,
  CUSTOM_FIELD_MODULES,
  CustomFieldColumnDef,
  CustomFieldDataType,
  CustomFieldModule,
  CustomFieldRow,
  DEFAULT_CUSTOM_FIELDS,
} from './custom-fields.data';

type SortKey =
  | 'fieldName'
  | 'fieldLabel'
  | 'dataType'
  | 'module'
  | 'visibleToTenant'
  | 'visibleToLandlord'
  | 'useForVerification';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-custom-fields',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './custom-fields.component.html',
  styleUrl: './custom-fields.component.scss',
})
export class CustomFieldsComponent {
  searchQuery = '';
  columnSearch = '';
  filterModule: CustomFieldModule | '' = '';
  filterDataType: CustomFieldDataType | '' = '';
  showColumns = false;
  showFilters = false;

  sortKey: SortKey = 'fieldName';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  rows: CustomFieldRow[] = DEFAULT_CUSTOM_FIELDS.map((r) => ({ ...r }));

  readonly modules = CUSTOM_FIELD_MODULES;
  readonly dataTypes = CUSTOM_FIELD_DATA_TYPES;

  columns: CustomFieldColumnDef[] = [
    { key: 'fieldName', label: 'Field Name', visible: true },
    { key: 'fieldLabel', label: 'Field Label', visible: true },
    { key: 'dataType', label: 'Data Type', visible: true },
    { key: 'module', label: 'Module', visible: true },
    { key: 'visibleToTenant', label: 'Visible to Tenant', visible: true },
    { key: 'visibleToLandlord', label: 'Visible to Landlord', visible: true },
    { key: 'useForVerification', label: 'Use For Verification', visible: true },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): CustomFieldRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (this.filterModule && row.module !== this.filterModule) {
        return false;
      }
      if (this.filterDataType && row.dataType !== this.filterDataType) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.fieldName.toLowerCase().includes(q) ||
        row.fieldLabel.toLowerCase().includes(q) ||
        row.dataType.toLowerCase().includes(q) ||
        row.module.toLowerCase().includes(q)
      );
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = a[this.sortKey];
      const bv = b[this.sortKey];
      if (typeof av === 'boolean' && typeof bv === 'boolean') {
        return (Number(av) - Number(bv)) * dir;
      }
      return String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' }) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get pagedRows(): CustomFieldRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('fieldName')) {
      parts.push('minmax(140px, 1.1fr)');
    }
    if (this.isColumnVisible('fieldLabel')) {
      parts.push('minmax(130px, 1fr)');
    }
    if (this.isColumnVisible('dataType')) {
      parts.push('minmax(110px, 0.9fr)');
    }
    if (this.isColumnVisible('module')) {
      parts.push('minmax(100px, 0.8fr)');
    }
    if (this.isColumnVisible('visibleToTenant')) {
      parts.push('120px');
    }
    if (this.isColumnVisible('visibleToLandlord')) {
      parts.push('130px');
    }
    if (this.isColumnVisible('useForVerification')) {
      parts.push('140px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): CustomFieldColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get activeFilterCount(): number {
    return (this.filterModule ? 1 : 0) + (this.filterDataType ? 1 : 0);
  }

  get emptyMessage(): string {
    if (this.rows.length === 0) {
      return 'No custom fields yet.';
    }
    return 'No custom fields match your filters.';
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  yesNo(value: boolean): string {
    return value ? 'Yes' : 'No';
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  onSearchChange(): void {
    this.pageIndex = 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showColumns = false;
    }
  }

  clearFilters(): void {
    this.filterModule = '';
    this.filterDataType = '';
    this.pageIndex = 0;
  }

  applyFilterModule(value: CustomFieldModule | ''): void {
    this.filterModule = value;
    this.pageIndex = 0;
  }

  applyFilterDataType(value: CustomFieldDataType | ''): void {
    this.filterDataType = value;
    this.pageIndex = 0;
  }

  toggleColumns(): void {
    this.showColumns = !this.showColumns;
    if (this.showColumns) {
      this.columnSearch = '';
      this.showFilters = false;
    }
  }

  closeColumns(): void {
    this.showColumns = false;
  }

  toggleSelectAllColumns(checked: boolean): void {
    this.columns = this.columns.map((c) => ({ ...c, visible: checked }));
  }

  clearColumns(): void {
    this.columns = this.columns.map((c) => ({
      ...c,
      visible: c.key === 'fieldName' || c.key === 'fieldLabel',
    }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (this.showColumns) {
      const root = this.host.nativeElement.querySelector('[data-columns-dropdown]');
      if (root && target && !root.contains(target)) {
        this.showColumns = false;
      }
    }
    if (this.showFilters) {
      const root = this.host.nativeElement.querySelector('[data-filters-dropdown]');
      if (root && target && !root.contains(target)) {
        this.showFilters = false;
      }
    }
  }
}
