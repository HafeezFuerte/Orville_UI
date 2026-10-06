import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_DISCOUNT_PROFILES,
  DISCOUNT_TYPE_OPTIONS,
  DiscountProfile,
  DiscountType,
  EMPTY_DISCOUNT_PROFILE,
} from './discount-profiles.data';

@Component({
  selector: 'app-discount-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './discount-profiles.component.html',
  styleUrl: './discount-profiles.component.scss',
})
export class DiscountProfilesComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  searchQuery = '';
  modalOpen = false;
  editingId: number | null = null;
  isLoading = false;

  draft: Omit<DiscountProfile, 'id'> = { ...EMPTY_DISCOUNT_PROFILE };
  rows: DiscountProfile[] = [];

  readonly discountTypes = DISCOUNT_TYPE_OPTIONS;
  private nextId = 1;

  get filteredRows(): DiscountProfile[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.discountType.toLowerCase().includes(q)
    );
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    return `${n} profile${n === 1 ? '' : 's'}`;
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Discount Profile' : 'Edit Discount Profile';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a reusable discount to apply on invoices and receipts.'
      : 'Update this discount profile configuration.';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0 && this.draft.discountType != null;
  }

  get valueLabel(): string {
    return this.draft.discountType === 'Fixed Amount'
      ? 'Discount Amount'
      : 'Discount Percentage';
  }

  get valuePrefix(): string {
    return this.draft.discountType === 'Fixed Amount' ? 'AED' : '%';
  }

  ngOnInit(): void {
    this.fetchProfiles();
  }

  // API Call: Fetch Profiles (TypeId: 2, FilterId: 1005, FilterText: "discount_profile")
  fetchProfiles(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'discount_profile',
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
                if (Array.isArray(parsed)) {
                  this.rows = parsed;
                  const maxId = this.rows.reduce((max, r) => (r.id > max ? r.id : max), 0);
                  this.nextId = maxId + 1;
                  return;
                }
              } catch (e) {
                console.error('Failed to parse discount_profile strValue:', e);
              }
            }
          }
        }
        // Fallback default profiles if no backend record found
        this.rows = DEFAULT_DISCOUNT_PROFILES.map((r) => ({ ...r }));
        this.nextId = this.rows.length + 1;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load discount profiles', 'Error');
        console.error('Error fetching discount profiles:', err);
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.draft = { ...EMPTY_DISCOUNT_PROFILE };
    this.modalOpen = true;
  }

  openEdit(row: DiscountProfile): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      discountType: row.discountType,
      value: row.value,
      isDefault: row.isDefault,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  onTypeChange(type: DiscountType): void {
    this.draft.discountType = type;
  }

  formatValue(row: DiscountProfile): string {
    if (row.discountType === 'Fixed Amount') {
      return `AED ${row.value}`;
    }
    return `${row.value}%`;
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    const payload: Omit<DiscountProfile, 'id'> = {
      name: this.draft.name.trim(),
      discountType: this.draft.discountType,
      value: Number(this.draft.value) || 0,
      isDefault: !!this.draft.isDefault,
    };

    let updatedRows: DiscountProfile[];
    if (this.editingId == null) {
      const id = this.nextId++;
      updatedRows = [...this.rows, { id, ...payload }];
      if (payload.isDefault) {
        updatedRows = updatedRows.map((row) => ({ ...row, isDefault: row.id === id }));
      }
    } else {
      updatedRows = this.rows.map((row) =>
        row.id === this.editingId ? { ...row, ...payload } : row
      );
      if (payload.isDefault) {
        updatedRows = updatedRows.map((row) => ({
          ...row,
          isDefault: row.id === this.editingId,
        }));
      }
    }
    this.closeModal();
    this.saveProfilesBackend(updatedRows);
  }

  duplicate(row: DiscountProfile): void {
    this.editingId = null;
    this.draft = {
      name: `${row.name} (Copy)`,
      discountType: row.discountType,
      value: row.value,
      isDefault: false,
    };
    this.modalOpen = true;
  }

  deleteProfile(row: DiscountProfile): void {
    const updatedRows = this.rows.filter((r) => r.id !== row.id);
    this.saveProfilesBackend(updatedRows);
  }

  setDefault(row: DiscountProfile): void {
    const updatedRows = this.rows.map((r) => ({
      ...r,
      isDefault: r.id === row.id,
    }));
    this.saveProfilesBackend(updatedRows);
  }

  // API Call: Save / Update Profiles (TypeId: 90, FilterId: 1005, FilterText: "discount_profile")
  private saveProfilesBackend(rowsToSave: DiscountProfile[]): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'discount_profile',
      filterText1: JSON.stringify(rowsToSave),
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200') {
          this.toastr.success('Discount profiles updated successfully!', 'Success');
          this.fetchProfiles();
        } else {
          this.toastr.error(res?.message || 'Failed to update discount profiles', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to update discount profiles', 'Error');
        console.error('Save discount profiles error:', err);
      },
    });
  }
}

