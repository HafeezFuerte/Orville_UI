import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  DEFAULT_ROOM_TYPES,
  EMPTY_ROOM_TYPE,
  ROOM_CATEGORY_TYPES,
  RoomCategoryType,
  RoomTypeColumnDef,
  RoomTypeDraft,
  RoomTypeRow,
} from './room-types.data';

type SortKey = 'id' | 'name' | 'categoryType' | 'roomsCount';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-room-types',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './room-types.component.html',
  styleUrl: './room-types.component.scss',
})
export class RoomTypesComponent {
  searchQuery = '';
  columnSearch = '';
  filterCategory: RoomCategoryType | '' = '';
  modalOpen = false;
  showColumns = false;
  showFilters = false;
  editingId: number | null = null;

  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: RoomTypeDraft = { ...EMPTY_ROOM_TYPE };
  rows: RoomTypeRow[] = DEFAULT_ROOM_TYPES.map((r) => ({ ...r }));

  readonly categoryTypes = ROOM_CATEGORY_TYPES;

  columns: RoomTypeColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'categoryType', label: 'Category Type', visible: true },
    { key: 'roomsCount', label: 'Rooms', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): RoomTypeRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (this.filterCategory && row.categoryType !== this.filterCategory) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.categoryType.toLowerCase().includes(q) ||
        String(row.id).includes(q)
      );
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = a[this.sortKey];
      const bv = b[this.sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return list;
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): RoomTypeRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('72px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(160px, 1.4fr)');
    }
    if (this.isColumnVisible('categoryType')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('roomsCount')) {
      parts.push('100px');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): RoomTypeColumnDef[] {
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
    return this.filterCategory ? 1 : 0;
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Room Type' : 'Edit Room Type';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
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
    this.filterCategory = '';
    this.pageIndex = 0;
  }

  applyFilterCategory(value: RoomCategoryType | ''): void {
    this.filterCategory = value;
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
    this.draft = { ...EMPTY_ROOM_TYPE };
    this.modalOpen = true;
  }

  openEdit(row: RoomTypeRow): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      categoryType: row.categoryType,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    if (this.editingId == null) {
      this.rows = [
        ...this.rows,
        {
          id: this.nextId++,
          name: this.draft.name.trim(),
          categoryType: this.draft.categoryType,
          roomsCount: 0,
        },
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name: this.draft.name.trim(),
              categoryType: this.draft.categoryType,
            }
          : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: RoomTypeRow): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
