import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DEFAULT_EMAIL_SETTINGS, EmailSettingsModel } from './email-settings.data';

@Component({
  selector: 'app-email-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-settings.component.html',
  styleUrl: './email-settings.component.scss',
})
export class EmailSettingsComponent {
  model: EmailSettingsModel = { ...DEFAULT_EMAIL_SETTINGS };
  showPassword = false;
  saved = false;
  testSent = false;

  private savedTimer: ReturnType<typeof setTimeout> | null = null;
  private testTimer: ReturnType<typeof setTimeout> | null = null;

  get canUpdate(): boolean {
    return (
      this.model.enableSmtp &&
      this.model.smtpEmail.trim().length > 0 &&
      this.model.smtpAddress.trim().length > 0 &&
      this.model.smtpPort.trim().length > 0
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  testEmail(): void {
    this.testSent = true;
    if (this.testTimer) {
      clearTimeout(this.testTimer);
    }
    this.testTimer = setTimeout(() => {
      this.testSent = false;
    }, 3000);
  }

  save(): void {
    if (!this.canUpdate) {
      return;
    }
    this.saved = true;
    if (this.savedTimer) {
      clearTimeout(this.savedTimer);
    }
    this.savedTimer = setTimeout(() => {
      this.saved = false;
    }, 2500);
  }
}
