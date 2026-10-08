import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  ChecklistKind,
  DAY_OF_MONTH_OPTIONS,
  DEFAULT_LEASE_SETTINGS,
  FIXED_PAYMENT_ACCOUNTS,
  FIXED_PAYMENT_TYPES,
  LEASE_PENALTY_ACCOUNTS,
  LEASE_TOGGLES,
  LeaseAccountOption,
  LeaseChecklistItem,
  LeaseFixedPayment,
  LeaseSettingsModel,
  LeaseTerm,
  LeaseToggleDef,
  MONEY_HELD_HELP,
  MONEY_HELD_OPTIONS,
} from './lease-settings.data';

@Component({
  selector: 'app-lease-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './lease-settings.component.html',
  styleUrl: './lease-settings.component.scss',
})
export class LeaseSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  readonly accounts: LeaseAccountOption[] = LEASE_PENALTY_ACCOUNTS;
  readonly paymentAccounts: LeaseAccountOption[] = FIXED_PAYMENT_ACCOUNTS;
  readonly moneyHeldOptions = MONEY_HELD_OPTIONS;
  readonly dayOptions = DAY_OF_MONTH_OPTIONS;
  readonly paymentTypes = FIXED_PAYMENT_TYPES;
  readonly toggles: LeaseToggleDef[] = LEASE_TOGGLES;
  readonly moneyHeldHelp = MONEY_HELD_HELP;

  model: LeaseSettingsModel = this.cloneDefaults();
  glAccountsList: { id: string; name: string; code: string }[] = [];
  isLoading = false;

  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;
  private nextId = 100;

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
            this.glAccountsList = records.map((acc: any) => ({
              id: acc.account_code || acc.code || String(acc.id),
              code: acc.code || acc.account_code || '',
              name: `${acc.account_name}${acc.account_code ? ' (' + acc.account_code + ')' : ''}`,
            }));
          }
        }
      },
      error: (err) => {
        console.error('Error fetching GL accounts for lease settings:', err);
      },
    });
  }

  // API Call: Fetch Lease Settings (TypeId: 2, FilterId: 1005, FilterText: "lease_settings")
  fetchSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'lease_settings',
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
                    ...this.cloneDefaults(),
                    ...parsed,
                  };
                }
              } catch (e) {
                console.error('Failed to parse lease_settings strValue:', e);
              }
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching lease settings:', err);
      },
    });
  }

  checklistModalOpen = false;
  checklistKind: ChecklistKind = 'moveOut';
  checklistEditingId: number | null = null;
  checklistDraft = '';

  paymentModalOpen = false;
  paymentEditingId: number | null = null;
  paymentDraft: Omit<LeaseFixedPayment, 'id'> = {
    account: '',
    amount: '',
    type: 'Fixed',
    description: '',
  };

  termModalOpen = false;
  termEditingId: number | null = null;
  termDraft: Omit<LeaseTerm, 'id'> = { title: '' };

  getToggle(key: LeaseToggleDef['key']): boolean {
    return !!this.model[key];
  }

  setToggle(key: LeaseToggleDef['key'], value: boolean): void {
    this.model[key] = value;
  }

  checklistItems(kind: ChecklistKind): LeaseChecklistItem[] {
    if (kind === 'moveOut') return this.model.moveOutChecklists;
    if (kind === 'moveIn') return this.model.moveInChecklists;
    return this.model.renewalChecklists;
  }

  openChecklistModal(kind: ChecklistKind, item?: LeaseChecklistItem): void {
    this.checklistKind = kind;
    this.checklistEditingId = item?.id ?? null;
    this.checklistDraft = item?.name ?? '';
    this.checklistModalOpen = true;
  }

  closeChecklistModal(): void {
    this.checklistModalOpen = false;
    this.checklistEditingId = null;
    this.checklistDraft = '';
  }

  saveChecklist(): void {
    const name = this.checklistDraft.trim();
    if (!name) return;
    const list = this.checklistItems(this.checklistKind);
    if (this.checklistEditingId != null) {
      const next = list.map((i) =>
        i.id === this.checklistEditingId ? { ...i, name } : i
      );
      this.setChecklistList(this.checklistKind, next);
    } else {
      this.setChecklistList(this.checklistKind, [...list, { id: this.nextId++, name }]);
    }
    this.closeChecklistModal();
  }

  removeChecklist(kind: ChecklistKind, id: number): void {
    this.setChecklistList(
      kind,
      this.checklistItems(kind).filter((i) => i.id !== id)
    );
  }

  openPaymentModal(item?: LeaseFixedPayment): void {
    this.paymentEditingId = item?.id ?? null;
    this.paymentDraft = item
      ? {
          account: item.account,
          amount: item.amount,
          type: item.type,
          description: item.description,
        }
      : { account: '', amount: '', type: 'Fixed', description: '' };
    this.paymentModalOpen = true;
  }

  closePaymentModal(): void {
    this.paymentModalOpen = false;
    this.paymentEditingId = null;
  }

  savePayment(): void {
    const row = { ...this.paymentDraft };
    if (!row.account.trim() || !row.type.trim() || String(row.amount).trim() === '') {
      return;
    }
    if (this.paymentEditingId != null) {
      this.model.fixedPayments = this.model.fixedPayments.map((p) =>
        p.id === this.paymentEditingId ? { id: p.id, ...row } : p
      );
    } else {
      this.model.fixedPayments = [
        ...this.model.fixedPayments,
        { id: this.nextId++, ...row },
      ];
    }
    this.closePaymentModal();
  }

  removePayment(id: number): void {
    this.model.fixedPayments = this.model.fixedPayments.filter((p) => p.id !== id);
  }

  openTermModal(item?: LeaseTerm): void {
    this.termEditingId = item?.id ?? null;
    this.termDraft = item ? { title: item.title } : { title: '' };
    this.termModalOpen = true;
  }

  closeTermModal(): void {
    this.termModalOpen = false;
    this.termEditingId = null;
  }

  saveTerm(): void {
    const title = this.termDraft.title.trim();
    if (!title) return;
    if (this.termEditingId != null) {
      this.model.leaseTerms = this.model.leaseTerms.map((t) =>
        t.id === this.termEditingId ? { id: t.id, title } : t
      );
    } else {
      this.model.leaseTerms = [...this.model.leaseTerms, { id: this.nextId++, title }];
    }
    this.closeTermModal();
  }

  removeTerm(id: number): void {
    this.model.leaseTerms = this.model.leaseTerms.filter((t) => t.id !== id);
  }

  // API Call: Save / Update Lease Settings (TypeId: 90, FilterId: 1005, FilterText: "lease_settings")
  save(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'lease_settings',
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
          this.toastr.success('Lease settings saved successfully!', 'Success');
          if (this.savedTimer) clearTimeout(this.savedTimer);
          this.savedTimer = setTimeout(() => {
            this.saved = false;
          }, 2500);
        } else {
          this.toastr.error(res?.message || 'Failed to save lease settings', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to save lease settings', 'Error');
        console.error('Error saving lease settings:', err);
      },
    });
  }

  private setChecklistList(kind: ChecklistKind, items: LeaseChecklistItem[]): void {
    if (kind === 'moveOut') this.model.moveOutChecklists = items;
    else if (kind === 'moveIn') this.model.moveInChecklists = items;
    else this.model.renewalChecklists = items;
  }

  private cloneDefaults(): LeaseSettingsModel {
    const d = DEFAULT_LEASE_SETTINGS;
    return {
      ...d,
      moveOutChecklists: d.moveOutChecklists.map((i) => ({ ...i })),
      moveInChecklists: d.moveInChecklists.map((i) => ({ ...i })),
      renewalChecklists: d.renewalChecklists.map((i) => ({ ...i })),
      fixedPayments: d.fixedPayments.map((i) => ({ ...i })),
      leaseTerms: d.leaseTerms.map((i) => ({ ...i })),
    };
  }
}
