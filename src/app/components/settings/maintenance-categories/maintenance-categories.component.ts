import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  DEFAULT_MAINTENANCE_CATEGORIES,
  EMPTY_MAINTENANCE_CATEGORY,
  MAINTENANCE_CATEGORY_ICONS,
  MAINTENANCE_CATEGORY_TYPES,
  MaintenanceCategory,
  MaintenanceCategoryColumnDef,
  MaintenanceCategoryDraft,
  MaintenanceCategoryIcon,
} from './maintenance-categories.data';

@Component({
  selector: 'app-maintenance-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent],
  templateUrl: './maintenance-categories.component.html',
  styleUrl: './maintenance-categories.component.scss',
})
export class MaintenanceCategoriesComponent {
  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;

  pageSize = 10;
  pageIndex = 0;

  draft: MaintenanceCategoryDraft = { ...EMPTY_MAINTENANCE_CATEGORY };

  rows: MaintenanceCategory[] = DEFAULT_MAINTENANCE_CATEGORIES.map((r) => ({ ...r }));

  readonly categoryTypes = MAINTENANCE_CATEGORY_TYPES;
  readonly iconOptions = MAINTENANCE_CATEGORY_ICONS;

  columns: MaintenanceCategoryColumnDef[] = [
    { key: 'icon', label: 'Icon', visible: true },
    { key: 'name', label: 'Category / Subcategory', visible: true },
    { key: 'categoryType', label: 'Category Type', visible: true },
    { key: 'workOrders', label: 'Work Orders', visible: true },
    { key: 'avgCompletionTime', label: 'Avg Completion Time', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = 100;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): MaintenanceCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) || row.categoryType.toLowerCase().includes(q)
    );
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize));
  }

  get rangeStart(): number {
    if (this.totalFiltered === 0) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalFiltered);
  }

  get pagedRows(): MaintenanceCategory[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get visibleColumnCount(): number {
    return this.columns.filter((c) => c.visible).length;
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('icon')) {
      parts.push('56px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(180px, 1.6fr)');
    }
    if (this.isColumnVisible('categoryType')) {
      parts.push('minmax(120px, 1fr)');
    }
    if (this.isColumnVisible('workOrders')) {
      parts.push('110px');
    }
    if (this.isColumnVisible('avgCompletionTime')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): MaintenanceCategoryColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get parentOptions(): MaintenanceCategory[] {
    return this.rows.filter((r) => r.parentId == null && r.id !== this.editingId);
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Maintenance Category' : 'Edit Maintenance Category';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0 && this.draft.categoryType.trim().length > 0;
  }

  iconSrc(icon: MaintenanceCategoryIcon): string {
    return (
      this.iconOptions.find((o) => o.value === icon)?.src ??
      './assets/images/settings/screwdriver-wrench.svg'
    );
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
    this.draft = { ...EMPTY_MAINTENANCE_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: MaintenanceCategory): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      categoryType: row.categoryType,
      parentId: row.parentId,
      icon: row.icon,
      helpText: row.helpText,
      avgHours: row.avgHours,
      avgMinutes: row.avgMinutes,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  formatAvgTime(hours: string, minutes: string): string | null {
    const h = (hours || '00').padStart(2, '0');
    const m = (minutes || '00').padStart(2, '0');
    if (h === '00' && m === '00') {
      return null;
    }
    return `${h}:${m} Hours`;
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    const avg = this.formatAvgTime(this.draft.avgHours, this.draft.avgMinutes);
    const icon: MaintenanceCategoryIcon =
      this.draft.icon || ('wrench' as MaintenanceCategoryIcon);

    if (this.editingId == null) {
      this.rows = [
        ...this.rows,
        {
          id: this.nextId++,
          name: this.draft.name.trim(),
          isGlobal: false,
          categoryType: this.draft.categoryType,
          workOrders: 0,
          avgCompletionTime: avg,
          icon,
          parentId: this.draft.parentId,
          helpText: this.draft.helpText.trim(),
          avgHours: (this.draft.avgHours || '00').padStart(2, '0'),
          avgMinutes: (this.draft.avgMinutes || '00').padStart(2, '0'),
        },
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name: this.draft.name.trim(),
              categoryType: this.draft.categoryType,
              parentId: this.draft.parentId,
              icon,
              helpText: this.draft.helpText.trim(),
              avgHours: (this.draft.avgHours || '00').padStart(2, '0'),
              avgMinutes: (this.draft.avgMinutes || '00').padStart(2, '0'),
              avgCompletionTime: avg,
            }
          : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: MaintenanceCategory): void {
    this.rows = this.rows.filter((r) => r.id !== row.id && r.parentId !== row.id);
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }
}
