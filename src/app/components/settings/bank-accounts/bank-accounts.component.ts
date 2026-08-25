import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  BANK_CURRENCY_OPTIONS,
  BankAccount,
  BankAccountType,
  BankColumnDef,
  DEFAULT_BANK_ACCOUNTS,
  EMPTY_BANK_ACCOUNT,
} from './bank-accounts.data';

@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-accounts.component.html',
  styleUrl: './bank-accounts.component.scss',
})
export class BankAccountsComponent {
  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;

  draft: Omit<BankAccount, 'id'> = { ...EMPTY_BANK_ACCOUNT };

  rows: BankAccount[] = DEFAULT_BANK_ACCOUNTS.map((r) => ({ ...r }));

  readonly currencies = BANK_CURRENCY_OPTIONS;
  readonly accountTypes = BANK_ACCOUNT_TYPE_OPTIONS;

  columns: BankColumnDef[] = [
    { key: 'bankName', label: 'Bank Name', visible: true },
    { key: 'currency', label: 'Currency', visible: true },
    { key: 'accountType', label: 'Account Type', visible: true },
    { key: 'accountNumber', label: 'Account Number', visible: true },
    { key: 'iban', label: 'IBAN', visible: true },
    { key: 'swift', label: 'SWIFT', visible: true },
    { key: 'primary', label: 'Primary', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private nextId = 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get filteredRows(): BankAccount[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter(
      (row) =>
        row.bankName.toLowerCase().includes(q) ||
        row.accountTitle.toLowerCase().includes(q) ||
        row.accountNumber.toLowerCase().includes(q) ||
        row.iban.toLowerCase().includes(q) ||
        row.swiftCode.toLowerCase().includes(q)
    );
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get visibleColumnCount(): number {
    return this.columns.filter((c) => c.visible).length;
  }

  /** Shared grid so header + body columns stay aligned when toggled. */
  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('bankName')) {
      parts.push('minmax(140px, 1.3fr)');
    }
    if (this.isColumnVisible('currency')) {
      parts.push('88px');
    }
    if (this.isColumnVisible('accountType')) {
      parts.push('minmax(120px, 1fr)');
    }
    if (this.isColumnVisible('accountNumber')) {
      parts.push('minmax(110px, 1fr)');
    }
    if (this.isColumnVisible('iban')) {
      parts.push('minmax(110px, 1fr)');
    }
    if (this.isColumnVisible('swift')) {
      parts.push('96px');
    }
    if (this.isColumnVisible('primary')) {
      parts.push('96px');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('104px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): BankColumnDef[] {
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
    return this.editingId == null ? 'Add Bank Account' : 'Edit Bank Account';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Add a bank account for payments and collections.'
      : 'Update this bank account configuration.';
  }

  get canSave(): boolean {
    return (
      this.draft.bankName.trim().length > 0 &&
      this.draft.accountTitle.trim().length > 0 &&
      this.draft.accountNumber.trim().length > 0
    );
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
      visible: c.key === 'bankName' || c.key === 'actions',
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
    this.draft = { ...EMPTY_BANK_ACCOUNT };
    this.modalOpen = true;
  }

  openEdit(row: BankAccount): void {
    this.editingId = row.id;
    this.draft = {
      bankName: row.bankName,
      accountTitle: row.accountTitle,
      accountNumber: row.accountNumber,
      iban: row.iban,
      swiftCode: row.swiftCode,
      currency: row.currency,
      accountType: row.accountType,
      isPrimary: row.isPrimary,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  shortCurrency(currency: string): string {
    const code = currency.split(' ')[0];
    return code || currency;
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    const payload: Omit<BankAccount, 'id'> = {
      bankName: this.draft.bankName.trim(),
      accountTitle: this.draft.accountTitle.trim(),
      accountNumber: this.draft.accountNumber.trim(),
      iban: this.draft.iban.trim(),
      swiftCode: this.draft.swiftCode.trim(),
      currency: this.draft.currency,
      accountType: this.draft.accountType,
      isPrimary: !!this.draft.isPrimary,
    };

    if (this.editingId == null) {
      const id = this.nextId++;
      let next = [...this.rows, { id, ...payload }];
      if (payload.isPrimary) {
        next = next.map((row) => ({ ...row, isPrimary: row.id === id }));
      }
      this.rows = next;
    } else {
      let next = this.rows.map((row) =>
        row.id === this.editingId ? { ...row, ...payload } : row
      );
      if (payload.isPrimary) {
        next = next.map((row) => ({
          ...row,
          isPrimary: row.id === this.editingId,
        }));
      }
      this.rows = next;
    }
    this.closeModal();
  }

  deleteAccount(row: BankAccount): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
  }

  setPrimary(row: BankAccount): void {
    this.rows = this.rows.map((r) => ({
      ...r,
      isPrimary: r.id === row.id,
    }));
  }

  onAccountTypeChange(type: BankAccountType): void {
    this.draft.accountType = type;
  }
}
