import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  DEFAULT_EMAIL_TEMPLATES,
  EMAIL_TEMPLATE_TARGETS,
  EmailTemplateColumnDef,
  EmailTemplateRow,
  EmailTemplateTarget,
} from './email-templates.data';

type TargetFilter = 'all' | EmailTemplateTarget;
type SortKey = 'name' | 'description' | 'target';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-email-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './email-templates.component.html',
  styleUrl: './email-templates.component.scss',
})
export class EmailTemplatesComponent {
  searchQuery = '';
  columnSearch = '';
  targetFilter: TargetFilter = 'all';
  showColumns = false;
  openMenuId: number | null = null;
  previewOpen = false;
  previewRow: EmailTemplateRow | null = null;

  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  rows: EmailTemplateRow[] = DEFAULT_EMAIL_TEMPLATES.map((r) => ({ ...r }));

  readonly targets = EMAIL_TEMPLATE_TARGETS;

  columns: EmailTemplateColumnDef[] = [
    { key: 'name', label: 'Name', visible: true },
    { key: 'description', label: 'Description', visible: true },
    { key: 'target', label: 'Target', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get totalCount(): number {
    return this.rows.length;
  }

  get targetTabs(): { id: TargetFilter; label: string; count?: number }[] {
    return [
      { id: 'all', label: 'All' },
      ...this.targets.map((t) => ({
        id: t as TargetFilter,
        label: t,
        count: this.rows.filter((r) => r.target === t).length,
      })),
    ];
  }

  get filteredRows(): EmailTemplateRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (this.targetFilter !== 'all' && row.target !== this.targetFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.target.toLowerCase().includes(q)
      );
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = String(a[this.sortKey] || '');
      const bv = String(b[this.sortKey] || '');
      return av.localeCompare(bv, undefined, { sensitivity: 'base' }) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get pagedRows(): EmailTemplateRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('name')) {
      parts.push('minmax(220px, 1.4fr)');
    }
    if (this.isColumnVisible('description')) {
      parts.push('minmax(160px, 1fr)');
    }
    if (this.isColumnVisible('target')) {
      parts.push('minmax(140px, 0.8fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('72px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): EmailTemplateColumnDef[] {
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
    return 'No email templates match your filters.';
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  descriptionDisplay(value: string): string {
    return value.trim() ? value : '—';
  }

  setTargetFilter(id: TargetFilter): void {
    this.targetFilter = id;
    this.pageIndex = 0;
    this.openMenuId = null;
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
    this.openMenuId = null;
  }

  toggleColumns(): void {
    this.showColumns = !this.showColumns;
    if (this.showColumns) {
      this.columnSearch = '';
      this.openMenuId = null;
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

  toggleRowMenu(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.showColumns = false;
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  openPreview(row: EmailTemplateRow): void {
    this.previewRow = row;
    this.previewOpen = true;
    this.openMenuId = null;
  }

  closePreview(): void {
    this.previewOpen = false;
    this.previewRow = null;
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
    if (this.openMenuId != null) {
      const root = this.host.nativeElement.querySelector(`[data-row-menu="${this.openMenuId}"]`);
      if (root && target && !root.contains(target)) {
        this.openMenuId = null;
      }
    }
  }
}
