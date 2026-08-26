import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_TICKET_CATEGORIES,
  DEFAULT_TICKETS_SETTINGS,
  EMPTY_TICKET_CATEGORY,
  TICKET_DEPARTMENTS,
  TicketCategory,
  TicketCategoryColumnDef,
  TicketCategoryDraft,
  TicketDepartmentOption,
  TicketsSettingsModel,
} from './tickets-settings.data';

@Component({
  selector: 'app-tickets-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets-settings.component.html',
  styleUrl: './tickets-settings.component.scss',
})
export class TicketsSettingsComponent {
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;
  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  model: TicketsSettingsModel = { ...DEFAULT_TICKETS_SETTINGS };
  draft: TicketCategoryDraft = { ...EMPTY_TICKET_CATEGORY };
  rows: TicketCategory[] = DEFAULT_TICKET_CATEGORIES.map((r) => ({ ...r }));

  readonly departments: TicketDepartmentOption[] = TICKET_DEPARTMENTS;

  columns: TicketCategoryColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Category / Subcategory', visible: true },
    { key: 'ticketCount', label: 'Tickets', visible: true },
    { key: 'department', label: 'Department', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = 1000;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('72px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(180px, 1.6fr)');
    }
    if (this.isColumnVisible('ticketCount')) {
      parts.push('100px');
    }
    if (this.isColumnVisible('department')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): TicketCategoryColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get parentOptions(): TicketCategory[] {
    return this.rows.filter((r) => r.parentId == null && r.id !== this.editingId);
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Ticket Category' : 'Edit Ticket Category';
  }

  get canSaveCategory(): boolean {
    return this.draft.name.trim().length > 0;
  }

  departmentName(id: string): string {
    return this.departments.find((d) => d.id === id)?.name || '—';
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
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
    this.draft = { ...EMPTY_TICKET_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: TicketCategory): void {
    if (row.isGlobal) {
      return;
    }
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      parentId: row.parentId,
      departmentId: row.departmentId,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveCategory(): void {
    if (!this.canSaveCategory) {
      return;
    }
    if (this.editingId == null) {
      this.rows = [
        {
          id: this.nextId++,
          name: this.draft.name.trim(),
          isGlobal: false,
          ticketCount: 0,
          departmentId: this.draft.departmentId,
          parentId: this.draft.parentId,
        },
        ...this.rows,
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name: this.draft.name.trim(),
              parentId: this.draft.parentId,
              departmentId: this.draft.departmentId,
            }
          : r
      );
    }
    this.modalOpen = false;
  }

  deleteRow(row: TicketCategory): void {
    if (row.isGlobal) {
      return;
    }
    this.rows = this.rows.filter((r) => r.id !== row.id && r.parentId !== row.id);
  }

  saveSettings(): void {
    this.saved = true;
    if (this.savedTimer) {
      clearTimeout(this.savedTimer);
    }
    this.savedTimer = setTimeout(() => {
      this.saved = false;
    }, 2500);
  }
}
