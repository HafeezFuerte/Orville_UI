import { TranslateModule } from '@ngx-translate/core';
import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  CUSTOM_FIELD_DATA_TYPES,
  CUSTOM_FIELD_MODULES,
  CustomFieldColumnDef,
  CustomFieldDataType,
  CustomFieldDraft,
  CustomFieldModule,
  CustomFieldRow,
  DEFAULT_CUSTOM_FIELDS,
  EMPTY_CUSTOM_FIELD,
} from './custom-fields.data';

type SortKey =
  | 'fieldName'
  | 'fieldLabel'
  | 'dataType'
  | 'module'
  | 'visibleToTenant'
  | 'visibleToLandlord'
  | 'useForVerification';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-custom-fields',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent, TranslateModule],
  templateUrl: './custom-fields.component.html',
  styleUrl: './custom-fields.component.scss',
})
export class CustomFieldsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  private static readonly STORAGE_KEY = 'orville_custom_fields';

  searchQuery = '';
  columnSearch = '';
  filterModule: CustomFieldModule | '' = '';
  filterDataType: CustomFieldDataType | '' = '';
  showColumns = false;
  showFilters = false;
  modalOpen = false;
  editingId: number | null = null;
  isLoading = false;
  isSaving = false;

  sortKey: SortKey = 'fieldName';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: CustomFieldDraft = { ...EMPTY_CUSTOM_FIELD };
  rows: CustomFieldRow[] = DEFAULT_CUSTOM_FIELDS.map((r) => ({ ...r }));

  readonly modules = CUSTOM_FIELD_MODULES;
  readonly dataTypes = CUSTOM_FIELD_DATA_TYPES;

  columns: CustomFieldColumnDef[] = [
    { key: 'fieldName', label: 'Field Name', visible: true },
    { key: 'fieldLabel', label: 'Field Label', visible: true },
    { key: 'dataType', label: 'Data Type', visible: true },
    { key: 'module', label: 'Module', visible: true },
    { key: 'visibleToTenant', label: 'Visible to Tenant', visible: true },
    { key: 'visibleToLandlord', label: 'Visible to Landlord', visible: true },
    { key: 'useForVerification', label: 'Use For Verification', visible: true },
    { key: 'actions', label: 'Action', visible: true },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.loadCachedFields();
    this.fetchCustomFields();
  }

  private loadCachedFields(): void {
    try {
      const cached = localStorage.getItem(CustomFieldsComponent.STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.rows = parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load cached custom_fields:', e);
    }
  }

  fetchCustomFields(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'custom_fields',
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
              if (Array.isArray(parsed) && parsed.length > 0) {
                this.rows = parsed;
                localStorage.setItem(CustomFieldsComponent.STORAGE_KEY, JSON.stringify(this.rows));
                return;
              }
            } catch (e) {
              console.error('Failed to parse custom_fields strValue:', e);
            }
          }
        }
        // If backend returned -200 or empty, keep cached fields if they exist
        const cached = localStorage.getItem(CustomFieldsComponent.STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              this.rows = parsed;
              return;
            }
          } catch (e) {}
        }
        this.rows = DEFAULT_CUSTOM_FIELDS.map((r) => ({ ...r }));
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching custom fields:', err);
        const cached = localStorage.getItem(CustomFieldsComponent.STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              this.rows = parsed;
              return;
            }
          } catch (e) {}
        }
        this.rows = DEFAULT_CUSTOM_FIELDS.map((r) => ({ ...r }));
      },
    });
  }

  get filteredRows(): CustomFieldRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (this.filterModule && row.module !== this.filterModule) {
        return false;
      }
      if (this.filterDataType && row.dataType !== this.filterDataType) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.fieldName.toLowerCase().includes(q) ||
        row.fieldLabel.toLowerCase().includes(q) ||
        row.dataType.toLowerCase().includes(q) ||
        row.module.toLowerCase().includes(q)
      );
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = a[this.sortKey];
      const bv = b[this.sortKey];
      if (typeof av === 'boolean' && typeof bv === 'boolean') {
        return (Number(av) - Number(bv)) * dir;
      }
      return String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' }) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get pagedRows(): CustomFieldRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('fieldName')) {
      parts.push('minmax(140px, 1.1fr)');
    }
    if (this.isColumnVisible('fieldLabel')) {
      parts.push('minmax(130px, 1fr)');
    }
    if (this.isColumnVisible('dataType')) {
      parts.push('minmax(110px, 0.9fr)');
    }
    if (this.isColumnVisible('module')) {
      parts.push('minmax(100px, 0.8fr)');
    }
    if (this.isColumnVisible('visibleToTenant')) {
      parts.push('120px');
    }
    if (this.isColumnVisible('visibleToLandlord')) {
      parts.push('130px');
    }
    if (this.isColumnVisible('useForVerification')) {
      parts.push('140px');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): CustomFieldColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get activeFilterCount(): number {
    return (this.filterModule ? 1 : 0) + (this.filterDataType ? 1 : 0);
  }

  get emptyMessage(): string {
    if (this.rows.length === 0) {
      return 'No custom fields yet.';
    }
    return 'No custom fields match your filters.';
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Custom Field' : 'Edit Custom Field';
  }

  get canSubmit(): boolean {
    return this.draft.fieldName.trim().length > 0 && this.draft.fieldLabel.trim().length > 0;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  yesNo(value: boolean): string {
    return value ? 'Yes' : 'No';
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  onSearchChange(): void {
    this.pageIndex = 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showColumns = false;
    }
  }

  clearFilters(): void {
    this.filterModule = '';
    this.filterDataType = '';
    this.pageIndex = 0;
  }

  applyFilterModule(value: CustomFieldModule | ''): void {
    this.filterModule = value;
    this.pageIndex = 0;
  }

  applyFilterDataType(value: CustomFieldDataType | ''): void {
    this.filterDataType = value;
    this.pageIndex = 0;
  }

  toggleColumns(): void {
    this.showColumns = !this.showColumns;
    if (this.showColumns) {
      this.columnSearch = '';
      this.showFilters = false;
    }
  }

  closeColumns(): void {
    this.showColumns = false;
  }

  toggleSelectAllColumns(checked: boolean): void {
    this.columns = this.columns.map((c) => ({ ...c, visible: checked }));
  }

  clearColumns(): void {
    this.columns = this.columns.map((c) => ({
      ...c,
      visible: c.key === 'fieldName' || c.key === 'fieldLabel' || c.key === 'actions',
    }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (this.showColumns) {
      const root = this.host.nativeElement.querySelector('[data-columns-dropdown]');
      if (root && target && !root.contains(target)) {
        this.showColumns = false;
      }
    }
    if (this.showFilters) {
      const root = this.host.nativeElement.querySelector('[data-filters-dropdown]');
      if (root && target && !root.contains(target)) {
        this.showFilters = false;
      }
    }
  }

  openCreate(): void {
    this.editingId = null;
    this.draft = { ...EMPTY_CUSTOM_FIELD };
    this.modalOpen = true;
  }

  openEdit(row: CustomFieldRow): void {
    this.editingId = row.id;
    this.draft = {
      fieldName: row.fieldName,
      fieldLabel: row.fieldLabel,
      dataType: row.dataType,
      module: row.module,
      visibleToTenant: row.visibleToTenant,
      visibleToLandlord: row.visibleToLandlord,
      useForVerification: row.useForVerification,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    if (!this.canSubmit || this.isSaving) {
      return;
    }
    this.isSaving = true;
    let updatedRows: CustomFieldRow[];
    if (this.editingId == null) {
      const maxId = this.rows.reduce((m, r) => (r.id > m ? r.id : m), 0);
      const newField: CustomFieldRow = {
        id: maxId + 1,
        fieldName: this.draft.fieldName.trim(),
        fieldLabel: this.draft.fieldLabel.trim(),
        dataType: this.draft.dataType,
        module: this.draft.module,
        visibleToTenant: this.draft.visibleToTenant,
        visibleToLandlord: this.draft.visibleToLandlord,
        useForVerification: this.draft.useForVerification,
      };
      updatedRows = [...this.rows, newField];
    } else {
      updatedRows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              fieldName: this.draft.fieldName.trim(),
              fieldLabel: this.draft.fieldLabel.trim(),
              dataType: this.draft.dataType,
              module: this.draft.module,
              visibleToTenant: this.draft.visibleToTenant,
              visibleToLandlord: this.draft.visibleToLandlord,
              useForVerification: this.draft.useForVerification,
            }
          : r
      );
    }

    this.rows = updatedRows;
    localStorage.setItem(CustomFieldsComponent.STORAGE_KEY, JSON.stringify(this.rows));

    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'custom_fields',
      filterText1: JSON.stringify(updatedRows),
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res?.statusCode === '200') {
          this.toastr.success('Custom field saved successfully', 'Success');
          this.closeModal();
        } else {
          this.toastr.error(res?.message || 'Failed to save custom field', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving custom field:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save custom field';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: CustomFieldRow): void {
    if (!confirm(`Are you sure you want to delete "${row.fieldLabel}"?`)) {
      return;
    }
    const updatedRows = this.rows.filter((r) => r.id !== row.id);
    this.rows = updatedRows;
    localStorage.setItem(CustomFieldsComponent.STORAGE_KEY, JSON.stringify(this.rows));
    if (this.pageIndex > Math.max(0, Math.ceil(this.totalFiltered / this.pageSize) - 1)) {
      this.pageIndex = Math.max(0, Math.ceil(this.totalFiltered / this.pageSize) - 1);
    }

    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'custom_fields',
      filterText1: JSON.stringify(updatedRows),
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Custom field deleted successfully', 'Success');
        } else {
          this.toastr.error(res?.message || 'Failed to delete custom field', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting custom field:', err);
        this.toastr.error('Failed to delete custom field', 'Error');
      },
    });
  }
}
