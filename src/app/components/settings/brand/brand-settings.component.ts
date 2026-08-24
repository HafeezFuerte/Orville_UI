import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

type LogoSlot = 'originalLogo' | 'whiteLogo' | 'originalIcon' | 'whiteIcon';

interface LogoUpload {
  key: LogoSlot;
  label: string;
  hint: string;
  previewUrl: string | null;
  fileName: string | null;
}

@Component({
  selector: 'app-brand-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './brand-settings.component.html',
  styleUrl: './brand-settings.component.scss',
})
export class BrandSettingsComponent implements OnDestroy {
  readonly defaultPrimary = '#57BFC7';
  readonly defaultSecondary = '#1989FA';
  readonly defaultTheme = 'Minimal';

  primaryColor = this.defaultPrimary;
  secondaryColor = this.defaultSecondary;
  selectedTheme = this.defaultTheme;
  darkMode = true;
  applyPreviewEnabled = false;

  themeOptions = [
    { label: 'Minimal', value: 'Minimal' },
    { label: 'Classic', value: 'Classic' },
    { label: 'Bold', value: 'Bold' },
  ];

  uploads: LogoUpload[] = [
    { key: 'originalLogo', label: 'Original Logo', hint: 'Click to upload logo', previewUrl: null, fileName: null },
    { key: 'whiteLogo', label: 'White Logo', hint: 'Click to upload white logo', previewUrl: null, fileName: null },
    { key: 'originalIcon', label: 'Original Logo Icon', hint: 'Click to upload icon', previewUrl: null, fileName: null },
    { key: 'whiteIcon', label: 'White Logo Icon', hint: 'Click to upload white icon', previewUrl: null, fileName: null },
  ];

  ngOnDestroy(): void {
    this.uploads.forEach((u) => this.revokePreview(u));
  }

  onFileSelected(event: Event, upload: LogoUpload): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.revokePreview(upload);
    upload.previewUrl = URL.createObjectURL(file);
    upload.fileName = file.name;
    input.value = '';
  }

  onPrimaryInput(value: string): void {
    this.primaryColor = this.normalizeHex(value, this.primaryColor);
  }

  onSecondaryInput(value: string): void {
    this.secondaryColor = this.normalizeHex(value, this.secondaryColor);
  }

  onPrimaryPicker(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.primaryColor = value.toUpperCase();
  }

  onSecondaryPicker(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.secondaryColor = value.toUpperCase();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

  generateTheme(): void {
    // Presentation-only: mark preview as available after generating from colors
    this.applyPreviewEnabled = true;
  }

  applyPreview(): void {
    if (!this.applyPreviewEnabled) {
      return;
    }
    // Local preview only — does not override the global theme switcher
  }

  reset(): void {
    this.primaryColor = this.defaultPrimary;
    this.secondaryColor = this.defaultSecondary;
    this.selectedTheme = this.defaultTheme;
    this.darkMode = true;
    this.applyPreviewEnabled = false;
    this.uploads.forEach((u) => {
      this.revokePreview(u);
      u.previewUrl = null;
      u.fileName = null;
    });
  }

  saveThemeJson(): void {
    const payload = {
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      theme: this.selectedTheme,
      darkMode: this.darkMode,
      logos: this.uploads.map((u) => ({
        key: u.key,
        fileName: u.fileName,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orville-brand-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  private normalizeHex(value: string, fallback: string): string {
    const raw = (value || '').trim();
    if (!raw) {
      return fallback;
    }
    const withHash = raw.startsWith('#') ? raw : `#${raw}`;
    if (/^#([0-9A-Fa-f]{6})$/.test(withHash)) {
      return withHash.toUpperCase();
    }
    return raw.toUpperCase();
  }

  private revokePreview(upload: LogoUpload): void {
    if (upload.previewUrl) {
      URL.revokeObjectURL(upload.previewUrl);
    }
  }
}
