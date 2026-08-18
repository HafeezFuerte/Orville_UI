import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import {
  EXPENSE_ACCOUNTS,
  EXPENSE_BANKS,
  EXPENSE_LINE_STATUSES,
  EXPENSE_MONEY_HELD_BY,
  EXPENSE_PAYMENT_VIA,
  EXPENSE_PROPERTIES,
  EXPENSE_TAX_PROFILES,
  EXPENSE_TYPES,
  EXPENSE_UNITS,
  EXPENSE_VENDORS,
  ExpenseCheque,
  ExpenseLineItem,
  INITIAL_EXPENSE_CHEQUES,
  INITIAL_EXPENSE_LINES
} from './add-expense.data';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, FlatpickrModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent {
  vendors = EXPENSE_VENDORS;
  properties = EXPENSE_PROPERTIES;
  units = EXPENSE_UNITS;
  paymentViaOptions = EXPENSE_PAYMENT_VIA;
  types = EXPENSE_TYPES;
  accounts = EXPENSE_ACCOUNTS;
  lineStatuses = EXPENSE_LINE_STATUSES;
  taxProfiles = EXPENSE_TAX_PROFILES;
  banks = EXPENSE_BANKS;
  moneyHeldByOptions = EXPENSE_MONEY_HELD_BY;

  billedFrom = '';
  property = '';
  unit = '';
  paymentVia = 'Cheque';
  commonArea = '';
  type = 'Bill';
  invoiceNumber = 'INV-24-000868';
  issueDate = '';
  dueDate = '';
  reference = 'PO#253';
  notes = '';

  lineItems: ExpenseLineItem[] = [...INITIAL_EXPENSE_LINES];
  cheques: ExpenseCheque[] = [...INITIAL_EXPENSE_CHEQUES];

  lineModalOpen = false;
  chequeModalOpen = false;
  editingLineIndex: number | null = null;
  editingChequeIndex: number | null = null;
  inclusiveTaxChecked = true;

  lineDraft: ExpenseLineItem = this.emptyLine();
  chequeDraft: ExpenseCheque = this.emptyCheque();

  constructor(private router: Router) {}

  get lineTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + this.rowTotal(row), 0);
  }

  get taxTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + row.tax, 0);
  }

  get discountTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + row.discount, 0);
  }

  get paidTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + row.paid, 0);
  }

  get dueTotal(): number {
    return this.lineTotal - this.paidTotal;
  }

  get subtotal(): number {
    return this.lineTotal - this.taxTotal + this.discountTotal;
  }

  rowTotal(row: ExpenseLineItem): number {
    return row.price + row.tax - row.discount;
  }

  rowBalance(row: ExpenseLineItem): number {
    return this.rowTotal(row) - row.paid;
  }

  formatAed(value: number): string {
    return `AED ${value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  goBack(): void {
    void this.router.navigate(['/accounting/expenses']);
  }

  openLineModal(index?: number): void {
    if (index != null) {
      this.editingLineIndex = index;
      this.lineDraft = { ...this.lineItems[index] };
      this.inclusiveTaxChecked = this.lineDraft.inclusiveTax === 'Yes';
    } else {
      this.editingLineIndex = null;
      this.lineDraft = this.emptyLine();
      this.inclusiveTaxChecked = true;
    }
    this.lineModalOpen = true;
  }

  closeLineModal(): void {
    this.lineModalOpen = false;
    this.editingLineIndex = null;
  }

  saveLineItem(): void {
    const row = { ...this.lineDraft };
    row.inclusiveTax = this.inclusiveTaxChecked ? 'Yes' : 'No';
    row.tax = this.computeTax(row.price, row.taxProfile, this.inclusiveTaxChecked);
    if (row.price > 0 && row.discount > 0) {
      row.discountPct = Math.round((row.discount / row.price) * 1000) / 10;
    }
    if (!row.description.trim()) {
      return;
    }
    if (this.editingLineIndex != null) {
      this.lineItems[this.editingLineIndex] = row;
    } else {
      this.lineItems = [...this.lineItems, row];
    }
    this.closeLineModal();
  }

  removeLine(index: number): void {
    this.lineItems = this.lineItems.filter((_, i) => i !== index);
  }

  openChequeModal(index?: number): void {
    if (index != null) {
      this.editingChequeIndex = index;
      this.chequeDraft = { ...this.cheques[index] };
    } else {
      this.editingChequeIndex = null;
      this.chequeDraft = this.emptyCheque();
    }
    this.chequeModalOpen = true;
  }

  closeChequeModal(): void {
    this.chequeModalOpen = false;
    this.editingChequeIndex = null;
  }

  saveCheque(): void {
    const row = { ...this.chequeDraft };
    if (!row.chequeNo.trim() || !row.bankName) {
      return;
    }
    if (!row.inHand) {
      row.inHand = 'Deposited';
    }
    if (this.editingChequeIndex != null) {
      this.cheques[this.editingChequeIndex] = row;
    } else {
      this.cheques = [...this.cheques, row];
    }
    this.closeChequeModal();
  }

  removeCheque(index: number): void {
    this.cheques = this.cheques.filter((_, i) => i !== index);
  }

  onChequeFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.chequeDraft.attachment = file.name;
    }
  }

  private computeTax(price: number, profile: string, inclusive: boolean): number {
    if (profile !== '5% VAT' || !price) {
      return 0;
    }
    if (inclusive) {
      return Math.round(((price * 5) / 105) * 100) / 100;
    }
    return Math.round(price * 0.05 * 100) / 100;
  }

  private emptyLine(): ExpenseLineItem {
    return {
      id: String(400000 + (Date.now() % 100000)),
      inclusiveTax: 'Yes',
      description: '',
      price: 0,
      tax: 0,
      taxProfile: '5% VAT',
      discount: 0,
      discountPct: 0,
      paid: 0,
      account: '',
      status: 'Draft'
    };
  }

  private emptyCheque(): ExpenseCheque {
    return {
      id: String(400000 + (Date.now() % 100000)),
      chequeNo: '',
      bankName: '',
      chequeDate: '',
      amount: 0,
      inHand: 'Deposited',
      moneyHeldBy: 'Company',
      status: 'Pending',
      attachment: ''
    };
  }
}
