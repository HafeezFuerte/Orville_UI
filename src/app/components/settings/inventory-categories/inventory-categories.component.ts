import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  DEFAULT_INVENTORY_CATEGORIES,
  EMPTY_INVENTORY_CATEGORY,
  InventoryCategory,
  InventoryCategoryColumnDef,
  InventoryCategoryDraft,
} from './inventory-categories.data';

@Component({
  selector: 'app-inventory-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './inventory-categories.component.html',
  styleUrl: './inventory-categories.component.scss',
})
export class InventoryCategoriesComponent {
  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;

  pageSize = 10;
  pageIndex = 0;

  draft: InventoryCategoryDraft = { ...EMPTY_INVENTORY_CATEGORY };

  rows: InventoryCategory[] = DEFAULT_INVENTORY_CATEGORIES.map((r) => ({ ...r }));

  columns: InventoryCategoryColumnDef[] = [
    { key: 'name', label: 'Category/Subcategory', visible: true },
    { key: 'itemCount', label: 'Inventory Categories', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = 100;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): InventoryCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter((row) => row.name.toLowerCase().includes(q));
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

  get pagedRows(): InventoryCategory[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('name')) {
      parts.push('minmax(200px, 1.6fr)');
    }
    if (this.isColumnVisible('itemCount')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): InventoryCategoryColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get parentOptions(): InventoryCategory[] {
    return this.rows.filter((r) => r.parentId == null && r.id !== this.editingId);
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Inventory Category' : 'Edit Inventory Category';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a new inventory category for your company.'
      : 'Update this inventory category.';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  parentName(parentId: number | null): string | null {
    if (parentId == null) {
      return null;
    }
    return this.rows.find((r) => r.id === parentId)?.name ?? null;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
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
    this.draft = { ...EMPTY_INVENTORY_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: InventoryCategory): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      parentId: row.parentId,
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
          parentId: this.draft.parentId,
          itemCount: 0,
        },
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name: this.draft.name.trim(),
              parentId: this.draft.parentId,
            }
          : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: InventoryCategory): void {
    this.rows = this.rows.filter((r) => r.id !== row.id && r.parentId !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
