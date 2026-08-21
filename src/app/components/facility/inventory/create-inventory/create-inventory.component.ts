import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { INVENTORY_FORM_OPTIONS, InventoryLineDraft } from '../inventory.data';

@Component({
  selector: 'app-create-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-inventory.component.html',
  styleUrl: './create-inventory.component.scss'
})
export class CreateInventoryComponent {
  private router = inject(Router);

  options = INVENTORY_FORM_OPTIONS;

  itemName = '';
  partNumber = '';
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;
  detail = '';

  placedDate = '';
  expirationDate = '';
  selectedVendor: string | null = null;

  attachments: { type: string | null }[] = [{ type: null }];
  lines: InventoryLineDraft[] = [
    { location: '', area: '', barcode: '', cost: '500.00', availableQty: '', minimumQty: '' }
  ];

  nonStockItem = true;
  nonStockSameForAll = true;
  randomBarcode = false;
  barcodeSameForAll = false;
  costSameForAll = false;

  goBack(): void {
    this.router.navigate(['/facility/inventory']);
  }

  save(): void {
    this.router.navigate(['/facility/inventory']);
  }

  addAttachment(): void {
    this.attachments = [...this.attachments, { type: null }];
  }

  removeAttachment(index: number): void {
    if (this.attachments.length <= 1) {
      this.attachments = [{ type: null }];
      return;
    }
    this.attachments = this.attachments.filter((_, i) => i !== index);
  }

  addLine(): void {
    this.lines = [
      ...this.lines,
      { location: '', area: '', barcode: '', cost: '', availableQty: '', minimumQty: '' }
    ];
  }

  removeLine(index: number): void {
    if (this.lines.length <= 1) {
      this.lines = [{ location: '', area: '', barcode: '', cost: '', availableQty: '', minimumQty: '' }];
      return;
    }
    this.lines = this.lines.filter((_, i) => i !== index);
  }

  trackByIndex(index: number): number {
    return index;
  }

  onFileSelected(_event: Event): void {
    /* frontend-only placeholder */
  }
}
