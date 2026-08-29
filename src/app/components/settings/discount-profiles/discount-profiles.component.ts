import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_DISCOUNT_PROFILES,
  DISCOUNT_TYPE_OPTIONS,
  DiscountProfile,
  DiscountType,
  EMPTY_DISCOUNT_PROFILE,
} from './discount-profiles.data';

@Component({
  selector: 'app-discount-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-profiles.component.html',
  styleUrl: './discount-profiles.component.scss',
})
export class DiscountProfilesComponent {
  searchQuery = '';
  modalOpen = false;
  editingId: number | null = null;

  draft: Omit<DiscountProfile, 'id'> = { ...EMPTY_DISCOUNT_PROFILE };

  rows: DiscountProfile[] = DEFAULT_DISCOUNT_PROFILES.map((r) => ({ ...r }));

  readonly discountTypes = DISCOUNT_TYPE_OPTIONS;
  private nextId = 1;

  get filteredRows(): DiscountProfile[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.discountType.toLowerCase().includes(q)
    );
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    return `${n} profile${n === 1 ? '' : 's'}`;
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Discount Profile' : 'Edit Discount Profile';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a reusable discount to apply on invoices and receipts.'
      : 'Update this discount profile configuration.';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0 && this.draft.discountType != null;
  }

  get valueLabel(): string {
    return this.draft.discountType === 'Fixed Amount'
      ? 'Discount Amount'
      : 'Discount Percentage';
  }

  get valuePrefix(): string {
    return this.draft.discountType === 'Fixed Amount' ? 'AED' : '%';
  }

  openCreate(): void {
    this.editingId = null;
    this.draft = { ...EMPTY_DISCOUNT_PROFILE };
    this.modalOpen = true;
  }

  openEdit(row: DiscountProfile): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      discountType: row.discountType,
      value: row.value,
      isDefault: row.isDefault,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  onTypeChange(type: DiscountType): void {
    this.draft.discountType = type;
  }

  formatValue(row: DiscountProfile): string {
    if (row.discountType === 'Fixed Amount') {
      return `AED ${row.value}`;
    }
    return `${row.value}%`;
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    const payload: Omit<DiscountProfile, 'id'> = {
      name: this.draft.name.trim(),
      discountType: this.draft.discountType,
      value: Number(this.draft.value) || 0,
      isDefault: !!this.draft.isDefault,
    };

    if (this.editingId == null) {
      const id = this.nextId++;
      let next = [...this.rows, { id, ...payload }];
      if (payload.isDefault) {
        next = next.map((row) => ({ ...row, isDefault: row.id === id }));
      }
      this.rows = next;
    } else {
      let next = this.rows.map((row) =>
        row.id === this.editingId ? { ...row, ...payload } : row
      );
      if (payload.isDefault) {
        next = next.map((row) => ({
          ...row,
          isDefault: row.id === this.editingId,
        }));
      }
      this.rows = next;
    }
    this.closeModal();
  }

  duplicate(row: DiscountProfile): void {
    this.editingId = null;
    this.draft = {
      name: `${row.name} (Copy)`,
      discountType: row.discountType,
      value: row.value,
      isDefault: false,
    };
    this.modalOpen = true;
  }

  deleteProfile(row: DiscountProfile): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
  }

  setDefault(row: DiscountProfile): void {
    this.rows = this.rows.map((r) => ({
      ...r,
      isDefault: r.id === row.id,
    }));
  }
}
