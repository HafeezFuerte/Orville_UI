import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CONTRACT_NOTICE_PRESETS,
  ContractSettingsModel,
  DEFAULT_CONTRACT_SETTINGS,
} from './contract-settings.data';

@Component({
  selector: 'app-contract-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contract-settings.component.html',
  styleUrl: './contract-settings.component.scss',
})
export class ContractSettingsComponent {
  readonly presets = CONTRACT_NOTICE_PRESETS;

  model: ContractSettingsModel = {
    ...DEFAULT_CONTRACT_SETTINGS,
    renewalNoticeDays: [...DEFAULT_CONTRACT_SETTINGS.renewalNoticeDays],
  };

  draftDay = '';
  dayError = '';
  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  /** Descending: furthest from end date first (matches reminder order). */
  get sortedDays(): number[] {
    return [...this.model.renewalNoticeDays].sort((a, b) => b - a);
  }

  get earliestNotice(): number | null {
    return this.sortedDays.length ? this.sortedDays[0] : null;
  }

  get renewalNoticeCsv(): string {
    return this.sortedDays.slice().reverse().join(',');
  }

  addDay(): void {
    this.dayError = '';
    const raw = this.draftDay.trim();
    const day = Number(raw);
    if (!Number.isFinite(day) || day <= 0 || !Number.isInteger(day)) {
      this.dayError = 'Enter a whole number of days greater than 0.';
      return;
    }
    if (this.model.renewalNoticeDays.includes(day)) {
      this.draftDay = '';
      return;
    }
    this.model.renewalNoticeDays = [...this.model.renewalNoticeDays, day].sort(
      (a, b) => a - b
    );
    this.draftDay = '';
  }

  removeDay(day: number): void {
    this.model.renewalNoticeDays = this.model.renewalNoticeDays.filter((d) => d !== day);
  }

  onDayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addDay();
    }
  }

  applyPreset(day: number): void {
    if (this.model.renewalNoticeDays.includes(day)) {
      return;
    }
    this.model.renewalNoticeDays = [...this.model.renewalNoticeDays, day].sort(
      (a, b) => a - b
    );
  }

  isPresetActive(day: number): boolean {
    return this.model.renewalNoticeDays.includes(day);
  }

  save(): void {
    if (!this.model.renewalNoticeDays.length) {
      this.dayError = 'Add at least one renewal notice day.';
      return;
    }
    this.dayError = '';
    this.saved = true;
    if (this.savedTimer) {
      clearTimeout(this.savedTimer);
    }
    this.savedTimer = setTimeout(() => {
      this.saved = false;
    }, 2500);
  }
}
