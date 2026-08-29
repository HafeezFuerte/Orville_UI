import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_TAX_PROFILES,
  EMPTY_TAX_PROFILE,
  TaxProfile,
} from './tax-profiles.data';

@Component({
  selector: 'app-tax-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tax-profiles.component.html',
  styleUrl: './tax-profiles.component.scss',
})
export class TaxProfilesComponent {
  searchQuery = '';
  modalOpen = false;
  editingId: number | null = null;

  draft: Omit<TaxProfile, 'id'> = { ...EMPTY_TAX_PROFILE };

  rows: TaxProfile[] = DEFAULT_TAX_PROFILES.map((r) => ({ ...r }));

  private nextId = 1;

  get filteredRows(): TaxProfile[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter((row) => row.name.toLowerCase().includes(q));
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    return `${n} profile${n === 1 ? '' : 's'}`;
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Tax Profile' : 'Edit Tax Profile';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a reusable tax profile for invoices and expenses.'
      : 'Update this tax profile configuration.';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  openCreate(): void {
    this.editingId = null;
    this.draft = { ...EMPTY_TAX_PROFILE };
    this.modalOpen = true;
  }

  openEdit(row: TaxProfile): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      percentage: row.percentage,
      expenseProfile: row.expenseProfile,
      defaultCommercial: row.defaultCommercial,
      defaultResidential: row.defaultResidential,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  formatPercentage(row: TaxProfile): string {
    return `${row.percentage}%`;
  }

  defaultLabel(row: TaxProfile): string {
    const parts: string[] = [];
    if (row.defaultCommercial) {
      parts.push('Commercial');
    }
    if (row.defaultResidential) {
      parts.push('Residential');
    }
    return parts.length ? parts.join(', ') : '—';
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    const payload: Omit<TaxProfile, 'id'> = {
      name: this.draft.name.trim(),
      percentage: Number(this.draft.percentage) || 0,
      expenseProfile: !!this.draft.expenseProfile,
      defaultCommercial: !!this.draft.defaultCommercial,
      defaultResidential: !!this.draft.defaultResidential,
    };

    if (this.editingId == null) {
      const id = this.nextId++;
      let next = [...this.rows, { id, ...payload }];
      next = this.applyDefaultFlags(next, id, payload);
      this.rows = next;
    } else {
      let next = this.rows.map((row) =>
        row.id === this.editingId ? { ...row, ...payload } : row
      );
      next = this.applyDefaultFlags(next, this.editingId, payload);
      this.rows = next;
    }
    this.closeModal();
  }

  /** Only one commercial / residential default at a time. */
  private applyDefaultFlags(
    rows: TaxProfile[],
    activeId: number,
    payload: Omit<TaxProfile, 'id'>
  ): TaxProfile[] {
    return rows.map((row) => ({
      ...row,
      defaultCommercial: payload.defaultCommercial
        ? row.id === activeId
        : row.id === activeId
          ? false
          : row.defaultCommercial,
      defaultResidential: payload.defaultResidential
        ? row.id === activeId
        : row.id === activeId
          ? false
          : row.defaultResidential,
    }));
  }

  deleteProfile(row: TaxProfile): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
  }
}
