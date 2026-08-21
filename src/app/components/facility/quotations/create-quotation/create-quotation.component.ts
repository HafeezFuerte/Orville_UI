import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { QUOTATION_FORM_OPTIONS, QuotationLineItem } from '../quotations.data';

@Component({
  selector: 'app-create-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-quotation.component.html',
  styleUrl: './create-quotation.component.scss'
})
export class CreateQuotationComponent {
  private router = inject(Router);

  options = QUOTATION_FORM_OPTIONS;

  title = '';
  reference = '';
  selectedWorkOrder: string | null = null;
  estimatedDate = '';
  selectedCategory: string | null = null;
  selectedVendors: string[] = [];
  lineItems: QuotationLineItem[] = [];
  showLineItemModal = false;

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

  goBack(): void {
    this.router.navigate(['/facility/quotations']);
  }

  create(): void {
    this.router.navigate(['/facility/quotations']);
  }

  openAddLineItem(): void {
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

  closeLineItemModal(): void {
    this.showLineItemModal = false;
  }

  bumpQuantity(delta: number): void {
    this.modal.quantity = Math.max(1, this.modal.quantity + delta);
  }

  saveLineItem(): void {
    this.lineItems = [
      ...this.lineItems,
      {
        id: String(Date.now()),
        title: this.modal.title.trim() || 'Untitled item',
        quantity: this.modal.quantity,
        amountPerItem: Number(this.modal.amountPerItem) || 0,
        totalAmount: this.modalTotal,
        category: this.modal.category || '—',
        taxProfile: this.modal.taxProfile || '—',
        description: this.modal.description
      }
    ];
    this.closeLineItemModal();
  }

  removeLineItem(id: string): void {
    this.lineItems = this.lineItems.filter((item) => item.id !== id);
  }

  formatMoney(value: number): string {
    return `AED ${value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  onFileSelected(_event: Event): void {
    /* frontend-only placeholder */
  }
}
