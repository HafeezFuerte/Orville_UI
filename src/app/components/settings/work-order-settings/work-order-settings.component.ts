import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_WORK_ORDER_SETTINGS,
  WORK_ORDER_OPTIONS,
  WORK_ORDER_USERS,
  WorkOrderOptionDef,
  WorkOrderSettingsModel,
  WorkOrderUserOption,
} from './work-order-settings.data';

@Component({
  selector: 'app-work-order-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './work-order-settings.component.html',
  styleUrl: './work-order-settings.component.scss',
})
export class WorkOrderSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  users: WorkOrderUserOption[] = [...WORK_ORDER_USERS];
  readonly options: WorkOrderOptionDef[] = WORK_ORDER_OPTIONS;

  model: WorkOrderSettingsModel = {
    ...DEFAULT_WORK_ORDER_SETTINGS,
    participantIds: [],
  };

  draftParticipantId = '';
  saved = false;
  isLoading = false;
  isSaving = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  private static readonly STORAGE_KEY = 'orville_work_order_settings';

  ngOnInit(): void {
    this.loadCachedSettings();
    this.loadUsers();
    this.fetchSettings();
  }

  private loadCachedSettings(): void {
    try {
      const cached = localStorage.getItem(WorkOrderSettingsComponent.STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const data = Array.isArray(parsed) ? parsed[0] : parsed;
        if (data && typeof data === 'object') {
          this.model = {
            ...DEFAULT_WORK_ORDER_SETTINGS,
            ...data,
            participantIds: Array.isArray(data.participantIds) ? data.participantIds : [],
          };
        }
      }
    } catch (e) {
      console.error('Failed to load cached work_order_settings:', e);
    }
  }

  loadUsers(): void {
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 19,
      filterId: 0,
      filterText: 'S',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200' && res.objResult?.table) {
          const list = res.objResult.table;
          if (Array.isArray(list) && list.length > 0) {
            this.users = list.map((u: any) => ({
              id: String(u.code || u.id || u.user_code || ''),
              name: u.name || u.lookup_name || u.user_name || u.full_name || u.first_name || u.code || '',
            }));
          }
        }
      },
      error: (err) => {
        console.error('Error loading users for work order settings:', err);
      },
    });
  }

  fetchSettings(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'work_order_settings',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.statusCode === '200' && res.objResult) {
          const records = res.objResult.table || res.objResult.table0 || res.objResult;
          if (Array.isArray(records) && records.length > 0 && records[0].strValue) {
            try {
              const parsed = JSON.parse(records[0].strValue);
              const data = Array.isArray(parsed) ? parsed[0] : parsed;
              if (data && typeof data === 'object') {
                this.model = {
                  ...DEFAULT_WORK_ORDER_SETTINGS,
                  ...data,
                  participantIds: Array.isArray(data.participantIds) ? data.participantIds : [],
                };
                localStorage.setItem(WorkOrderSettingsComponent.STORAGE_KEY, JSON.stringify(this.model));
              }
            } catch (e) {
              console.error('Failed to parse work_order_settings strValue:', e);
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching work order settings:', err);
      },
    });
  }

  get availableUsers(): WorkOrderUserOption[] {
    return this.users.filter((u) => !this.model.participantIds.includes(u.id));
  }

  userName(id: string): string {
    return this.users.find((u) => u.id === id)?.name ?? id;
  }

  addParticipant(): void {
    const id = this.draftParticipantId;
    if (!id || this.model.participantIds.includes(id)) {
      return;
    }
    this.model.participantIds = [...this.model.participantIds, id];
    this.draftParticipantId = '';
  }

  removeParticipant(id: string): void {
    this.model.participantIds = this.model.participantIds.filter((x) => x !== id);
  }

  getOption(key: WorkOrderOptionDef['key']): boolean {
    return !!this.model[key];
  }

  setOption(key: WorkOrderOptionDef['key'], value: boolean): void {
    this.model[key] = value;
  }

  save(): void {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    localStorage.setItem(WorkOrderSettingsComponent.STORAGE_KEY, JSON.stringify(this.model));
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'work_order_settings',
      filterText1: JSON.stringify(this.model),
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res?.statusCode === '200') {
          this.saved = true;
          this.toastr.success('Work order settings updated successfully', 'Success');
          if (this.savedTimer) {
            clearTimeout(this.savedTimer);
          }
          this.savedTimer = setTimeout(() => {
            this.saved = false;
          }, 2500);
        } else {
          this.toastr.error(res?.message || 'Failed to update work order settings', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving work order settings:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to update work order settings';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }
}
