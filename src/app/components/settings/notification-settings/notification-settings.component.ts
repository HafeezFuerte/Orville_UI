import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NotificationSettingsModel,
} from './notification-settings.data';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss',
})
export class NotificationSettingsComponent {
  model: NotificationSettingsModel = { ...DEFAULT_NOTIFICATION_SETTINGS };
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
