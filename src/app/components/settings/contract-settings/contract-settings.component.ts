import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  CONTRACT_NOTICE_PRESETS,
  ContractSettingsModel,
  DEFAULT_CONTRACT_SETTINGS,
} from './contract-settings.data';

@Component({
  selector: 'app-contract-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './contract-settings.component.html',
  styleUrl: './contract-settings.component.scss',
})
export class ContractSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  readonly presets = CONTRACT_NOTICE_PRESETS;

  model: ContractSettingsModel = {
    ...DEFAULT_CONTRACT_SETTINGS,
    renewalNoticeDays: [...DEFAULT_CONTRACT_SETTINGS.renewalNoticeDays],
  };

  draftDay: string | number = '';
  dayError = '';
  saved = false;
  isLoading = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.fetchSettings();
  }

  // API Call: Fetch Contract Settings (TypeId: 2, FilterId: 1005, FilterText: "contract_settings")
  fetchSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'contract_settings',
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
                    ...DEFAULT_CONTRACT_SETTINGS,
                    ...parsed,
                  };
                }
              } catch (e) {
                console.error('Failed to parse contract_settings strValue:', e);
              }
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching contract settings:', err);
      },
    });
  }

  /** Descending: furthest from end date first (matches reminder order). */
  get sortedDays(): number[] {
    return [...this.model.renewalNoticeDays].sort((a, b) => b - a);
  }

  get earliestNotice(): number | null {
    return this.sortedDays.length ? this.sortedDays[0] : null;
  }

  get renewalNoticeCsv(): string {
    return this.sortedDays.slice().reverse().join(',');
  }

  addDay(): void {
    this.dayError = '';
    const raw = String(this.draftDay ?? '').trim();
    if (!raw) {
      return;
    }
    const day = Number(raw);
    if (!Number.isFinite(day) || day <= 0 || !Number.isInteger(day)) {
      this.dayError = 'Enter a whole number of days greater than 0.';
      return;
    }
    if (this.model.renewalNoticeDays.includes(day)) {
      this.draftDay = '';
      return;
    }
    this.model.renewalNoticeDays = [...this.model.renewalNoticeDays, day].sort(
      (a, b) => a - b
    );
    this.draftDay = '';
  }

  removeDay(day: number): void {
    this.model.renewalNoticeDays = this.model.renewalNoticeDays.filter((d) => d !== day);
  }

  onDayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addDay();
    }
  }

  applyPreset(day: number): void {
    if (this.model.renewalNoticeDays.includes(day)) {
      return;
    }
    this.model.renewalNoticeDays = [...this.model.renewalNoticeDays, day].sort(
      (a, b) => a - b
    );
  }

  isPresetActive(day: number): boolean {
    return this.model.renewalNoticeDays.includes(day);
  }

  // API Call: Save / Update Contract Settings (TypeId: 90, FilterId: 1005, FilterText: "contract_settings")
  save(): void {
    if (!this.model.renewalNoticeDays.length) {
      this.dayError = 'Add at least one renewal notice day.';
      return;
    }
    this.dayError = '';
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'contract_settings',
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
          this.toastr.success('Contract settings saved successfully!', 'Success');
          if (this.savedTimer) {
            clearTimeout(this.savedTimer);
          }
          this.savedTimer = setTimeout(() => {
            this.saved = false;
          }, 2500);
        } else {
          this.toastr.error(res?.message || 'Failed to save contract settings', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to save contract settings', 'Error');
        console.error('Error saving contract settings:', err);
      },
    });
  }
}
