import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_INVOICE_RECEIPT_PROFILES,
  EMPTY_INVOICE_RECEIPT_PROFILE,
  IRP_COUNTRIES,
  IRP_STATES_BY_COUNTRY,
  InvoiceReceiptProfile,
} from './invoice-receipt-profiles.data';

@Component({
  selector: 'app-invoice-receipt-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-receipt-profiles.component.html',
  styleUrl: './invoice-receipt-profiles.component.scss',
})
export class InvoiceReceiptProfilesComponent {
  searchQuery = '';
  modalOpen = false;
  editingId: number | null = null;
  isDuplicate = false;
  dropActive = false;

  draft: Omit<InvoiceReceiptProfile, 'id'> = { ...EMPTY_INVOICE_RECEIPT_PROFILE };

  rows: InvoiceReceiptProfile[] = DEFAULT_INVOICE_RECEIPT_PROFILES.map((r) => ({ ...r }));

  readonly countries = IRP_COUNTRIES;
  private nextId = 2;

  get filteredRows(): InvoiceReceiptProfile[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.address1.toLowerCase().includes(q) ||
        row.country.toLowerCase().includes(q)
    );
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    return `${n} profile${n === 1 ? '' : 's'}`;
  }

  get modalTitle(): string {
    if (this.isDuplicate) {
      return 'Duplicate Invoice/Receipt Profile';
    }
    return this.editingId == null ? 'New Invoice/Receipt Profile' : 'Edit Invoice/Receipt Profile';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  get stateOptions(): string[] {
    if (!this.draft.country) {
      return [];
    }
    return IRP_STATES_BY_COUNTRY[this.draft.country] ?? [];
  }

  openCreate(): void {
    this.editingId = null;
    this.isDuplicate = false;
    this.draft = { ...EMPTY_INVOICE_RECEIPT_PROFILE };
    this.modalOpen = true;
  }

  openEdit(row: InvoiceReceiptProfile): void {
    this.editingId = row.id;
    this.isDuplicate = false;
    this.draft = { ...row };
    this.modalOpen = true;
  }

  duplicate(row: InvoiceReceiptProfile): void {
    this.editingId = null;
    this.isDuplicate = true;
    this.draft = {
      ...row,
      name: `${row.name} (Copy)`,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.isDuplicate = false;
    this.dropActive = false;
  }

  onCountryChange(): void {
    const states = this.stateOptions;
    if (!states.includes(this.draft.state)) {
      this.draft.state = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.applyLogoFile(file);
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dropActive = false;
    const file = event.dataTransfer?.files?.[0];
    this.applyLogoFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dropActive = true;
  }

  onDragLeave(): void {
    this.dropActive = false;
  }

  removeLogo(): void {
    this.draft.logoName = '';
    this.draft.logoUrl = '';
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    const payload: Omit<InvoiceReceiptProfile, 'id'> = {
      ...this.draft,
      name: this.draft.name.trim(),
      email: this.draft.email.trim(),
      phone: this.draft.phone.trim(),
      vat: this.draft.vat.trim(),
      address1: this.draft.address1.trim(),
      address2: this.draft.address2.trim(),
      city: this.draft.city.trim(),
      postcode: this.draft.postcode.trim(),
      footer: this.draft.footer.trim(),
    };

    if (this.editingId == null) {
      this.rows = [...this.rows, { id: this.nextId++, ...payload }];
    } else {
      this.rows = this.rows.map((row) =>
        row.id === this.editingId ? { ...row, ...payload } : row
      );
    }
    this.closeModal();
  }

  deleteProfile(row: InvoiceReceiptProfile): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
  }

  private applyLogoFile(file?: File): void {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.draft.logoName = file.name;
      this.draft.logoUrl = String(reader.result ?? '');
    };
    reader.readAsDataURL(file);
  }
}
