import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_SNAPLIST_PREFERENCE,
  SnaplistPreferenceModel,
} from './snaplist-preference.data';

@Component({
  selector: 'app-snaplist-preference',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './snaplist-preference.component.html',
  styleUrl: './snaplist-preference.component.scss',
})
export class SnaplistPreferenceComponent {
  model: SnaplistPreferenceModel = { ...DEFAULT_SNAPLIST_PREFERENCE };
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
