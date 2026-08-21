import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import {
  QUOTATION_DETAIL,
  QUOTATION_FORM_OPTIONS,
  QUOTATION_LINE_ITEMS,
  QuotationLineItem,
  QuotationStatus
} from '../quotations.data';

type DetailTab = 'lineItems' | 'notes' | 'attachments';

@Component({
  selector: 'app-quotation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent],
  templateUrl: './quotation-detail.component.html',
  styleUrl: './quotation-detail.component.scss'
})
export class QuotationDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab: DetailTab = 'lineItems';
  showActionMenu = false;
  showLineItemModal = false;
  editingItem: QuotationLineItem | null = null;

  options = QUOTATION_FORM_OPTIONS;
  quotation = { ...QUOTATION_DETAIL, id: this.route.snapshot.paramMap.get('id') || QUOTATION_DETAIL.id };
  lineItems: QuotationLineItem[] = [...QUOTATION_LINE_ITEMS];

  lineColumns = [
    { key: 'title', label: 'Title', visible: true, useTemplate: true },
    { key: 'quantity', label: 'Qty', visible: true, useTemplate: true },
    { key: 'amountPerItem', label: 'Amount / Item', visible: true, useTemplate: true },
    { key: 'totalAmount', label: 'Total', visible: true, useTemplate: true },
    { key: 'category', label: 'Category', visible: true, useTemplate: true },
    { key: 'taxProfile', label: 'Tax Profile', visible: true, useTemplate: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  modal = {
    title: '',
    quantity: 1,
    amountPerItem: 0,
    category: null as string | null,
    taxProfile: null as string | null,
    description: ''
  };

  get modalTotal(): number {
    return Number((this.modal.quantity * this.modal.amountPerItem).toFixed(2));
  }

  get lineItemsTotal(): number {
    return this.lineItems.reduce((sum, item) => sum + item.totalAmount, 0);
  }

  setTab(tab: DetailTab): void {
    this.activeTab = tab;
    this.showActionMenu = false;
  }

  goBack(): void {
    this.router.navigate(['/facility/quotations']);
  }

  goEdit(): void {
    this.router.navigate(['/facility/quotations/create']);
  }

  statusClass(status: QuotationStatus): string {
    switch (status) {
      case 'Pending':
        return 'qt-chip qt-chip--warning';
      case 'Approved':
        return 'qt-chip qt-chip--success';
      case 'Rejected':
        return 'qt-chip qt-chip--danger';
      case 'Expired':
        return 'qt-chip qt-chip--soft';
      default:
        return 'qt-chip qt-chip--soft';
    }
  }

  openAddLineItem(): void {
    this.editingItem = null;
    this.modal = {
      title: '',
      quantity: 1,
      amountPerItem: 0,
      category: null,
      taxProfile: null,
      description: ''
    };
    this.showLineItemModal = true;
  }

  openEditLineItem(item: QuotationLineItem): void {
    this.editingItem = item;
    this.modal = {
      title: item.title,
      quantity: item.quantity,
      amountPerItem: item.amountPerItem,
      category: item.category,
      taxProfile: item.taxProfile,
      description: item.description
    };
    this.showLineItemModal = true;
  }

  closeLineItemModal(): void {
    this.showLineItemModal = false;
    this.editingItem = null;
  }

  bumpQuantity(delta: number): void {
    this.modal.quantity = Math.max(1, this.modal.quantity + delta);
  }

  saveLineItem(): void {
    const payload: QuotationLineItem = {
      id: this.editingItem?.id || String(Date.now()),
      title: this.modal.title.trim() || 'Untitled item',
      quantity: this.modal.quantity,
      amountPerItem: Number(this.modal.amountPerItem) || 0,
      totalAmount: this.modalTotal,
      category: this.modal.category || '—',
      taxProfile: this.modal.taxProfile || '—',
      description: this.modal.description
    };

    if (this.editingItem) {
      this.lineItems = this.lineItems.map((item) => (item.id === this.editingItem!.id ? payload : item));
    } else {
      this.lineItems = [...this.lineItems, payload];
    }
    this.closeLineItemModal();
  }

  removeLineItem(id: string): void {
    this.lineItems = this.lineItems.filter((item) => item.id !== id);
  }

  formatMoney(value: number): string {
    return `AED ${value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showLineItemModal) {
      this.closeLineItemModal();
    }
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.showActionMenu = false;
  }
}
