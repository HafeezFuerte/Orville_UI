import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_PAYMENT_SETTINGS,
  PAYMENT_ACCOUNT_OPTIONS,
  PAYMENT_TOGGLES,
  PaymentAccountOption,
  PaymentSettingsModel,
  PaymentToggleDef,
} from './payment-settings.data';

type DayListKey = 'delayedRentDays' | 'upcomingPaymentDays' | 'bouncedChequeDays';

@Component({
  selector: 'app-payment-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-settings.component.html',
  styleUrl: './payment-settings.component.scss',
})
export class PaymentSettingsComponent {
  readonly accounts: PaymentAccountOption[] = PAYMENT_ACCOUNT_OPTIONS;
  readonly toggles: PaymentToggleDef[] = PAYMENT_TOGGLES;

  model: PaymentSettingsModel = {
    ...DEFAULT_PAYMENT_SETTINGS,
    delayedRentDays: [...DEFAULT_PAYMENT_SETTINGS.delayedRentDays],
    upcomingPaymentDays: [...DEFAULT_PAYMENT_SETTINGS.upcomingPaymentDays],
    bouncedChequeDays: [...DEFAULT_PAYMENT_SETTINGS.bouncedChequeDays],
  };

  draftDay: Record<DayListKey, string> = {
    delayedRentDays: '',
    upcomingPaymentDays: '',
    bouncedChequeDays: '',
  };

  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  get selectedAccountName(): string {
    const id = this.model.onlinePaymentsAccountId;
    if (!id) {
      return 'Cash - Checking (default)';
    }
    return this.accounts.find((a) => a.id === id)?.name ?? 'Selected account';
  }

  get enabledToggleCount(): number {
    return this.toggles.filter((t) => !!this.model[t.key]).length;
  }

  getToggle(key: PaymentToggleDef['key']): boolean {
    return !!this.model[key];
  }

  setToggle(key: PaymentToggleDef['key'], value: boolean): void {
    this.model[key] = value;
  }

  addDay(list: DayListKey): void {
    const raw = this.draftDay[list].trim();
    const day = Number(raw);
    if (!Number.isFinite(day) || day <= 0 || !Number.isInteger(day)) {
      return;
    }
    if (this.model[list].includes(day)) {
      this.draftDay[list] = '';
      return;
    }
    this.model[list] = [...this.model[list], day].sort((a, b) => a - b);
    this.draftDay[list] = '';
  }

  removeDay(list: DayListKey, day: number): void {
    this.model[list] = this.model[list].filter((d) => d !== day);
  }

  onDayKeydown(event: KeyboardEvent, list: DayListKey): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addDay(list);
    }
  }

  save(): void {
    this.saved = true;
    if (this.savedTimer) {
      clearTimeout(this.savedTimer);
    }
    this.savedTimer = setTimeout(() => {
      this.saved = false;
    }, 2500);
  }
}
