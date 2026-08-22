import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  PURCHASE_ORDER_FORM_OPTIONS,
  PurchaseOrderLineDraft,
  PurchaseOrderLineItem
} from '../purchase-orders.data';

@Component({
  selector: 'app-create-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-purchase-order.component.html',
  styleUrl: './create-purchase-order.component.scss'
})
export class CreatePurchaseOrderComponent {
  private router = inject(Router);

  options = PURCHASE_ORDER_FORM_OPTIONS;

  selectedProperty: string | null = null;
  selectedUnit: string | null = null;
  selectedVendor: string | null = null;
  poNumber = '';
  poDate = '';
  dueDate = '';

  shippingName = '';
  shippingPhone = '';
  shippingCompanyName = '';
  shippingState = '';
  shippingCity = '';
  shippingZipcode = '';
  shippingAddress = '';

  details = '';
  note = '';

  lineItems: PurchaseOrderLineItem[] = [];
  showLineModal = false;

  modal: PurchaseOrderLineDraft = {
    itemCode: '',
    inventoryItem: null,
    description: '',
    quantity: 1,
    price: 0,
    taxProfile: null
  };

  get modalTotal(): number {
    return Number((this.modal.quantity * this.modal.price).toFixed(2));
  }

  goBack(): void {
    this.router.navigate(['/facility/purchase-orders']);
  }

  save(): void {
    this.router.navigate(['/facility/purchase-orders']);
  }

  openAddLineItem(): void {
    this.modal = {
      itemCode: '',
      inventoryItem: null,
      description: '',
      quantity: 1,
      price: 0,
      taxProfile: null
    };
    this.showLineModal = true;
  }

  closeLineModal(): void {
    this.showLineModal = false;
  }

  saveLineItem(): void {
    this.lineItems = [
      ...this.lineItems,
      {
        id: String(Date.now()),
        itemCode: this.modal.itemCode.trim() || '—',
        inventoryItem: this.modal.inventoryItem || '—',
        description: this.modal.description.trim(),
        quantity: this.modal.quantity,
        price: Number(this.modal.price) || 0,
        taxProfile: this.modal.taxProfile || '—',
        total: this.modalTotal
      }
    ];
    this.closeLineModal();
  }

  removeLineItem(id: string): void {
    this.lineItems = this.lineItems.filter((item) => item.id !== id);
  }

  formatMoney(value: number): string {
    return `AED ${value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showLineModal) {
      this.closeLineModal();
    }
  }
}
