import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-watermark-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './watermark-settings.component.html',
  styleUrl: './watermark-settings.component.scss',
})
export class WatermarkSettingsComponent implements OnDestroy {
  watermarkEnabled = true;
  watermarkType = 'Image';
  rotation = 'Center';
  repeatWatermark = true;
  watermarkPreviewUrl: string | null = null;
  hasDefaultLogo = true;
  private objectUrl: string | null = null;

  readonly typeOptions = [
    { label: 'Image', value: 'Image' },
    { label: 'Text', value: 'Text' },
  ];

  readonly rotationOptions = [
    { label: 'Center', value: 'Center' },
    { label: 'Top Left', value: 'Top Left' },
    { label: 'Top Right', value: 'Top Right' },
    { label: 'Bottom Left', value: 'Bottom Left' },
    { label: 'Bottom Right', value: 'Bottom Right' },
  ];

  get showCurrentPane(): boolean {
    return this.watermarkEnabled && (!!this.watermarkPreviewUrl || this.hasDefaultLogo);
  }

  get showDefaultLogo(): boolean {
    return !this.watermarkPreviewUrl && this.hasDefaultLogo;
  }

  get showPreviewMark(): boolean {
    return this.watermarkEnabled && (!!this.watermarkPreviewUrl || this.hasDefaultLogo);
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  toggleWatermark(): void {
    this.watermarkEnabled = !this.watermarkEnabled;
  }

  onReplaceImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.watermarkPreviewUrl = this.objectUrl;
    this.hasDefaultLogo = false;
    this.watermarkEnabled = true;
    input.value = '';
  }

  removeWatermarkImage(): void {
    this.revokeObjectUrl();
    this.watermarkPreviewUrl = null;
    this.hasDefaultLogo = false;
  }

  update(): void {
    // Presentation-only — no API
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
