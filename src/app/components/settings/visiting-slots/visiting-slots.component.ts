import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  DEFAULT_VISITING_SLOTS,
  EMPTY_VISITING_SLOT,
  VisitingSlotColumnDef,
  VisitingSlotDraft,
  VisitingSlotRow,
} from './visiting-slots.data';

type SortKey = 'id' | 'name';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-visiting-slots',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './visiting-slots.component.html',
  styleUrl: './visiting-slots.component.scss',
})
export class VisitingSlotsComponent {
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;

  sortKey: SortKey = 'id';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: VisitingSlotDraft = { ...EMPTY_VISITING_SLOT };
  rows: VisitingSlotRow[] = DEFAULT_VISITING_SLOTS.map((r) => ({ ...r }));

  columns: VisitingSlotColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = Math.max(...DEFAULT_VISITING_SLOTS.map((r) => r.id), 0) + 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): VisitingSlotRow[] {
    const dir = this.sortDir === 'asc' ? 1 : -1;
    return [...this.rows].sort((a, b) => {
      const av = a[this.sortKey];
      const bv = b[this.sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' }) * dir;
    });
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): VisitingSlotRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('100px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(200px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): VisitingSlotColumnDef[] {
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
    return this.rows.length === 0
      ? 'No visiting slots yet. Create your first visiting slot.'
      : 'No visiting slots to display.';
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Visiting Slot' : 'Edit Visiting Slot';
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
      visible: c.key === 'name' || c.key === 'actions',
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
    this.draft = { ...EMPTY_VISITING_SLOT };
    this.modalOpen = true;
  }

  openEdit(row: VisitingSlotRow): void {
    this.editingId = row.id;
    this.draft = { name: row.name };
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
        },
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId ? { ...r, name: this.draft.name.trim() } : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: VisitingSlotRow): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
