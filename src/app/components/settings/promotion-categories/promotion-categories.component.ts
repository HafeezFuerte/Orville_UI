import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  DEFAULT_PROMOTION_CATEGORIES,
  EMPTY_PROMOTION_CATEGORY,
  PromotionCategory,
  PromotionCategoryColumnDef,
  PromotionCategoryDraft,
} from './promotion-categories.data';

type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-promotion-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './promotion-categories.component.html',
  styleUrl: './promotion-categories.component.scss',
})
export class PromotionCategoriesComponent {
  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;

  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: PromotionCategoryDraft = { ...EMPTY_PROMOTION_CATEGORY };

  rows: PromotionCategory[] = DEFAULT_PROMOTION_CATEGORIES.map((r) => ({ ...r }));

  columns: PromotionCategoryColumnDef[] = [
    { key: 'name', label: 'Name', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): PromotionCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = !q
      ? [...this.rows]
      : this.rows.filter((row) => row.name.toLowerCase().includes(q));

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => a.name.localeCompare(b.name) * dir);
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

  get pagedRows(): PromotionCategory[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('name')) {
      parts.push('minmax(200px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): PromotionCategoryColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Promotion Category' : 'Edit Promotion Category';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a new promotion category for your company.'
      : 'Update this promotion category.';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  toggleSort(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
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
    this.draft = { ...EMPTY_PROMOTION_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: PromotionCategory): void {
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

  deleteRow(row: PromotionCategory): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
