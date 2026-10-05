import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-watermark-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule],
  templateUrl: './watermark-settings.component.html',
  styleUrl: './watermark-settings.component.scss',
})
export class WatermarkSettingsComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  watermarkEnabled = false;
  watermarkType = 'Image';
  rotation = 'Center';
  repeatWatermark = true;
  watermarkText = '';
  watermarkPreviewUrl: string | null = null;
  hasDefaultLogo = true;
  isLoading = false;

  private objectUrl: string | null = null;
  private selectedImageFile: File | null = null;
  private savedImageUrl = '';

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
    if (!this.watermarkEnabled) return false;
    if (this.watermarkType === 'Text') return true;
    return !!this.watermarkPreviewUrl || this.hasDefaultLogo;
  }

  ngOnInit(): void {
    this.fetchWatermarkSettings();
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  // API Call: Fetch Watermark Settings (TypeId: 2, FilterId: 1005, FilterText: "watermark")
  fetchWatermarkSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'watermark',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200' && res.objResult) {
          const records = res.objResult.table || res.objResult.table0 || res.objResult;
          if (Array.isArray(records) && records.length > 0) {
            const row = records[0];
            if (row.strValue) {
              this.parseWatermarkData(row.strValue);
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load watermark settings', 'Error');
        console.error('Error fetching watermark settings:', err);
      },
    });
  }

  private parseWatermarkData(strValue: string): void {
    try {
      const parsed = JSON.parse(strValue);
      const item = Array.isArray(parsed) ? parsed[0] : parsed;
      if (!item) return;

      if (item.is_enabled !== undefined) {
        this.watermarkEnabled = item.is_enabled === 'true' || item.is_enabled === true;
      }

      if (item.type) {
        this.watermarkType = item.type.toLowerCase() === 'text' ? 'Text' : 'Image';
      }

      if (item.rotation_angle) {
        const rot = item.rotation_angle.toLowerCase().replace(/_/g, ' ');
        const match = this.rotationOptions.find((r) => r.value.toLowerCase() === rot);
        if (match) {
          this.rotation = match.value;
        }
      }

      if (item.watermark_image) {
        this.savedImageUrl = item.watermark_image;
        this.watermarkPreviewUrl = item.watermark_image;
        this.hasDefaultLogo = false;
      }

      if (item.watermark_text) {
        this.watermarkText = item.watermark_text;
      }

      if (item.display_text !== undefined) {
        this.repeatWatermark = item.display_text === 'true' || item.display_text === true;
      }
    } catch (e) {
      console.error('Failed to parse watermark strValue JSON:', e);
    }
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
    this.selectedImageFile = file;
    this.objectUrl = URL.createObjectURL(file);
    this.watermarkPreviewUrl = this.objectUrl;
    this.hasDefaultLogo = false;
    this.watermarkEnabled = true;
    input.value = '';
  }

  removeWatermarkImage(): void {
    this.revokeObjectUrl();
    this.selectedImageFile = null;
    this.savedImageUrl = '';
    this.watermarkPreviewUrl = null;
    this.hasDefaultLogo = false;
  }

  // Upload image file before saving watermark settings
  private uploadWatermarkImage(): Observable<string> {
    if (!this.selectedImageFile) {
      return new Observable((observer) => {
        observer.next(this.savedImageUrl);
        observer.complete();
      });
    }

    const user = this.commonService.getCurrentUser();
    const reqObject = {
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      company_id: user?.companyId || 1,
      source: 'web',
      languageid: 1,
      code: '',
      entity_id: '1',
      entity: 'Watermark',
      document_type: 28,
      document_no: 'WM-' + Math.floor(Math.random() * 1000000),
      issue_date: new Date().toISOString().substring(0, 10),
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      issuing_authority: 'System',
      share_with_tenants: true,
      status: 33,
      share_with_landlords: true,
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(reqObject));
    formData.append('file_path', this.selectedImageFile);

    const url = environment.apiurl + 'api/Masters/save_documents';
    return new Observable((observer) => {
      this.http.post<any>(url, formData, { headers: this.commonService.updateHeaders() }).subscribe({
        next: (res) => {
          let uploadedUrl = '';
          if (res && (res.statusCode === '200' || res.statusCode === 200)) {
            uploadedUrl =
              res.objResult?.file_path ||
              (Array.isArray(res.objResult?.table) ? res.objResult.table[0]?.file_path : '') ||
              '';
          }
          observer.next(uploadedUrl || this.savedImageUrl);
          observer.complete();
        },
        error: (err) => {
          console.error('Failed to upload watermark image:', err);
          observer.next(this.savedImageUrl);
          observer.complete();
        },
      });
    });
  }

  // Save / Update Watermark Settings (TypeId: 90, FilterId: 1005, FilterText: "watermark")
  update(): void {
    this.isLoading = true;
    this.uploadWatermarkImage().subscribe({
      next: (uploadedUrl) => {
        this.savedImageUrl = uploadedUrl;
        this.executeSaveTypeId90(uploadedUrl);
      },
      error: (err) => {
        console.error('Error uploading watermark image:', err);
        this.executeSaveTypeId90(this.savedImageUrl);
      },
    });
  }

  private executeSaveTypeId90(imageUrl: string): void {
    const strValueObj = [
      {
        is_enabled: String(this.watermarkEnabled),
        type: this.watermarkType.toLowerCase(),
        rotation_angle: this.rotation.toLowerCase().replace(/ /g, '_'),
        watermark_image: imageUrl,
        watermark_text: this.watermarkText || '',
        display_text: String(this.repeatWatermark),
      },
    ];

    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'watermark',
      filterText1: JSON.stringify(strValueObj),
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200') {
          this.toastr.success('Watermark settings updated successfully!', 'Success');
          this.selectedImageFile = null;
          this.fetchWatermarkSettings();
        } else {
          this.toastr.error(res?.message || 'Failed to update watermark settings', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to update watermark settings', 'Error');
        console.error('Save watermark settings error:', err);
      },
    });
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
