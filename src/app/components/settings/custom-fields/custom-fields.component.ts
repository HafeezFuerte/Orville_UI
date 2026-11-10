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
  screens = ['Property', 'Units', 'Rooms', 'Tenants', 'Landlords', 'Vendors', 'Leases', 'Work Orders', 'Tickets', 'Invoices', 'Expenses'];
  fieldNameManuallyEdited = false;
  sortKey: SortKey = 'fieldName';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: CustomFieldDraft = { ...EMPTY_CUSTOM_FIELD };
  rows: CustomFieldRow[] = [];

  readonly modules = CUSTOM_FIELD_MODULES;
  dataTypes: CustomFieldDataTypeOption[] = [...DEFAULT_DATA_TYPES];

  lookupTypes: Array<{ id: number; lookup_name: string }> = [];
  lookupDataList: Array<{ id: number; name: string; code?: string }> = [];
  isLoadingLookupTypes = false;
  isLoadingLookupData = false;

  columns: CustomFieldColumnDef[] = [
    { key: 'fieldName', label: 'Field Name', visible: false },
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
    this.fetchLookupTypes();
   // this.loadCachedFields();
    this.fetchCustomFields();
  }
  onscreenChange(ev: any) {
    const selected = (typeof ev === 'object' && ev !== null) ? (ev.name || ev.value || ev) : ev;
    this.selectedScreen = selected || null;
    this.rows = [];
    if (!this.selectedScreen) {
      this.isLoading = false;
      return;
    }
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
    if (!this.selectedScreen) {
      this.rows = [];
      this.isLoading = false;
      return;
    }
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
              this.rows = records.map((r: any, idx: number) => {
                let defVal = (r.defaultvalue || r.defaultValue || '').trim();
                const colName = (r.column_name || r.field_name || r.alias_name || '').trim();
                if (defVal.toLowerCase() === colName.toLowerCase()) {
                  defVal = '';
                }
                return {
                  id: Number(r.id) || idx + 1,
                  fieldName: colName,
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
                  defaultValue: defVal,
                  visibleToTenant: !!(r.is_visible_to_tenant ?? r.visibleToTenant),
                  visibleToLandlord: !!(r.is_visible_to_landlord ?? r.visibleToLandlord),
                  useForVerification: !!(r.is_used_for_verification ?? r.use_for_verification ?? r.useForVerification),
                  dependencyId: Number(r.dependency_id) || 0,
                  dependencyType: Number(r.dependency_type) || 0,
                };
              });
              localStorage.setItem(CustomFieldsComponent.STORAGE_KEY, JSON.stringify(this.rows));
              return;
            }
          }
          // Backend returned statusCode 200 with 0 custom fields for this screen
          this.rows = [];
          localStorage.removeItem(CustomFieldsComponent.STORAGE_KEY);
          return;
        }
        // Non-200 response
        this.rows = [];
        localStorage.removeItem(CustomFieldsComponent.STORAGE_KEY);
      },
      error: (err) => {
        this.isLoading = false;
        this.rows = [];
      },
    });
  }

  get filteredRows(): CustomFieldRow[] {
    if (!this.selectedScreen) {
      return [];
    }
    const q = this.searchQuery.trim().toLowerCase();
    const activeScreen = this.selectedScreen.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (row.module && row.module.trim().toLowerCase() !== activeScreen) {
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
    if (!this.selectedScreen) {
      return 'Please select a screen to view custom fields.';
    }
    if (this.rows.length === 0) {
      return 'No custom fields yet.';
    }
    return 'No custom fields match your filters.';
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Custom Field' : 'Edit Custom Field';
  }

  get isNumericType(): boolean {
    const t = (this.draft.dataType || '').trim().toLowerCase();
    return t === 'nm' || t === 'numeric' || t === 'integer' || t.startsWith('numeric');
  }

  get isSelectType(): boolean {
    const t = (this.draft.dataType || '').trim().toLowerCase();
    return t === 'dl' || t === 'select' || t === 'single select' || t.startsWith('select (dl)');
  }

  get isSelectPickerType(): boolean {
    const t = (this.draft.dataType || '').trim().toLowerCase();
    return t === 'dp' || t === 'selectpicker' || t === 'select picker' || t.startsWith('selectpicker');
  }

  onDataTypeChange(): void {
    if (!this.isNumericType) {
      this.draft.minLength = 0;
      this.draft.maxLength = 0;
    }
    if (!this.isSelectType) {
      this.draft.probableValues = '';
    }
    if (this.isSelectPickerType) {
      this.fetchLookupTypes();
      if (this.draft.dependencyType) {
        this.fetchLookupData(this.draft.dependencyType, this.draft.dependencyId);
      }
    } else {
      this.draft.dependencyType = 0;
      this.draft.dependencyId = 0;
      this.lookupDataList = [];
    }
  }

  fetchLookupTypes(): void {
    if (this.lookupTypes.length > 0) return;
    this.isLoadingLookupTypes = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 1,
      filterId: 0,
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };
    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoadingLookupTypes = false;
        if (res?.statusCode === '200' && res?.objResult?.table) {
          this.lookupTypes = res.objResult.table.map((item: any) => ({
            id: Number(item.id),
            lookup_name: item.lookup_name || item.name || '',
          }));
        }
      },
      error: (err) => {
        this.isLoadingLookupTypes = false;
        console.error('Failed to load lookup types:', err);
      },
    });
  }

  onLookupTypeChange(lookupTypeId: any): void {
    const id = Number(lookupTypeId) || 0;
    this.draft.dependencyType = id;
    this.draft.dependencyId = 0;
    this.lookupDataList = [];
    if (id > 0) {
      this.fetchLookupData(id);
    }
  }

  fetchLookupData(lookupTypeId: number, preserveId?: number): void {
    this.isLoadingLookupData = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: lookupTypeId,
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };
    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoadingLookupData = false;
        if (res?.statusCode === '200' && res?.objResult?.table) {
          this.lookupDataList = res.objResult.table.map((item: any) => ({
            id: Number(item.id ?? item.country_id ?? item.state_id ?? item.city_id ?? 0),
            name: item.name || item.lookup_name || item.country_name || item.state_name || item.city_name || item.code || '',
            code: item.code || '',
          }));
          if (preserveId) {
            this.draft.dependencyId = preserveId;
          }
        }
      },
      error: (err) => {
        this.isLoadingLookupData = false;
        console.error('Failed to load lookup data:', err);
      },
    });
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
    const defaultType = this.dataTypes.some((t) => t.id === 'TX')
      ? 'TX'
      : (this.dataTypes[0]?.id || 'TX');
    this.draft = {
      ...EMPTY_CUSTOM_FIELD,
      module: this.selectedScreen || this.filterModule || 'Property',
      dataType: defaultType,
      sortOrder: this.rows.length + 1,
    };
    this.lookupDataList = [];
    this.modalOpen = true;
    setTimeout(() => {
      const el = document.querySelector('.cf-modal-body');
      if (el) el.scrollTop = 0;
    }, 0);
  }

  openEdit(row: any): void {
    this.editingId = row.id;
    this.fieldNameManuallyEdited = true;
    const depType = Number(row.dependencyType ?? row.dependency_type) || 0;
    const depId = Number(row.dependencyId ?? row.dependency_id) || 0;
    let defVal = (row.defaultValue || row.defaultvalue || '').trim();
    const colName = (row.fieldName || row.column_name || row.field_name || '').trim();
    const fieldLbl = (row.fieldLabel || row.alias_name || row.field_label || '').trim();
    if (defVal.toLowerCase() === colName.toLowerCase() || defVal === fieldLbl) {
      defVal = '';
    }
    this.draft = {
      fieldName: colName,
      fieldLabel: fieldLbl,
      dataType: row.dataType || row.control_type || 'TX',
      module: row.module || row.feature || 'Property',
      sortOrder: row.sortOrder ?? row.sort_order ?? 0,
      isMandatory: !!(row.isMandatory ?? row.is_mandatory),
      isReadonly: !!(row.isReadonly ?? row.is_readonly),
      isVisible: (row.isVisible ?? row.is_visible) !== false,
      minLength: row.minLength ?? row.min_length ?? 0,
      maxLength: row.maxLength ?? row.max_length ?? 0,
      probableValues: row.probableValues || row.probable_values || '',
      defaultValue: defVal,
      visibleToTenant: !!(row.visibleToTenant ?? row.is_visible_to_tenant),
      visibleToLandlord: !!(row.visibleToLandlord ?? row.is_visible_to_landlord),
      useForVerification: !!(row.useForVerification ?? row.is_used_for_verification),
      dependencyId: depId,
      dependencyType: depType,
    };
    this.lookupDataList = [];
    this.fetchLookupTypes();
    if (this.isSelectPickerType && depType > 0) {
      this.fetchLookupData(depType, depId);
    }
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

    if (!fieldLabel) {
      this.toastr.warning('Please enter a Field Label.', 'Validation Warning');
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
      dependency_id: this.isSelectPickerType ? (Number(this.draft.dependencyId) || 0) : 0,
      dependency_type: this.isSelectPickerType ? (Number(this.draft.dependencyType) || 0) : 0,
      feature: this.draft.module,
      alias_name: (this.draft.fieldLabel || '').trim(),
      control_type: this.draft.dataType || 'TX',
      is_mandatory: !!this.draft.isMandatory,
      is_readonly: !!this.draft.isReadonly,
      is_visible: !!this.draft.isVisible,
      min_length: this.isNumericType ? (Number(this.draft.minLength) || 0) : 0,
      max_length: this.isNumericType ? (Number(this.draft.maxLength) || 0) : 0,
      probable_values: this.isSelectType ? (this.draft.probableValues || '') : '',
      defaultvalue: (this.draft.defaultValue ?? '').trim(),
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
            const mappedRows = savedRecords.map((r: any, idx: number) => {
              let defVal = (r.defaultvalue || r.defaultValue || '').trim();
              const colName = (r.column_name || r.field_name || r.alias_name || '').trim();
              if (defVal.toLowerCase() === colName.toLowerCase()) {
                defVal = '';
              }
              return {
                id: Number(r.id) || idx + 1,
                fieldName: colName,
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
                defaultValue: defVal,
                visibleToTenant: !!(r.is_visible_to_tenant ?? r.visibleToTenant),
                visibleToLandlord: !!(r.is_visible_to_landlord ?? r.visibleToLandlord),
                useForVerification: !!(r.is_used_for_verification ?? r.use_for_verification ?? r.useForVerification),
                dependencyId: Number(r.dependency_id) || 0,
                dependencyType: Number(r.dependency_type) || 0,
              };
            });
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
