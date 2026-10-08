import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NotificationSettingsModel,
} from './notification-settings.data';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss',
})
export class NotificationSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  model: NotificationSettingsModel = { ...DEFAULT_NOTIFICATION_SETTINGS };
  saved = false;
  isLoading = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.fetchSettings();
  }

  // API Call: Fetch Notification Settings (TypeId: 2, FilterId: 1005, FilterText: "notification_settings")
  fetchSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'notification_settings',
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
                    ...DEFAULT_NOTIFICATION_SETTINGS,
                    ...parsed,
                  };
                }
              } catch (e) {
                console.error('Failed to parse notification_settings strValue:', e);
              }
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching notification settings:', err);
      },
    });
  }

  // API Call: Save / Update Notification Settings (TypeId: 90, FilterId: 1005, FilterText: "notification_settings")
  save(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'notification_settings',
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
          this.toastr.success('Notification settings saved successfully!', 'Success');
          if (this.savedTimer) {
            clearTimeout(this.savedTimer);
          }
          this.savedTimer = setTimeout(() => {
            this.saved = false;
          }, 2500);
        } else {
          this.toastr.error(res?.message || 'Failed to save notification settings', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to save notification settings', 'Error');
        console.error('Error saving notification settings:', err);
      },
    });
  }
}
