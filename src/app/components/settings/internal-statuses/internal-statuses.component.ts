import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  DEFAULT_INTERNAL_STATUSES,
  EMPTY_INTERNAL_STATUS,
  INTERNAL_STATUS_COLORS,
  INTERNAL_STATUS_MODULES,
  InternalStatusColumnDef,
  InternalStatusColorOption,
  InternalStatusDraft,
  InternalStatusModule,
  InternalStatusRow,
} from './internal-statuses.data';

type SortKey = 'name' | 'module' | 'colorKey';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-internal-statuses',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './internal-statuses.component.html',
  styleUrl: './internal-statuses.component.scss',
})
export class InternalStatusesComponent {
  searchQuery = '';
  columnSearch = '';
  filterModule: InternalStatusModule | '' = '';
  modalOpen = false;
  showColumns = false;
  showFilters = false;
  editingId: number | null = null;

  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: InternalStatusDraft = { ...EMPTY_INTERNAL_STATUS };
  rows: InternalStatusRow[] = DEFAULT_INTERNAL_STATUSES.map((r) => ({ ...r }));

  readonly modules = INTERNAL_STATUS_MODULES;
  readonly colors = INTERNAL_STATUS_COLORS;

  columns: InternalStatusColumnDef[] = [
    { key: 'name', label: 'Name', visible: true },
    { key: 'module', label: 'Module', visible: true },
    { key: 'color', label: 'Color', visible: true },
    { key: 'actions', label: 'Action', visible: true },
  ];

  private nextId = 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): InternalStatusRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (this.filterModule && row.module !== this.filterModule) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.module.toLowerCase().includes(q) ||
        this.colorLabel(row.colorKey).toLowerCase().includes(q)
      );
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av =
        this.sortKey === 'colorKey' ? this.colorLabel(a.colorKey) : String(a[this.sortKey]);
      const bv =
        this.sortKey === 'colorKey' ? this.colorLabel(b.colorKey) : String(b[this.sortKey]);
      return av.localeCompare(bv, undefined, { sensitivity: 'base' }) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): InternalStatusRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('name')) {
      parts.push('minmax(180px, 1.4fr)');
    }
    if (this.isColumnVisible('module')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('color')) {
      parts.push('minmax(120px, 0.9fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): InternalStatusColumnDef[] {
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
    return this.filterModule ? 1 : 0;
  }

  get emptyMessage(): string {
    if (this.rows.length === 0 && !this.searchQuery.trim() && !this.filterModule) {
      return "We don't have any internal statuses that match your search. Try adjusting your search to find what you're looking for.";
    }
    return "We don't have any internal statuses that match your search. Try adjusting your search to find what you're looking for.";
  }

  get modalTitle(): string {
    return this.editingId == null ? 'Create Internal Status' : 'Edit Internal Status';
  }

  get canSubmit(): boolean {
    return (
      this.draft.name.trim().length > 0 &&
      this.draft.module !== '' &&
      this.draft.colorKey !== ''
    );
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  colorOption(key: string): InternalStatusColorOption | undefined {
    return this.colors.find((c) => c.key === key);
  }

  colorLabel(key: string): string {
    return this.colorOption(key)?.label ?? key;
  }

  colorCss(key: string): string {
    return this.colorOption(key)?.cssVar ?? 'rgb(var(--text-muted))';
  }

  canEdit(row: InternalStatusRow): boolean {
    return !row.hasAssociatedRecords;
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
    this.pageIndex = 0;
  }

  applyFilterModule(value: InternalStatusModule | ''): void {
    this.filterModule = value;
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
      visible: c.key === 'name' || c.key === 'actions',
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

  openCreate(): void {
    this.editingId = null;
    this.draft = { ...EMPTY_INTERNAL_STATUS };
    this.modalOpen = true;
  }

  openEdit(row: InternalStatusRow): void {
    if (!this.canEdit(row)) {
      return;
    }
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      module: row.module,
      colorKey: row.colorKey,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    if (!this.canSubmit || this.draft.module === '') {
      return;
    }
    if (this.editingId == null) {
      this.rows = [
        ...this.rows,
        {
          id: this.nextId++,
          name: this.draft.name.trim(),
          module: this.draft.module,
          colorKey: this.draft.colorKey,
          hasAssociatedRecords: false,
        },
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name: this.draft.name.trim(),
              module: this.draft.module as InternalStatusModule,
              colorKey: this.draft.colorKey,
            }
          : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: InternalStatusRow): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
