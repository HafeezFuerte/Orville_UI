import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_PAYMENT_SETTINGS,
  PAYMENT_ACCOUNT_OPTIONS,
  PAYMENT_TOGGLES,
  PaymentAccountOption,
  PaymentSettingsModel,
  PaymentToggleDef,
} from './payment-settings.data';

type DayListKey = 'delayedRentDays' | 'upcomingPaymentDays' | 'bouncedChequeDays';

@Component({
  selector: 'app-payment-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './payment-settings.component.html',
  styleUrl: './payment-settings.component.scss',
})
export class PaymentSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  readonly defaultAccounts: PaymentAccountOption[] = PAYMENT_ACCOUNT_OPTIONS;
  accountsList: PaymentAccountOption[] = [...PAYMENT_ACCOUNT_OPTIONS];
  readonly toggles: PaymentToggleDef[] = PAYMENT_TOGGLES;

  isLoading = false;
  model: PaymentSettingsModel = {
    ...DEFAULT_PAYMENT_SETTINGS,
    delayedRentDays: [...DEFAULT_PAYMENT_SETTINGS.delayedRentDays],
    upcomingPaymentDays: [...DEFAULT_PAYMENT_SETTINGS.upcomingPaymentDays],
    bouncedChequeDays: [...DEFAULT_PAYMENT_SETTINGS.bouncedChequeDays],
  };

  draftDay: Record<DayListKey, string | number | null> = {
    delayedRentDays: '',
    upcomingPaymentDays: '',
    bouncedChequeDays: '',
  };

  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  get selectedAccountName(): string {
    const id = this.model.onlinePaymentsAccountId;
    if (!id) {
      return 'Cash - Checking (default)';
    }
    return this.accountsList.find((a) => a.id === id)?.name ?? 'Selected account';
  }

  get enabledToggleCount(): number {
    return this.toggles.filter((t) => !!this.model[t.key]).length;
  }

  ngOnInit(): void {
    this.fetchGLAccounts();
    this.fetchSettings();
  }

  // API Call: Fetch GL Accounts Master (TypeId: 2, FilterId: 1003)
  fetchGLAccounts(): void {
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1003,
      filterText: '',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200' && res.objResult) {
          const records = res.objResult.table || res.objResult.table0 || res.objResult;
          if (Array.isArray(records) && records.length > 0) {
            this.accountsList = records.map((acc: any) => ({
              id: acc.account_code || acc.code || String(acc.id),
              name: `${acc.account_name}${acc.account_code ? ' (' + acc.account_code + ')' : ''}`,
            }));
          }
        }
      },
      error: (err) => {
        console.error('Error fetching GL accounts for payment settings:', err);
      },
    });
  }

  // API Call: Fetch Invoice Settings (TypeId: 2, FilterId: 1005, FilterText: "invoice_settings")
  fetchSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'invoice_settings',
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
                const item = Array.isArray(parsed) ? parsed[0] : parsed;
                if (item && typeof item === 'object') {
                  this.model = {
                    ...DEFAULT_PAYMENT_SETTINGS,
                    ...item,
                    delayedRentDays: Array.isArray(item.delayedRentDays) ? item.delayedRentDays : [...DEFAULT_PAYMENT_SETTINGS.delayedRentDays],
                    upcomingPaymentDays: Array.isArray(item.upcomingPaymentDays) ? item.upcomingPaymentDays : [...DEFAULT_PAYMENT_SETTINGS.upcomingPaymentDays],
                    bouncedChequeDays: Array.isArray(item.bouncedChequeDays) ? item.bouncedChequeDays : [...DEFAULT_PAYMENT_SETTINGS.bouncedChequeDays],
                  };
                }
              } catch (e) {
                console.error('Failed to parse invoice_settings strValue:', e);
              }
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load invoice settings', 'Error');
        console.error('Error fetching invoice settings:', err);
      },
    });
  }

  getToggle(key: PaymentToggleDef['key']): boolean {
    return !!this.model[key];
  }

  setToggle(key: PaymentToggleDef['key'], value: boolean): void {
    this.model[key] = value;
  }

  addDay(list: DayListKey): void {
    const val = this.draftDay[list];
    if (val === null || val === undefined || val === '') {
      return;
    }
    const day = typeof val === 'number' ? val : Number(String(val).trim());
    if (!Number.isFinite(day) || day <= 0 || !Number.isInteger(day)) {
      return;
    }
    if (!this.model[list]) {
      this.model[list] = [];
    }
    if (this.model[list].includes(day)) {
      this.draftDay[list] = '';
      return;
    }
    this.model[list] = [...this.model[list], day].sort((a, b) => a - b);
    this.draftDay[list] = '';
  }

  removeDay(list: DayListKey, day: number): void {
    if (this.model[list]) {
      this.model[list] = this.model[list].filter((d) => d !== day);
    }
  }

  onDayKeydown(event: KeyboardEvent, list: DayListKey): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addDay(list);
    }
  }

  // API Call: Save / Update Invoice Settings (TypeId: 90, FilterId: 1005, FilterText: "invoice_settings")
  save(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'invoice_settings',
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
          this.toastr.success('Invoice settings updated successfully!', 'Success');
          if (this.savedTimer) {
            clearTimeout(this.savedTimer);
          }
          this.savedTimer = setTimeout(() => {
            this.saved = false;
          }, 2500);
          this.fetchSettings();
        } else {
          this.toastr.error(res?.message || 'Failed to update invoice settings', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to update invoice settings', 'Error');
        console.error('Save invoice settings error:', err);
      },
    });
  }
}

