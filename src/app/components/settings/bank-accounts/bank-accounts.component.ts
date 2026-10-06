import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
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
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './bank-accounts.component.html',
  styleUrl: './bank-accounts.component.scss',
})
export class BankAccountsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;
  isLoading = false;

  draft: Omit<BankAccount, 'id'> = { ...EMPTY_BANK_ACCOUNT };
  rows: BankAccount[] = [];

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

  ngOnInit(): void {
    this.fetchAccounts();
  }

  // API Call: Fetch Accounts (TypeId: 2, FilterId: 1005, FilterText: "bank_accounts")
  fetchAccounts(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'bank_accounts',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200' && res.objResult) {
          const records = res.objResult.table || res.objResult.table0 || res.objResult;
          if (Array.isArray(records) && records.length > 0) {
            const row = records[0];
            if (row.strValue) {
              try {
                const parsed = JSON.parse(row.strValue);
                if (Array.isArray(parsed)) {
                  this.rows = parsed;
                  const maxId = this.rows.reduce((max, r) => (r.id > max ? r.id : max), 0);
                  this.nextId = maxId + 1;
                  return;
                }
              } catch (e) {
                console.error('Failed to parse bank_accounts strValue:', e);
              }
            }
          }
        }
        // Fallback default bank accounts if no backend record found
        this.rows = DEFAULT_BANK_ACCOUNTS.map((r) => ({ ...r }));
        this.nextId = this.rows.length + 1;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load bank accounts', 'Error');
        console.error('Error fetching bank accounts:', err);
      },
    });
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

    let updatedRows: BankAccount[];
    if (this.editingId == null) {
      const id = this.nextId++;
      updatedRows = [...this.rows, { id, ...payload }];
      if (payload.isPrimary) {
        updatedRows = updatedRows.map((row) => ({ ...row, isPrimary: row.id === id }));
      }
    } else {
      updatedRows = this.rows.map((row) =>
        row.id === this.editingId ? { ...row, ...payload } : row
      );
      if (payload.isPrimary) {
        updatedRows = updatedRows.map((row) => ({
          ...row,
          isPrimary: row.id === this.editingId,
        }));
      }
    }
    this.closeModal();
    this.saveAccountsBackend(updatedRows);
  }

  deleteAccount(row: BankAccount): void {
    const updatedRows = this.rows.filter((r) => r.id !== row.id);
    this.saveAccountsBackend(updatedRows);
  }

  setPrimary(row: BankAccount): void {
    const updatedRows = this.rows.map((r) => ({
      ...r,
      isPrimary: r.id === row.id,
    }));
    this.saveAccountsBackend(updatedRows);
  }

  onAccountTypeChange(type: BankAccountType): void {
    this.draft.accountType = type;
  }

  // API Call: Save / Update Bank Accounts (TypeId: 90, FilterId: 1005, FilterText: "bank_accounts")
  private saveAccountsBackend(rowsToSave: BankAccount[]): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'bank_accounts',
      filterText1: JSON.stringify(rowsToSave),
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200') {
          this.toastr.success('Bank accounts updated successfully!', 'Success');
          this.fetchAccounts();
        } else {
          this.toastr.error(res?.message || 'Failed to update bank accounts', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to update bank accounts', 'Error');
        console.error('Save bank accounts error:', err);
      },
    });
  }
}

