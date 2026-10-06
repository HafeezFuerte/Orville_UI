import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_TAX_PROFILES,
  EMPTY_TAX_PROFILE,
  TaxProfile,
} from './tax-profiles.data';

@Component({
  selector: 'app-tax-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './tax-profiles.component.html',
  styleUrl: './tax-profiles.component.scss',
})
export class TaxProfilesComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  searchQuery = '';
  modalOpen = false;
  editingId: number | null = null;
  isLoading = false;

  draft: Omit<TaxProfile, 'id'> = { ...EMPTY_TAX_PROFILE };
  rows: TaxProfile[] = [];

  private nextId = 1;

  get filteredRows(): TaxProfile[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter((row) => row.name.toLowerCase().includes(q));
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    return `${n} profile${n === 1 ? '' : 's'}`;
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Tax Profile' : 'Edit Tax Profile';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a reusable tax profile for invoices and expenses.'
      : 'Update this tax profile configuration.';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  ngOnInit(): void {
    this.fetchProfiles();
  }

  // API Call: Fetch Profiles (TypeId: 2, FilterId: 1005, FilterText: "tax_profiles")
  fetchProfiles(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'tax_profiles',
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
                console.error('Failed to parse tax_profiles strValue:', e);
              }
            }
          }
        }
        // Fallback default tax profiles if no backend record found
        this.rows = DEFAULT_TAX_PROFILES.map((r) => ({ ...r }));
        this.nextId = this.rows.length + 1;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load tax profiles', 'Error');
        console.error('Error fetching tax profiles:', err);
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.draft = { ...EMPTY_TAX_PROFILE };
    this.modalOpen = true;
  }

  openEdit(row: TaxProfile): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      percentage: row.percentage,
      expenseProfile: row.expenseProfile,
      defaultCommercial: row.defaultCommercial,
      defaultResidential: row.defaultResidential,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  formatPercentage(row: TaxProfile): string {
    return `${row.percentage}%`;
  }

  defaultLabel(row: TaxProfile): string {
    const parts: string[] = [];
    if (row.defaultCommercial) {
      parts.push('Commercial');
    }
    if (row.defaultResidential) {
      parts.push('Residential');
    }
    return parts.length ? parts.join(', ') : '—';
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    const payload: Omit<TaxProfile, 'id'> = {
      name: this.draft.name.trim(),
      percentage: Number(this.draft.percentage) || 0,
      expenseProfile: !!this.draft.expenseProfile,
      defaultCommercial: !!this.draft.defaultCommercial,
      defaultResidential: !!this.draft.defaultResidential,
    };

    let updatedRows: TaxProfile[];
    if (this.editingId == null) {
      const id = this.nextId++;
      updatedRows = [...this.rows, { id, ...payload }];
      updatedRows = this.applyDefaultFlags(updatedRows, id, payload);
    } else {
      updatedRows = this.rows.map((row) =>
        row.id === this.editingId ? { ...row, ...payload } : row
      );
      updatedRows = this.applyDefaultFlags(updatedRows, this.editingId, payload);
    }
    this.closeModal();
    this.saveProfilesBackend(updatedRows);
  }

  /** Only one commercial / residential default at a time. */
  private applyDefaultFlags(
    rows: TaxProfile[],
    activeId: number,
    payload: Omit<TaxProfile, 'id'>
  ): TaxProfile[] {
    return rows.map((row) => ({
      ...row,
      defaultCommercial: payload.defaultCommercial
        ? row.id === activeId
        : row.id === activeId
          ? false
          : row.defaultCommercial,
      defaultResidential: payload.defaultResidential
        ? row.id === activeId
        : row.id === activeId
          ? false
          : row.defaultResidential,
    }));
  }

  deleteProfile(row: TaxProfile): void {
    const updatedRows = this.rows.filter((r) => r.id !== row.id);
    this.saveProfilesBackend(updatedRows);
  }

  // API Call: Save / Update Profiles (TypeId: 90, FilterId: 1005, FilterText: "tax_profiles")
  private saveProfilesBackend(rowsToSave: TaxProfile[]): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'tax_profiles',
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
          this.toastr.success('Tax profiles updated successfully!', 'Success');
          this.fetchProfiles();
        } else {
          this.toastr.error(res?.message || 'Failed to update tax profiles', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to update tax profiles', 'Error');
        console.error('Save tax profiles error:', err);
      },
    });
  }
}

