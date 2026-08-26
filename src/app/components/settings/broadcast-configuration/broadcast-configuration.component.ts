import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  BroadcastTypeColumnDef,
  BroadcastTypeDraft,
  BroadcastTypeRow,
  DEFAULT_BROADCAST_TYPES,
  EMPTY_BROADCAST_TYPE,
} from './broadcast-configuration.data';

type SortKey = 'type' | 'isAdminCategory';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-broadcast-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './broadcast-configuration.component.html',
  styleUrl: './broadcast-configuration.component.scss',
})
export class BroadcastConfigurationComponent {
  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;

  sortKey: SortKey = 'type';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: BroadcastTypeDraft = { ...EMPTY_BROADCAST_TYPE };
  rows: BroadcastTypeRow[] = DEFAULT_BROADCAST_TYPES.map((r) => ({ ...r }));

  columns: BroadcastTypeColumnDef[] = [
    { key: 'type', label: 'Type', visible: true },
    { key: 'isAdminCategory', label: 'Is Admin Category?', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = Math.max(...DEFAULT_BROADCAST_TYPES.map((r) => r.id), 0) + 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): BroadcastTypeRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (!q) {
        return true;
      }
      return row.type.toLowerCase().includes(q);
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      if (this.sortKey === 'isAdminCategory') {
        return (Number(a.isAdminCategory) - Number(b.isAdminCategory)) * dir;
      }
      return a.type.localeCompare(b.type, undefined, { sensitivity: 'base' }) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): BroadcastTypeRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('type')) {
      parts.push('minmax(180px, 1.4fr)');
    }
    if (this.isColumnVisible('isAdminCategory')) {
      parts.push('minmax(160px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): BroadcastTypeColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get emptyMessage(): string {
    if (this.rows.length === 0) {
      return 'No broadcast types yet. Create your first broadcast type to categorize messages.';
    }
    return 'No broadcast types match your search.';
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Broadcast Type' : 'Edit Broadcast Type';
  }

  get canSave(): boolean {
    return this.draft.type.trim().length > 0;
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

  toggleColumns(): void {
    this.showColumns = !this.showColumns;
    if (this.showColumns) {
      this.columnSearch = '';
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
      visible: c.key === 'type' || c.key === 'actions',
    }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showColumns) {
      return;
    }
    const target = event.target as Node | null;
    const root = this.host.nativeElement.querySelector('[data-columns-dropdown]');
    if (root && target && !root.contains(target)) {
      this.showColumns = false;
    }
  }

  openCreate(): void {
    this.editingId = null;
    this.draft = { ...EMPTY_BROADCAST_TYPE };
    this.modalOpen = true;
  }

  openEdit(row: BroadcastTypeRow): void {
    this.editingId = row.id;
    this.draft = { type: row.type };
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
          type: this.draft.type.trim(),
          isAdminCategory: false,
        },
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId ? { ...r, type: this.draft.type.trim() } : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: BroadcastTypeRow): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
