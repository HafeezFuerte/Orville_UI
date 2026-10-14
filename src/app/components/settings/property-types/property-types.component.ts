import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_PROPERTY_TYPES,
  EMPTY_PROPERTY_TYPE,
  PropertyTypeColumnDef,
  PropertyTypeDraft,
  PropertyTypeRow,
} from './property-types.data';

type SortKey = 'id' | 'name' | 'propertiesCount';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-property-types',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, OvPaginatorComponent],
  templateUrl: './property-types.component.html',
  styleUrl: './property-types.component.scss',
})
export class PropertyTypesComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  searchQuery = '';
  columnSearch = '';
  modalOpen = false;
  showColumns = false;
  editingId: number | null = null;
  isLoading = false;
  isSaving = false;

  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: PropertyTypeDraft = { ...EMPTY_PROPERTY_TYPE };
  rows: PropertyTypeRow[] = DEFAULT_PROPERTY_TYPES.map((r) => ({ ...r }));

  columns: PropertyTypeColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'propertiesCount', label: 'Properties', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.fetchPropertyTypes();
  }

  fetchPropertyTypes(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1, // Category 1 is Property Types
      filterText: '',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.statusCode === '200' && res?.objResult?.table) {
          this.rows = res.objResult.table.map((item: any) => ({
            id: item.id ?? item.code,
            name: item.name || item.lookup_name || '',
            code: item.code || '',
            description: item.description || '',
            propertiesCount: item.records ?? item.propertiesCount ?? item.count ?? 0,
            isActive: item.is_active ?? item.isActive ?? true,
          }));
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching property types:', err);
      },
    });
  }

  get filteredRows(): PropertyTypeRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (!q) {
        return true;
      }
      return row.name.toLowerCase().includes(q) || String(row.id).includes(q);
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = a[this.sortKey];
      const bv = b[this.sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): PropertyTypeRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('72px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(200px, 1.6fr)');
    }
    if (this.isColumnVisible('propertiesCount')) {
      parts.push('120px');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): PropertyTypeColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get emptyMessage(): string {
    if (this.rows.length === 0) {
      return 'No property types yet. Create your first property type to start categorizing properties.';
    }
    return 'No property types match your search.';
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Property Type' : 'Edit Property Type';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
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

  toggleColumns(): void {
    this.showColumns = !this.showColumns;
    if (this.showColumns) {
      this.columnSearch = '';
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
      visible: c.key === 'name' || c.key === 'actions',
    }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showColumns) {
      return;
    }
    const target = event.target as Node | null;
    const root = this.host.nativeElement.querySelector('[data-columns-dropdown]');
    if (root && target && !root.contains(target)) {
      this.showColumns = false;
    }
  }

  openCreate(): void {
    this.editingId = null;
    this.draft = { ...EMPTY_PROPERTY_TYPE };
    this.modalOpen = true;
  }

  openEdit(row: PropertyTypeRow): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      code: row.code || '',
      description: row.description || '',
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    if (!this.canSave || this.isSaving) {
      return;
    }
    this.isSaving = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      id: Number(this.editingId) || 0,
      lookup_TypeId: 1, // Category 1 is Property Types
      code: this.draft.code || this.draft.name.trim().toUpperCase().replace(/\s+/g, '_'),
      name: this.draft.name.trim(),
      arabic_name: '',
      description: this.draft.description || '',
      is_Active: true,
      company_id: Number(user?.companyId) || 1,
      display_order: 0,
      user_id: Number(user?.userId) || 1,
      dependency_id: 0,
      class_name: '',
      clientid: user?.clientId || '74BB6922',
    };

    const url = environment.apiurl + 'api/Masters/save_lookup';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res?.statusCode === '200') {
          this.toastr.success('Property type saved successfully', 'Success');
          this.closeModal();
          this.fetchPropertyTypes();
        } else {
          this.toastr.error(res?.message || 'Failed to save property type', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving property type:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save property type';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: PropertyTypeRow): void {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
      return;
    }
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: -1,
      filterId: -1,
      filterText: String(row.id),
      filterText1: '1', // Category 1 is Property Types
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Property type deleted successfully', 'Success');
          this.fetchPropertyTypes();
        } else {
          this.toastr.error(res?.message || 'Failed to delete property type', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting property type:', err);
        this.toastr.error('Failed to delete property type', 'Error');
      },
    });
  }
}
