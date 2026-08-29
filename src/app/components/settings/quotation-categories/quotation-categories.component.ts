import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  DEFAULT_QUOTATION_CATEGORIES,
  EMPTY_QUOTATION_CATEGORY,
  QuotationCategory,
  QuotationCategoryColumnDef,
  QuotationCategoryDraft,
} from './quotation-categories.data';

type SortKey = 'id' | 'name' | 'helpText' | 'isAdmin';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-quotation-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './quotation-categories.component.html',
  styleUrl: './quotation-categories.component.scss',
})
export class QuotationCategoriesComponent {
  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;

  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';

  pageSize = 10;
  pageIndex = 0;

  draft: QuotationCategoryDraft = { ...EMPTY_QUOTATION_CATEGORY };

  rows: QuotationCategory[] = DEFAULT_QUOTATION_CATEGORIES.map((r) => ({ ...r }));

  columns: QuotationCategoryColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'helpText', label: 'Help Text', visible: true },
    { key: 'isAdmin', label: 'Admin', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): QuotationCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = !q
      ? [...this.rows]
      : this.rows.filter(
          (row) =>
            row.name.toLowerCase().includes(q) ||
            row.helpText.toLowerCase().includes(q) ||
            String(row.id).includes(q)
        );

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      const av = a[this.sortKey];
      const bv = b[this.sortKey];
      if (typeof av === 'boolean' && typeof bv === 'boolean') {
        return (Number(av) - Number(bv)) * dir;
      }
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

  get pagedRows(): QuotationCategory[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get visibleColumnCount(): number {
    return this.columns.filter((c) => c.visible).length;
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('72px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(160px, 1.4fr)');
    }
    if (this.isColumnVisible('helpText')) {
      parts.push('minmax(180px, 1.6fr)');
    }
    if (this.isColumnVisible('isAdmin')) {
      parts.push('100px');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): QuotationCategoryColumnDef[] {
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
    return this.editingId == null ? 'New Quotation Category' : 'Edit Quotation Category';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a new quotation category for your company.'
      : 'Update this quotation category.';
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
    this.draft = { ...EMPTY_QUOTATION_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: QuotationCategory): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      helpText: row.helpText,
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
          helpText: this.draft.helpText.trim(),
          isAdmin: false,
        },
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name: this.draft.name.trim(),
              helpText: this.draft.helpText.trim(),
            }
          : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: QuotationCategory): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
