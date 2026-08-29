import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CHEQUE_PENALTY_ACCOUNTS,
  ChequePenaltyAccountOption,
  ChequesSettingsModel,
  DEFAULT_CHEQUES_SETTINGS,
} from './cheques-settings.data';

@Component({
  selector: 'app-cheques-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cheques-settings.component.html',
  styleUrl: './cheques-settings.component.scss',
})
export class ChequesSettingsComponent {
  readonly accounts: ChequePenaltyAccountOption[] = CHEQUE_PENALTY_ACCOUNTS;

  model: ChequesSettingsModel = { ...DEFAULT_CHEQUES_SETTINGS };

  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  get selectedAccountName(): string {
    const id = this.model.penaltyAccountId;
    if (!id) {
      return 'Not selected';
    }
    return this.accounts.find((a) => a.id === id)?.name ?? 'Selected account';
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
