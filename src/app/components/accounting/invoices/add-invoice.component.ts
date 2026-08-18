import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import {
  BANKS,
  CHEQUE_IN_HAND,
  CHEQUE_STATUSES,
  INVOICE_ACCOUNTS,
  INVOICE_CUSTOMERS,
  INVOICE_LEASES,
  INVOICE_LINE_STATUSES,
  INVOICE_MONEY_HELD_BY,
  INVOICE_PAYMENT_VIA,
  INVOICE_TYPES,
  INITIAL_CHEQUES,
  INITIAL_LINE_ITEMS,
  InvoiceCheque,
  InvoiceLineItem
} from './add-invoice.data';

@Component({
  selector: 'app-add-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, FlatpickrModule],
  templateUrl: './add-invoice.component.html',
  styleUrl: './add-invoice.component.scss'
})
export class AddInvoiceComponent {
  customers = INVOICE_CUSTOMERS;
  leases = INVOICE_LEASES;
  paymentViaOptions = INVOICE_PAYMENT_VIA;
  moneyHeldByOptions = INVOICE_MONEY_HELD_BY;
  types = INVOICE_TYPES;
  accounts = INVOICE_ACCOUNTS;
  lineStatuses = INVOICE_LINE_STATUSES;
  chequeStatuses = CHEQUE_STATUSES;
  chequeInHandOptions = CHEQUE_IN_HAND;
  banks = BANKS;

  billedTo = '';
  lease = 'Apartment-201-PR-1';
  paymentVia = 'Cheque';
  moneyHeldBy = '';
  type = 'Charge';
  invoiceNumber = 'INV- 26-000658';
  issueDate = '';
  dueDate = '';
  reference = 'PO#253';
  notes = '';

  lineItems: InvoiceLineItem[] = [...INITIAL_LINE_ITEMS];
  cheques: InvoiceCheque[] = [...INITIAL_CHEQUES];

  lineModalOpen = false;
  chequeModalOpen = false;
  editingLineIndex: number | null = null;
  editingChequeIndex: number | null = null;

  lineDraft: InvoiceLineItem = this.emptyLine();
  chequeDraft: InvoiceCheque = this.emptyCheque();

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

  rowTotal(row: InvoiceLineItem): number {
    return row.price + row.tax - row.discount;
  }

  rowBalance(row: InvoiceLineItem): number {
    return this.rowTotal(row) - row.paid;
  }

  formatAed(value: number): string {
    return `AED ${value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  goBack(): void {
    void this.router.navigate(['/accounting/invoices']);
  }

  openLineModal(index?: number): void {
    if (index != null) {
      this.editingLineIndex = index;
      this.lineDraft = { ...this.lineItems[index] };
    } else {
      this.editingLineIndex = null;
      this.lineDraft = this.emptyLine();
    }
    this.lineModalOpen = true;
  }

  closeLineModal(): void {
    this.lineModalOpen = false;
    this.editingLineIndex = null;
  }

  saveLineItem(): void {
    const row = { ...this.lineDraft };
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

  private emptyLine(): InvoiceLineItem {
    return {
      id: String(400000 + Date.now() % 100000),
      inclusiveTax: 'Yes',
      description: '',
      price: 0,
      tax: 0,
      discount: 0,
      discountPct: 0,
      paid: 0,
      account: '',
      status: 'Unpaid'
    };
  }

  private emptyCheque(): InvoiceCheque {
    return {
      id: String(400000 + Date.now() % 100000),
      chequeNo: '',
      bankName: '',
      chequeDate: '',
      amount: 0,
      inHand: 'Yes',
      status: 'Pending',
      attachment: ''
    };
  }
}
