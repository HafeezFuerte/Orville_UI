import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { DEFAULT_EMAIL_SETTINGS, EmailSettingsModel } from './email-settings.data';

@Component({
  selector: 'app-email-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './email-settings.component.html',
  styleUrl: './email-settings.component.scss',
})
export class EmailSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  model: EmailSettingsModel = { ...DEFAULT_EMAIL_SETTINGS };
  showPassword = false;
  saved = false;
  testSent = false;
  isLoading = false;

  private savedTimer: ReturnType<typeof setTimeout> | null = null;
  private testTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.fetchSettings();
  }

  // API Call: Fetch Email Settings (TypeId: 2, FilterId: 1005, FilterText: "email_settings")
  fetchSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'email_settings',
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
              try {
                const parsed = JSON.parse(row.strValue);
                if (parsed && typeof parsed === 'object') {
                  this.model = {
                    ...DEFAULT_EMAIL_SETTINGS,
                    ...parsed,
                  };
                }
              } catch (e) {
                console.error('Failed to parse email_settings strValue:', e);
              }
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching email settings:', err);
      },
    });
  }

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
    this.toastr.info('Test email notification triggered', 'SMTP Test');
    if (this.testTimer) {
      clearTimeout(this.testTimer);
    }
    this.testTimer = setTimeout(() => {
      this.testSent = false;
    }, 3000);
  }

  // API Call: Save / Update Email Settings (TypeId: 90, FilterId: 1005, FilterText: "email_settings")
  save(): void {
    if (!this.canUpdate) {
      this.toastr.warning('Please fill in all required SMTP fields', 'Validation Warning');
      return;
    }
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'email_settings',
      filterText1: JSON.stringify(this.model),
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200') {
          this.saved = true;
          this.toastr.success('Email settings saved successfully!', 'Success');
          if (this.savedTimer) {
            clearTimeout(this.savedTimer);
          }
          this.savedTimer = setTimeout(() => {
            this.saved = false;
          }, 2500);
        } else {
          this.toastr.error(res?.message || 'Failed to save email settings', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to save email settings', 'Error');
        console.error('Error saving email settings:', err);
      },
    });
  }
}
