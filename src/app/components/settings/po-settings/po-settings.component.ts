import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DEFAULT_PO_SETTINGS, PoSettingsModel } from './po-settings.data';

@Component({
  selector: 'app-po-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './po-settings.component.html',
  styleUrl: './po-settings.component.scss',
})
export class PoSettingsComponent {
  model: PoSettingsModel = { ...DEFAULT_PO_SETTINGS };

  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

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
