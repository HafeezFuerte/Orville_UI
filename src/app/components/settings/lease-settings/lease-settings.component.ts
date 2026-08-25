import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChecklistKind,
  DAY_OF_MONTH_OPTIONS,
  DEFAULT_LEASE_SETTINGS,
  FIXED_PAYMENT_ACCOUNTS,
  FIXED_PAYMENT_TYPES,
  LEASE_PENALTY_ACCOUNTS,
  LEASE_TOGGLES,
  LeaseAccountOption,
  LeaseChecklistItem,
  LeaseFixedPayment,
  LeaseSettingsModel,
  LeaseTerm,
  LeaseToggleDef,
  MONEY_HELD_HELP,
  MONEY_HELD_OPTIONS,
} from './lease-settings.data';

@Component({
  selector: 'app-lease-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lease-settings.component.html',
  styleUrl: './lease-settings.component.scss',
})
export class LeaseSettingsComponent {
  readonly accounts: LeaseAccountOption[] = LEASE_PENALTY_ACCOUNTS;
  readonly paymentAccounts: LeaseAccountOption[] = FIXED_PAYMENT_ACCOUNTS;
  readonly moneyHeldOptions = MONEY_HELD_OPTIONS;
  readonly dayOptions = DAY_OF_MONTH_OPTIONS;
  readonly paymentTypes = FIXED_PAYMENT_TYPES;
  readonly toggles: LeaseToggleDef[] = LEASE_TOGGLES;
  readonly moneyHeldHelp = MONEY_HELD_HELP;

  model: LeaseSettingsModel = this.cloneDefaults();

  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;
  private nextId = 100;

  checklistModalOpen = false;
  checklistKind: ChecklistKind = 'moveOut';
  checklistEditingId: number | null = null;
  checklistDraft = '';

  paymentModalOpen = false;
  paymentEditingId: number | null = null;
  paymentDraft: Omit<LeaseFixedPayment, 'id'> = {
    account: '',
    amount: '',
    type: 'Fixed',
    description: '',
  };

  termModalOpen = false;
  termEditingId: number | null = null;
  termDraft: Omit<LeaseTerm, 'id'> = { title: '' };

  getToggle(key: LeaseToggleDef['key']): boolean {
    return !!this.model[key];
  }

  setToggle(key: LeaseToggleDef['key'], value: boolean): void {
    this.model[key] = value;
  }

  checklistItems(kind: ChecklistKind): LeaseChecklistItem[] {
    if (kind === 'moveOut') return this.model.moveOutChecklists;
    if (kind === 'moveIn') return this.model.moveInChecklists;
    return this.model.renewalChecklists;
  }

  openChecklistModal(kind: ChecklistKind, item?: LeaseChecklistItem): void {
    this.checklistKind = kind;
    this.checklistEditingId = item?.id ?? null;
    this.checklistDraft = item?.name ?? '';
    this.checklistModalOpen = true;
  }

  closeChecklistModal(): void {
    this.checklistModalOpen = false;
    this.checklistEditingId = null;
    this.checklistDraft = '';
  }

  saveChecklist(): void {
    const name = this.checklistDraft.trim();
    if (!name) return;
    const list = this.checklistItems(this.checklistKind);
    if (this.checklistEditingId != null) {
      const next = list.map((i) =>
        i.id === this.checklistEditingId ? { ...i, name } : i
      );
      this.setChecklistList(this.checklistKind, next);
    } else {
      this.setChecklistList(this.checklistKind, [...list, { id: this.nextId++, name }]);
    }
    this.closeChecklistModal();
  }

  removeChecklist(kind: ChecklistKind, id: number): void {
    this.setChecklistList(
      kind,
      this.checklistItems(kind).filter((i) => i.id !== id)
    );
  }

  openPaymentModal(item?: LeaseFixedPayment): void {
    this.paymentEditingId = item?.id ?? null;
    this.paymentDraft = item
      ? {
          account: item.account,
          amount: item.amount,
          type: item.type,
          description: item.description,
        }
      : { account: '', amount: '', type: 'Fixed', description: '' };
    this.paymentModalOpen = true;
  }

  closePaymentModal(): void {
    this.paymentModalOpen = false;
    this.paymentEditingId = null;
  }

  savePayment(): void {
    const row = { ...this.paymentDraft };
    if (!row.account.trim() || !row.type.trim() || String(row.amount).trim() === '') {
      return;
    }
    if (this.paymentEditingId != null) {
      this.model.fixedPayments = this.model.fixedPayments.map((p) =>
        p.id === this.paymentEditingId ? { id: p.id, ...row } : p
      );
    } else {
      this.model.fixedPayments = [
        ...this.model.fixedPayments,
        { id: this.nextId++, ...row },
      ];
    }
    this.closePaymentModal();
  }

  removePayment(id: number): void {
    this.model.fixedPayments = this.model.fixedPayments.filter((p) => p.id !== id);
  }

  openTermModal(item?: LeaseTerm): void {
    this.termEditingId = item?.id ?? null;
    this.termDraft = item ? { title: item.title } : { title: '' };
    this.termModalOpen = true;
  }

  closeTermModal(): void {
    this.termModalOpen = false;
    this.termEditingId = null;
  }

  saveTerm(): void {
    const title = this.termDraft.title.trim();
    if (!title) return;
    if (this.termEditingId != null) {
      this.model.leaseTerms = this.model.leaseTerms.map((t) =>
        t.id === this.termEditingId ? { id: t.id, title } : t
      );
    } else {
      this.model.leaseTerms = [...this.model.leaseTerms, { id: this.nextId++, title }];
    }
    this.closeTermModal();
  }

  removeTerm(id: number): void {
    this.model.leaseTerms = this.model.leaseTerms.filter((t) => t.id !== id);
  }

  save(): void {
    this.saved = true;
    if (this.savedTimer) clearTimeout(this.savedTimer);
    this.savedTimer = setTimeout(() => {
      this.saved = false;
    }, 2500);
  }

  private setChecklistList(kind: ChecklistKind, items: LeaseChecklistItem[]): void {
    if (kind === 'moveOut') this.model.moveOutChecklists = items;
    else if (kind === 'moveIn') this.model.moveInChecklists = items;
    else this.model.renewalChecklists = items;
  }

  private cloneDefaults(): LeaseSettingsModel {
    const d = DEFAULT_LEASE_SETTINGS;
    return {
      ...d,
      moveOutChecklists: d.moveOutChecklists.map((i) => ({ ...i })),
      moveInChecklists: d.moveInChecklists.map((i) => ({ ...i })),
      renewalChecklists: d.renewalChecklists.map((i) => ({ ...i })),
      fixedPayments: d.fixedPayments.map((i) => ({ ...i })),
      leaseTerms: d.leaseTerms.map((i) => ({ ...i })),
    };
  }
}
