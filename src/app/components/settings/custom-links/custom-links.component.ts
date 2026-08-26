import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  CustomLinkColumnDef,
  CustomLinkDraft,
  CustomLinkRow,
  DEFAULT_CUSTOM_LINKS,
  EMPTY_CUSTOM_LINK,
  formatShareWith,
} from './custom-links.data';

type SortKey = 'id' | 'name' | 'url' | 'updatedAt';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-custom-links',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './custom-links.component.html',
  styleUrl: './custom-links.component.scss',
})
export class CustomLinksComponent {
  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;

  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: CustomLinkDraft = { ...EMPTY_CUSTOM_LINK };
  rows: CustomLinkRow[] = DEFAULT_CUSTOM_LINKS.map((r) => ({ ...r }));

  columns: CustomLinkColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'link', label: 'Link', visible: true },
    { key: 'shareWith', label: 'Share With', visible: true },
    { key: 'updated', label: 'Updated', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get totalCount(): number {
    return this.rows.length;
  }

  get filteredRows(): CustomLinkRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.url.toLowerCase().includes(q) ||
        formatShareWith(row).toLowerCase().includes(q) ||
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
      return String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' }) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): CustomLinkRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('72px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('link')) {
      parts.push('minmax(180px, 1.4fr)');
    }
    if (this.isColumnVisible('shareWith')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('updated')) {
      parts.push('120px');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): CustomLinkColumnDef[] {
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
      return 'No custom links yet. Create your first custom link to start sharing resources with tenants, landlords, and vendors.';
    }
    return 'No custom links match your search.';
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Custom Link' : 'Edit Custom Link';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0 && this.draft.url.trim().length > 0;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  shareWithLabel(row: CustomLinkRow): string {
    return formatShareWith(row);
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
    this.draft = { ...EMPTY_CUSTOM_LINK };
    this.modalOpen = true;
  }

  openEdit(row: CustomLinkRow): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      url: row.url,
      shareWithTenants: row.shareWithTenants,
      shareWithLandlords: row.shareWithLandlords,
      shareWithVendors: row.shareWithVendors,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  private todayLabel(): string {
    const d = new Date();
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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
          url: this.draft.url.trim(),
          shareWithTenants: this.draft.shareWithTenants,
          shareWithLandlords: this.draft.shareWithLandlords,
          shareWithVendors: this.draft.shareWithVendors,
          updatedAt: this.todayLabel(),
        },
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name: this.draft.name.trim(),
              url: this.draft.url.trim(),
              shareWithTenants: this.draft.shareWithTenants,
              shareWithLandlords: this.draft.shareWithLandlords,
              shareWithVendors: this.draft.shareWithVendors,
              updatedAt: this.todayLabel(),
            }
          : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: CustomLinkRow): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
