import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  CHEQUE_PENALTY_ACCOUNTS,
  ChequePenaltyAccountOption,
  ChequesSettingsModel,
  DEFAULT_CHEQUES_SETTINGS,
} from './cheques-settings.data';

@Component({
  selector: 'app-cheques-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './cheques-settings.component.html',
  styleUrl: './cheques-settings.component.scss',
})
export class ChequesSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  readonly accounts: ChequePenaltyAccountOption[] = CHEQUE_PENALTY_ACCOUNTS;

  isLoading = false;
  model: ChequesSettingsModel = { ...DEFAULT_CHEQUES_SETTINGS };

  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  get selectedAccountName(): string {
    const id = this.model.penaltyAccountId;
    if (!id) {
      return 'Not selected';
    }
    return this.accounts.find((a) => a.id === id)?.name ?? 'Selected account';
  }

  ngOnInit(): void {
    this.fetchSettings();
  }

  // API Call: Fetch Bounced Cheques Settings (TypeId: 2, FilterId: 1005, FilterText: "bounced_cheques")
  fetchSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'bounced_cheques',
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
                    ...DEFAULT_CHEQUES_SETTINGS,
                    ...item,
                  };
                }
              } catch (e) {
                console.error('Failed to parse bounced_cheques strValue:', e);
              }
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load bounced cheques settings', 'Error');
        console.error('Error fetching bounced cheques settings:', err);
      },
    });
  }

  // API Call: Save / Update Bounced Cheques Settings (TypeId: 90, FilterId: 1005, FilterText: "bounced_cheques")
  save(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'bounced_cheques',
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
          this.toastr.success('Bounced cheques settings updated successfully!', 'Success');
          if (this.savedTimer) {
            clearTimeout(this.savedTimer);
          }
          this.savedTimer = setTimeout(() => {
            this.saved = false;
          }, 2500);
          this.fetchSettings();
        } else {
          this.toastr.error(res?.message || 'Failed to update bounced cheques settings', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to update bounced cheques settings', 'Error');
        console.error('Save bounced cheques settings error:', err);
      },
    });
  }
}

