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
  DEFAULT_UNIT_TYPES,
  EMPTY_UNIT_TYPE,
  UNIT_CATEGORY_TYPES,
  UnitCategoryType,
  UnitTypeColumnDef,
  UnitTypeDraft,
  UnitTypeRow,
} from './unit-types.data';

type SortKey = 'id' | 'name' | 'categoryType' | 'unitsCount';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-unit-types',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, OvPaginatorComponent],
  templateUrl: './unit-types.component.html',
  styleUrl: './unit-types.component.scss',
})
export class UnitTypesComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  searchQuery = '';
  columnSearch = '';
  filterCategory: UnitCategoryType | '' = '';
  modalOpen = false;
  showColumns = false;
  showFilters = false;
  editingId: number | null = null;
  isLoading = false;
  isSaving = false;

  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: UnitTypeDraft = { ...EMPTY_UNIT_TYPE };
  rows: UnitTypeRow[] = DEFAULT_UNIT_TYPES.map((r) => ({ ...r }));

  readonly categoryTypes = UNIT_CATEGORY_TYPES;

  columns: UnitTypeColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'categoryType', label: 'Category Type', visible: true },
    { key: 'unitsCount', label: 'Units', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.fetchUnitTypes();
  }

  fetchUnitTypes(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 3, // Category 3 is Unit Types
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
            categoryType: this.parseCategoryType(item),
            unitsCount: item.records ?? item.unitsCount ?? item.count ?? 0,
            isActive: item.is_active ?? item.isActive ?? true,
          }));
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching unit types:', err);
      },
    });
  }

  private parseCategoryType(item: any): UnitCategoryType {
    const raw = (item.class_name || item.categoryType || item.category_name || item.description || '').toLowerCase();
    if (raw.includes('commercial')) return 'Commercial';
    if (raw.includes('mixed')) return 'Mixed Use';
    if (raw.includes('residential')) return 'Residential';
    const name = (item.name || item.lookup_name || '').toLowerCase();
    if (
      name.includes('office') ||
      name.includes('retail') ||
      name.includes('shop') ||
      name.includes('warehouse') ||
      name.includes('commercial')
    ) {
      return 'Commercial';
    }
    return 'Residential';
  }

  get filteredRows(): UnitTypeRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (this.filterCategory && row.categoryType !== this.filterCategory) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.categoryType.toLowerCase().includes(q) ||
        String(row.id).includes(q)
      );
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

  get totalCount(): number {
    return this.rows.length;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): UnitTypeRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('72px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(160px, 1.4fr)');
    }
    if (this.isColumnVisible('categoryType')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('unitsCount')) {
      parts.push('100px');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): UnitTypeColumnDef[] {
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
    return this.filterCategory ? 1 : 0;
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Unit Type' : 'Edit Unit Type';
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

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showColumns = false;
    }
  }

  clearFilters(): void {
    this.filterCategory = '';
    this.pageIndex = 0;
  }

  applyFilterCategory(value: UnitCategoryType | ''): void {
    this.filterCategory = value;
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
      visible: c.key === 'name' || c.key === 'actions',
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
    this.draft = { ...EMPTY_UNIT_TYPE };
    this.modalOpen = true;
  }

  openEdit(row: UnitTypeRow): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      code: row.code || '',
      description: row.description || '',
      categoryType: row.categoryType,
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
      lookup_TypeId: 3, // Category 3 is Unit Types
      code: this.draft.code || this.draft.name.trim().toUpperCase().replace(/\s+/g, '_'),
      name: this.draft.name.trim(),
      arabic_name: '',
      description: this.draft.description || this.draft.categoryType,
      is_Active: true,
      company_id: Number(user?.companyId) || 1,
      display_order: 0,
      user_id: Number(user?.userId) || 1,
      dependency_id: 0,
      class_name: this.draft.categoryType,
      clientid: user?.clientId || '74BB6922',
    };

    const url = environment.apiurl + 'api/Masters/save_lookup';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res?.statusCode === '200') {
          this.toastr.success('Unit type saved successfully', 'Success');
          this.closeModal();
          this.fetchUnitTypes();
        } else {
          this.toastr.error(res?.message || 'Failed to save unit type', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving unit type:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save unit type';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: UnitTypeRow): void {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
      return;
    }
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: -1,
      filterId: -1,
      filterText: String(row.id),
      filterText1: '3', // Category 3 is Unit Types
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Unit type deleted successfully', 'Success');
          this.fetchUnitTypes();
        } else {
          this.toastr.error(res?.message || 'Failed to delete unit type', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting unit type:', err);
        this.toastr.error('Failed to delete unit type', 'Error');
      },
    });
  }
}
