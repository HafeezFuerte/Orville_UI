import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlowbiteDatepickerDirective } from '../../../shared/directives/flowbite-datepicker.directive';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  CREDIT_NOTE_ACCOUNTS,
  CREDIT_NOTE_ROWS,
  CREDIT_NOTE_TENANTS,
  CreditNoteRow
} from './credit-notes.data';

@Component({
  selector: 'app-credit-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    FlowbiteDatepickerDirective,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './credit-notes.component.html',
  styleUrl: './credit-notes.component.scss'
})
export class CreditNotesComponent {
  searchQuery = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;
  modalOpen = false;
  editingId: string | null = null;

  filterContact = '';
  filterAccount = '';
  filterCreatedBy = '';

  tenants = CREDIT_NOTE_TENANTS;
  accounts = CREDIT_NOTE_ACCOUNTS;

  pageIndex = 0;
  pageSize = 5;
  allRows: CreditNoteRow[] = [...CREDIT_NOTE_ROWS];

  draft = this.emptyDraft();

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'contact', label: 'Contact', visible: true },
    { key: 'account', label: 'Account', visible: true },
    { key: 'amount', label: 'Amount', visible: true },
    { key: 'remainingCredit', label: 'Remaining Credit', visible: true, useTemplate: true },
    { key: 'notes', label: 'Notes', visible: true },
    { key: 'createdBy', label: 'Created By', visible: true },
    { key: 'created', label: 'Created', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): CreditNoteRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.filterContact && !row.contact.toLowerCase().includes(this.filterContact.toLowerCase())) {
        return false;
      }
      if (this.filterAccount && !row.account.toLowerCase().includes(this.filterAccount.toLowerCase())) {
        return false;
      }
      if (this.filterCreatedBy && !row.createdBy.toLowerCase().includes(this.filterCreatedBy.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.includes(q) ||
        row.contact.toLowerCase().includes(q) ||
        row.account.toLowerCase().includes(q) ||
        row.notes.toLowerCase().includes(q) ||
        row.createdBy.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): CreditNoteRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    if (!this.totalRecords) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalRecords);
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  get modalTitle(): string {
    return this.editingId ? 'Credit Note' : 'Credit Note';
  }

  get modalSub(): string {
    return this.editingId ? 'Edit an existing credit note.' : 'Issue a new credit note';
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterContact = '';
    this.filterAccount = '';
    this.filterCreatedBy = '';
    this.pageIndex = 0;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => (col.visible = checked));
  }

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.openActionId = this.openActionId === id ? null : id;
  }

  openCreateModal(): void {
    this.editingId = null;
    this.draft = this.emptyDraft();
    this.modalOpen = true;
    this.openActionId = null;
  }

  openEditModal(row: CreditNoteRow): void {
    this.editingId = row.id;
    this.draft = {
      tenant: row.contact,
      account: row.account,
      amount: this.parseAmount(row.amount),
      noteDate: row.date,
      note: row.notes
    };
    this.modalOpen = true;
    this.openActionId = null;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingId = null;
  }

  saveCreditNote(): void {
    if (!this.draft.tenant || this.draft.amount == null) {
      return;
    }
    const amountLabel = this.formatAed(Number(this.draft.amount) || 0);
    const dateLabel = this.draft.noteDate || this.todayLabel();
    if (this.editingId) {
      this.allRows = this.allRows.map((row) =>
        row.id === this.editingId
          ? {
              ...row,
              date: dateLabel,
              contact: this.draft.tenant,
              account: this.draft.account,
              amount: amountLabel,
              notes: this.draft.note
            }
          : row
      );
    } else {
      const row: CreditNoteRow = {
        id: String(1817900 + (Date.now() % 10000)),
        date: dateLabel,
        contact: this.draft.tenant,
        account: this.draft.account,
        amount: amountLabel,
        remainingCredit: amountLabel,
        notes: this.draft.note,
        createdBy: 'Manager',
        created: this.todayLabel()
      };
      this.allRows = [row, ...this.allRows];
    }
    this.closeModal();
    this.pageIndex = 0;
  }

  deleteCreditNote(id: string): void {
    this.allRows = this.allRows.filter((row) => row.id !== id);
    this.openActionId = null;
    if (this.pageIndex >= this.totalPages) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex++;
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages) {
      this.pageIndex = target;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionId = null;
  }

  private emptyDraft() {
    return {
      tenant: '',
      account: '',
      amount: 0,
      noteDate: '',
      note: ''
    };
  }

  private formatAed(value: number): string {
    return `AED ${value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private parseAmount(value: string): number {
    return Number(String(value).replace(/[^\d.]/g, '')) || 0;
  }

  private todayLabel(): string {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `${dd}-${mm}-${now.getFullYear()}`;
  }
}
