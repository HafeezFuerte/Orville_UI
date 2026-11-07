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
  CustomFieldDataTypeOption,
  CustomFieldDraft,
  CustomFieldModule,
  CustomFieldRow,
  DEFAULT_CUSTOM_FIELDS,
  DEFAULT_DATA_TYPES,
  EMPTY_CUSTOM_FIELD,
} from './custom-fields.data';
import { NgSelectModule } from '@ng-select/ng-select';
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
  imports: [CommonModule,NgSelectModule, FormsModule, OvPaginatorComponent, TranslateModule],
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
  filterDataType: string = '';
  showColumns = false;
  showFilters = false;
  modalOpen = false;
  editingId: number | null = null;
  isLoading = false;
  isSaving = false;
  selectedScreen: string | null = null;
  screens = ['Leases', 'Workorder', 'Invoices', 'Quotations', 'Expenses', 'Property'];
  fieldNameManuallyEdited = false;
  sortKey: SortKey = 'fieldName';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: CustomFieldDraft = { ...EMPTY_CUSTOM_FIELD };
  rows: CustomFieldRow[] = [];

  readonly modules = CUSTOM_FIELD_MODULES;
  dataTypes: CustomFieldDataTypeOption[] = [...DEFAULT_DATA_TYPES];

  columns: CustomFieldColumnDef[] = [
    { key: 'fieldName', label: 'Field Name', visible: true },
    { key: 'fieldLabel', label: 'Field Label', visible: true },
    { key: 'dataType', label: 'Data Type', visible: true },
    { key: 'module', label: 'Module', visible: true },
    { key: 'sortOrder', label: 'Sort Order', visible: true },
    { key: 'isMandatory', label: 'Mandatory', visible: true },
    { key: 'visibleToTenant', label: 'Visible to Tenant', visible: true },
    { key: 'visibleToLandlord', label: 'Visible to Landlord', visible: true },
    { key: 'useForVerification', label: 'Use For Verification', visible: true },
    { key: 'actions', label: 'Action', visible: true },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
   // this.loadCachedFields();
    this.fetchCustomFields();
  }
  onscreenChange(ev: any) {
    const selected = (typeof ev === 'object' && ev !== null) ? (ev.name || ev.value || ev) : ev;
    this.selectedScreen = selected || this.selectedScreen;
    this.rows=[];
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
      typeId: -8,
      filterId: 0,
      filterText: this.selectedScreen || this.filterModule || '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false; 
        if (res?.statusCode === '200' && res.objResult) {
          // 1. Dynamic Data Types from table1 (USP_APP_GETMASTERS typeId: -8)
          if (Array.isArray(res.objResult.table1) && res.objResult.table1.length > 0) {
            this.dataTypes = res.objResult.table1.map((t: any) => ({
              id: t.id,
              name: t.name,
            }));
          }

          // 2. Custom Fields Records from table
          const records =
            res.objResult.table ||
            res.objResult.table0 ||
            (Array.isArray(res.objResult) ? res.objResult : []);

          if (Array.isArray(records) && records.length > 0) {
            if (
              records[0].alias_name ||
              records[0].column_name ||
              records[0].field_name ||
              records[0].control_type ||
              records[0].feature
            ) {
              this.rows = records.map((r: any, idx: number) => ({
                id: Number(r.id) || idx + 1,
                fieldName: r.column_name || r.field_name || r.alias_name || '',
                fieldLabel: r.alias_name || r.field_label || r.name || '',
                dataType: r.control_type || 'TX',
                module: r.feature || r.module || 'Property',
                sortOrder: Number(r.sort_order) || 0,
                isMandatory: !!r.is_mandatory,
                isReadonly: !!r.is_readonly,
                isVisible: r.is_visible !== false,
                minLength: Number(r.min_length) || 0,
                maxLength: Number(r.max_length) || 0,
                probableValues: r.probable_values || '',
                defaultValue: r.defaultvalue || '',
                visibleToTenant: !!(r.is_visible_to_tenant ?? r.visibleToTenant),
                visibleToLandlord: !!(r.is_visible_to_landlord ?? r.visibleToLandlord),
                useForVerification: !!(r.is_used_for_verification ?? r.use_for_verification ?? r.useForVerification),
                dependencyId: Number(r.dependency_id) || 0,
                dependencyType: Number(r.dependency_type) || 0,
              }));
              localStorage.setItem(CustomFieldsComponent.STORAGE_KEY, JSON.stringify(this.rows));
              return;
            }
          }
        }
        // If backend returned empty or -200, check cache
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

  get pagedRows(): any {
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
    if (this.isColumnVisible('sortOrder')) {
      parts.push('90px');
    }
    if (this.isColumnVisible('isMandatory')) {
      parts.push('100px');
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
    return !!(
      (this.draft.fieldName && this.draft.fieldName.trim().length > 0) ||
      (this.draft.fieldLabel && this.draft.fieldLabel.trim().length > 0)
    );
  }

  onFieldLabelInput(): void {
    if (!this.editingId && !this.fieldNameManuallyEdited) {
      this.draft.fieldName = (this.draft.fieldLabel || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    }
  }

  onFieldNameInput(): void {
    this.fieldNameManuallyEdited = true;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  yesNo(value: boolean): string {
    return value ? 'Yes' : 'No';
  }

  getDataTypeLabel(val: string): string {
    if (!val) return '';
    const match = this.dataTypes.find(
      (t) => t.id === val || t.name?.toLowerCase() === val?.toLowerCase()
    );
    return match ? match.name : val;
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
    this.fetchCustomFields();
  }

  applyFilterModule(value: CustomFieldModule | ''): void {
    this.filterModule = value;
    this.pageIndex = 0;
    this.fetchCustomFields();
  }

  applyFilterDataType(value: string): void {
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
    this.fieldNameManuallyEdited = false;
    this.draft = {
      ...EMPTY_CUSTOM_FIELD,
      module: this.filterModule || 'Property',
      dataType: this.dataTypes.length > 0 ? this.dataTypes[0].id : 'TX',
      sortOrder: this.rows.length + 1,
    };
    this.modalOpen = true;
    setTimeout(() => {
      const el = document.querySelector('.cf-modal-body');
      if (el) el.scrollTop = 0;
    }, 0);
  }

  openEdit(row: any): void {
    this.editingId = row.id;
    this.fieldNameManuallyEdited = true;
    this.draft = {
      fieldName: row.fieldName || row.column_name || row.field_name || '',
      fieldLabel: row.fieldLabel || row.alias_name || row.field_label || '',
      dataType: row.dataType || row.control_type || 'TX',
      module: row.module || row.feature || 'Property',
      sortOrder: row.sortOrder ?? row.sort_order ?? 0,
      isMandatory: !!(row.isMandatory ?? row.is_mandatory),
      isReadonly: !!(row.isReadonly ?? row.is_readonly),
      isVisible: (row.isVisible ?? row.is_visible) !== false,
      minLength: row.minLength ?? row.min_length ?? 0,
      maxLength: row.maxLength ?? row.max_length ?? 0,
      probableValues: row.probableValues || row.probable_values || '',
      defaultValue: row.defaultValue || row.defaultvalue || '',
      visibleToTenant: !!(row.visibleToTenant ?? row.is_visible_to_tenant),
      visibleToLandlord: !!(row.visibleToLandlord ?? row.is_visible_to_landlord),
      useForVerification: !!(row.useForVerification ?? row.is_used_for_verification),
      dependencyId: row.dependencyId ?? row.dependency_id ?? 0,
      dependencyType: row.dependencyType ?? row.dependency_type ?? 0,
    };
    this.modalOpen = true;
    setTimeout(() => {
      const el = document.querySelector('.cf-modal-body');
      if (el) el.scrollTop = 0;
    }, 0);
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    if (this.isSaving) {
      return;
    }

    const fieldLabel = (this.draft.fieldLabel || '').trim();
    let fieldName = (this.draft.fieldName || '').trim();

    if (!fieldLabel && !fieldName) {
      this.toastr.warning('Please enter a Field Label and Field Name.', 'Validation Warning');
      return;
    }

    if (!fieldName) {
      fieldName = fieldLabel
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      this.draft.fieldName = fieldName;
    }
    if (!fieldLabel) {
      this.draft.fieldLabel = fieldName;
    }

    this.isSaving = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      userid: Number(user?.userId) || 1,
      company_id: Number(user?.companyId) || 1,
      clientId: user?.clientId || '',
      source: 'web',
      languageid: 1,
      id: Number(this.editingId) || 0,
      sort_order: Number(this.draft.sortOrder) || 0,
      dependency_id: Number(this.draft.dependencyId) || 0,
      dependency_type: Number(this.draft.dependencyType) || 0,
      feature: this.draft.module,
      alias_name: (this.draft.fieldLabel || '').trim(),
      control_type: this.draft.dataType || 'TX',
      is_mandatory: !!this.draft.isMandatory,
      is_readonly: !!this.draft.isReadonly,
      is_visible: !!this.draft.isVisible,
      min_length: Number(this.draft.minLength) || 0,
      max_length: Number(this.draft.maxLength) || 0,
      probable_values: this.draft.probableValues || '',
      defaultvalue: this.draft.defaultValue?.trim() || this.draft.fieldName?.trim() || '',
      is_visible_to_tenant: !!this.draft.visibleToTenant,
      is_visible_to_landlord: !!this.draft.visibleToLandlord,
      use_for_verification: !!this.draft.useForVerification,
    };

    const url = environment.apiurl + 'api/Masters/save_extra_field';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res?.statusCode === '200' || res?.status === 200 || res?.isSuccess || !res?.isError) {
          this.toastr.success('Custom field saved successfully', 'Success');
          const savedRecords = res?.objResult?.table || res?.objResult?.table0 || (Array.isArray(res?.objResult) ? res.objResult : []);
          if (Array.isArray(savedRecords) && savedRecords.length > 0) {
            const mappedRows = savedRecords.map((r: any, idx: number) => ({
              id: Number(r.id) || idx + 1,
              fieldName: r.column_name || r.field_name || r.alias_name || '',
              fieldLabel: r.alias_name || r.field_label || r.name || '',
              dataType: r.control_type || 'TX',
              module: r.feature || r.module || 'Property',
              sortOrder: Number(r.sort_order) || 0,
              isMandatory: !!r.is_mandatory,
              isReadonly: !!r.is_readonly,
              isVisible: r.is_visible !== false,
              minLength: Number(r.min_length) || 0,
              maxLength: Number(r.max_length) || 0,
              probableValues: r.probable_values || '',
              defaultValue: r.defaultvalue || '',
              visibleToTenant: !!(r.is_visible_to_tenant ?? r.visibleToTenant),
              visibleToLandlord: !!(r.is_visible_to_landlord ?? r.visibleToLandlord),
              useForVerification: !!(r.is_used_for_verification ?? r.use_for_verification ?? r.useForVerification),
              dependencyId: Number(r.dependency_id) || 0,
              dependencyType: Number(r.dependency_type) || 0,
            }));
            mappedRows.forEach((newR: any) => {
              const idx = this.rows.findIndex((existing) => existing.id === newR.id);
              if (idx >= 0) {
                this.rows[idx] = newR;
              } else {
                this.rows.unshift(newR);
              }
            });
            localStorage.setItem(CustomFieldsComponent.STORAGE_KEY, JSON.stringify(this.rows));
          }
          this.fetchCustomFields();
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
    this.rows = this.rows.filter((r) => r.id !== row.id);
    localStorage.setItem(CustomFieldsComponent.STORAGE_KEY, JSON.stringify(this.rows));
    if (this.pageIndex > Math.max(0, Math.ceil(this.totalFiltered / this.pageSize) - 1)) {
      this.pageIndex = Math.max(0, Math.ceil(this.totalFiltered / this.pageSize) - 1);
    }

    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: -1,
      filterId: -1,
      filterText: String(row.id),
      filterText1: 'extra_field',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Custom field deleted successfully', 'Success');
          this.fetchCustomFields();
        } else {
          this.toastr.success('Custom field deleted successfully', 'Success');
        }
      },
      error: (err) => {
        console.error('Error deleting custom field:', err);
        this.toastr.error('Failed to delete custom field', 'Error');
      },
    });
  }
}
