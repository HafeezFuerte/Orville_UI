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
  filterDataType: CustomFieldDataType | '' = '';
  showColumns = false;
  showFilters = false;
  modalOpen = false;
  editingId: number | null = null;
  isLoading = false;
  isSaving = false;
  selectedScreen: string | null = null;
  screens = ['Leases', 'Workorder', 'Invoices', 'Quotations', 'Expenses', 'Property'];
  sortKey: SortKey = 'fieldName';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: CustomFieldDraft = { ...EMPTY_CUSTOM_FIELD };
  rows: CustomFieldRow[] = [];

  readonly modules = CUSTOM_FIELD_MODULES;
  readonly dataTypes = CUSTOM_FIELD_DATA_TYPES;

  columns: CustomFieldColumnDef[] = [
    //{ key: 'alias_name', label: 'Field Name', visible: true },
    { key: 'alias_name', label: 'Field Label', visible: true },
    { key: 'control_type', label: 'Data Type', visible: true },
    { key: 'feature', label: 'Module', visible: true },
    { key: 'is_visible_to_tenant', label: 'Visible to Tenant', visible: true },
    { key: 'is_visible_to_landlord', label: 'Visible to Landlord', visible: true },
    { key: 'is_used_for_verification', label: 'Use For Verification', visible: true },
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
      typeId: 8,
      filterId: 0,
      filterText: this.selectedScreen,
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
          const records = res.objResult.table || res.objResult.table0 || (Array.isArray(res.objResult) ? res.objResult : []);
          this.rows =records;
        } 
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
    return this.draft.fieldLabel.trim().length > 0 && this.draft.fieldLabel.trim().length > 0;
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

  openEdit(row:any): void {
    this.editingId = row.id;
    this.draft = {
      fieldName: "",
      fieldLabel: row.alias_name,
      dataType: row.control_type,
      module: row.feature,
      visibleToTenant: row.is_visible_to_tenant,
      visibleToLandlord: row.is_visible_to_landlord,
      useForVerification: row.is_used_for_verification,
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
    const user = this.commonService.getCurrentUser();
    const payload = {
      userid: Number(user?.userId) || 1,
      company_id: Number(user?.companyId) || 1,
      clientId: user?.clientId || '',
      source: 'web',
      languageid: 1,
      id: Number(this.editingId) || 0,
      sort_order: 0,
      feature: this.draft.module,
      alias_name: this.draft.fieldLabel.trim(),
      control_type: this.draft.dataType,
      is_mandatory: false,
      is_readonly: false,
      is_visible: true,
      min_length: 0,
      max_length: 0,
      probable_values: '',
      defaultvalue: this.draft.fieldName.trim(),
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
          if (this.editingId == null) {
            const newId =
              Number(res?.objResult?.id || res?.id) ||
              this.rows.reduce((m, r) => (r.id > m ? r.id : m), 0) + 1;
            const newField: CustomFieldRow = {
              id: newId,
              fieldName: this.draft.fieldName.trim(),
              fieldLabel: this.draft.fieldLabel.trim(),
              dataType: this.draft.dataType,
              module: this.draft.module,
              visibleToTenant: !!this.draft.visibleToTenant,
              visibleToLandlord: !!this.draft.visibleToLandlord,
              useForVerification: !!this.draft.useForVerification,
            };
            this.rows = [...this.rows, newField];
          } else {
            this.rows = this.rows.map((r) =>
              r.id === this.editingId
                ? {
                    ...r,
                    fieldName: this.draft.fieldName.trim(),
                    fieldLabel: this.draft.fieldLabel.trim(),
                    dataType: this.draft.dataType,
                    module: this.draft.module,
                    visibleToTenant: !!this.draft.visibleToTenant,
                    visibleToLandlord: !!this.draft.visibleToLandlord,
                    useForVerification: !!this.draft.useForVerification,
                  }
                : r
            );
          }
          localStorage.setItem(CustomFieldsComponent.STORAGE_KEY, JSON.stringify(this.rows));
          this.closeModal();
          this.fetchCustomFields();
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
