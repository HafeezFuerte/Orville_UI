import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_MANAGEMENT_FEE_SETTINGS,
  MANAGEMENT_FEE_TOGGLES,
  ManagementFeeSettingsModel,
  ManagementFeeToggleDef,
} from './management-fee.component.data';

@Component({
  selector: 'app-management-fee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './management-fee.component.html',
  styleUrl: './management-fee.component.scss',
})
export class ManagementFeeComponent {
  readonly toggles: ManagementFeeToggleDef[] = MANAGEMENT_FEE_TOGGLES;

  model: ManagementFeeSettingsModel = { ...DEFAULT_MANAGEMENT_FEE_SETTINGS };

  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  getToggle(key: ManagementFeeToggleDef['key']): boolean {
    return !!this.model[key];
  }

  setToggle(key: ManagementFeeToggleDef['key'], value: boolean): void {
    this.model[key] = value;
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
