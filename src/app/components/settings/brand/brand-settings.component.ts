import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

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
  imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule],
  templateUrl: './brand-settings.component.html',
  styleUrl: './brand-settings.component.scss',
})
export class BrandSettingsComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  readonly defaultPrimary = '#57BFC7';
  readonly defaultSecondary = '#1989FA';
  readonly defaultTheme = 'Minimal';

  primaryColor = this.defaultPrimary;
  secondaryColor = this.defaultSecondary;
  selectedTheme = this.defaultTheme;
  darkMode = true;
  applyPreviewEnabled = false;
  isLoading = false;

  // Track raw File objects selected by the user before uploading
  selectedFiles: Map<LogoSlot, File> = new Map();

  // Saved image URLs from server
  existingLogoUrls: Record<LogoSlot, string> = {
    originalLogo: '',
    whiteLogo: '',
    originalIcon: '',
    whiteIcon: '',
  };

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

  ngOnInit(): void {
    this.fetchBrandSettings();
  }

  ngOnDestroy(): void {
    this.uploads.forEach((u) => this.revokePreview(u));
  }

  // API Call: Get Brand Records (TypeId: 2, FilterId: 1005)
  fetchBrandSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'brand_theme',
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
              this.parseBrandData(row.strValue);
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load brand settings', 'Error');
        console.error('Error fetching brand settings:', err);
      },
    });
  }

  private parseBrandData(strValue: string): void {
    try {
      const parsed = JSON.parse(strValue);
      const item = Array.isArray(parsed) ? parsed[0] : parsed;
      if (!item) return;

      if (item.primary_color) this.primaryColor = item.primary_color;
      if (item.secondary_color) this.secondaryColor = item.secondary_color;
      if (item.theme) this.selectedTheme = item.theme;
      if (item.dark_mode !== undefined) {
        this.darkMode = item.dark_mode === 'true' || item.dark_mode === true;
      }

      this.existingLogoUrls.originalLogo = item.original_logo || '';
      this.existingLogoUrls.whiteLogo = item.white_logo || '';
      this.existingLogoUrls.originalIcon = item.original_logo_icon || '';
      this.existingLogoUrls.whiteIcon = item.white_logo_icon || '';

      this.uploads.forEach((u) => {
        const serverUrl = this.existingLogoUrls[u.key];
        if (serverUrl) {
          u.previewUrl = serverUrl;
          u.fileName = serverUrl.split('/').pop() || null;
        }
      });
    } catch (e) {
      console.error('Failed to parse brand strValue JSON:', e);
    }
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
    this.selectedFiles.set(upload.key, file);
    input.value = '';
  }

  // Upload single logo image file before saving theme settings
  private uploadSingleFile(key: LogoSlot, file: File): Observable<{ key: LogoSlot; url: string }> {
    const user = this.commonService.getCurrentUser();
    const reqObject = {
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      company_id: user?.companyId || 1,
      source: 'web',
      languageid: 1,
      code: '',
      entity_id: '1',
      entity: 'Brand',
      document_type: 28,
      document_no: 'LOGO-' + Math.floor(Math.random() * 1000000),
      issue_date: new Date().toISOString().substring(0, 10),
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      issuing_authority: 'System',
      share_with_tenants: true,
      status: 33,
      share_with_landlords: true,
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(reqObject));
    formData.append('file_path', file);

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
          observer.next({ key, url: uploadedUrl || this.existingLogoUrls[key] });
          observer.complete();
        },
        error: (err) => {
          console.error(`Failed to upload image for ${key}:`, err);
          observer.next({ key, url: this.existingLogoUrls[key] });
          observer.complete();
        },
      });
    });
  }

  // Main Save Action: Upload images first, then save JSON payload (TypeId: 90)
  saveBrandSettings(): void {
    this.isLoading = true;
    const uploadTasks: Observable<{ key: LogoSlot; url: string }>[] = [];

    this.selectedFiles.forEach((file, key) => {
      uploadTasks.push(this.uploadSingleFile(key, file));
    });

    if (uploadTasks.length > 0) {
      forkJoin(uploadTasks).subscribe({
        next: (results) => {
          results.forEach((res) => {
            if (res.url) {
              this.existingLogoUrls[res.key] = res.url;
            }
          });
          this.executeSaveTypeId90();
        },
        error: (err) => {
          console.error('Error in batch uploading logo images:', err);
          this.executeSaveTypeId90();
        },
      });
    } else {
      this.executeSaveTypeId90();
    }
  }

  // API Call: Save Brand Records (TypeId: 90, FilterId: 1005)
  private executeSaveTypeId90(): void {
    const strValueObj = [
      {
        original_logo: this.existingLogoUrls.originalLogo,
        white_logo: this.existingLogoUrls.whiteLogo,
        original_logo_icon: this.existingLogoUrls.originalIcon,
        white_logo_icon: this.existingLogoUrls.whiteIcon,
        primary_color: this.primaryColor,
        secondary_color: this.secondaryColor,
        theme: this.selectedTheme,
        dark_mode: String(this.darkMode),
      },
    ];

    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'brand_theme',
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
          this.toastr.success('Brand theme settings saved successfully!', 'Success');
          this.selectedFiles.clear();
          this.fetchBrandSettings();
        } else {
          this.toastr.error(res?.message || 'Failed to save brand theme settings', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to save brand theme settings', 'Error');
        console.error('Error saving brand theme settings:', err);
      },
    });
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
    this.applyPreviewEnabled = true;
  }

  applyPreview(): void {
    if (!this.applyPreviewEnabled) {
      return;
    }
  }

  reset(): void {
    this.primaryColor = this.defaultPrimary;
    this.secondaryColor = this.defaultSecondary;
    this.selectedTheme = this.defaultTheme;
    this.darkMode = true;
    this.applyPreviewEnabled = false;
    this.selectedFiles.clear();
    this.uploads.forEach((u) => {
      this.revokePreview(u);
      u.previewUrl = this.existingLogoUrls[u.key] || null;
      u.fileName = u.previewUrl ? u.previewUrl.split('/').pop() || null : null;
    });
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
    if (upload.previewUrl && upload.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(upload.previewUrl);
    }
  }
}

