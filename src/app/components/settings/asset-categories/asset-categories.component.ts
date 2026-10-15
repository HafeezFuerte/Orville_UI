import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_ASSET_CATEGORIES,
  EMPTY_ASSET_CATEGORY,
  AssetCategory,
  AssetCategoryColumnDef,
  AssetCategoryDraft,
} from './asset-categories.data';

@Component({
  selector: 'app-asset-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, OvPaginatorComponent],
  templateUrl: './asset-categories.component.html',
  styleUrl: './asset-categories.component.scss',
})
export class AssetCategoriesComponent implements OnInit {
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

  pageSize = 10;
  pageIndex = 0;

  draft: AssetCategoryDraft = { ...EMPTY_ASSET_CATEGORY };

  rows: AssetCategory[] = [];

  columns: AssetCategoryColumnDef[] = [
    { key: 'name', label: 'Category/Subcategory', visible: true },
    { key: 'assetCount', label: 'Inventory Assets', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const headers = this.commonService.updateHeaders();
    const url = environment.apiurl + 'api/Masters/_getMasters';

    const catPayload = {
      typeId: 2,
      filterId: 26, // Asset Categories
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const subcatPayload = {
      typeId: 2,
      filterId: 27, // Asset Subcategories
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    forkJoin({
      catRes: this.http.post<any>(url, catPayload, { headers }).pipe(
        catchError((err) => {
          console.error('Error fetching asset categories (filterId 26):', err);
          return of(null);
        })
      ),
      subcatRes: this.http.post<any>(url, subcatPayload, { headers }).pipe(
        catchError((err) => {
          console.error('Error fetching asset subcategories (filterId 27):', err);
          return of(null);
        })
      ),
    }).subscribe({
      next: ({ catRes, subcatRes }) => {
        this.isLoading = false;
        const allRows: AssetCategory[] = [];

        if (catRes?.statusCode === '200' && catRes?.objResult) {
          const list = catRes.objResult.table || catRes.objResult.table0 || (Array.isArray(catRes.objResult) ? catRes.objResult : []);
          list.forEach((item: any) => {
            allRows.push({
              id: Number(item.id),
              name: item.name || item.lookup_name || '',
              parentId: null,
              assetCount: item.records ?? 0,
            });
          });
        }

        if (subcatRes?.statusCode === '200' && subcatRes?.objResult) {
          const list = subcatRes.objResult.table || subcatRes.objResult.table0 || (Array.isArray(subcatRes.objResult) ? subcatRes.objResult : []);
          list.forEach((item: any) => {
            allRows.push({
              id: Number(item.id),
              name: item.name || item.lookup_name || '',
              parentId: item.dependency_id ? Number(item.dependency_id) : null,
              assetCount: item.records ?? 0,
            });
          });
        }

        this.rows = allRows;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error in forkJoin fetching asset categories:', err);
        this.rows = [];
      },
    });
  }

  get filteredRows(): AssetCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter((row) => row.name.toLowerCase().includes(q));
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): AssetCategory[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('name')) {
      parts.push('minmax(200px, 1.6fr)');
    }
    if (this.isColumnVisible('assetCount')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): AssetCategoryColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get parentOptions(): AssetCategory[] {
    return this.rows.filter((r) => r.parentId == null && r.id !== this.editingId);
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Asset Category' : 'Edit Asset Category';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a new asset category for your company.'
      : 'Update this asset category.';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  parentName(parentId: number | null): string | null {
    if (parentId == null) {
      return null;
    }
    return this.rows.find((r) => r.id === parentId)?.name ?? null;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
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
    this.draft = { ...EMPTY_ASSET_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: AssetCategory): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      parentId: row.parentId,
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
    const isSubcategory = this.draft.parentId != null && Number(this.draft.parentId) > 0;
    const lookupTypeId = isSubcategory ? 27 : 26;
    const depId = isSubcategory ? Number(this.draft.parentId) : 0;

    const payload = {
      id: Number(this.editingId) || 0,
      lookup_TypeId: lookupTypeId,
      code: this.draft.name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20),
      name: this.draft.name.trim(),
      arabic_name: '',
      description: '',
      is_Active: true,
      company_id: Number(user?.companyId) || 1,
      display_order: 0,
      user_id: Number(user?.userId) || 1,
      dependency_id: depId,
      class_name: '',
      clientid: user?.clientId || '74BB6922',
    };

    const url = environment.apiurl + 'api/Masters/save_lookup';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res?.statusCode === '200') {
          this.toastr.success('Asset category saved successfully', 'Success');
          this.closeModal();
          this.fetchCategories();
        } else {
          this.toastr.error(res?.message || 'Failed to save asset category', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving asset category:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save asset category';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: AssetCategory): void {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
      return;
    }
    const user = this.commonService.getCurrentUser();
    const lookupTypeId = row.parentId ? 27 : 26;
    const payload = {
      typeId: -1,
      filterId: -1,
      filterText: String(row.id),
      filterText1: String(lookupTypeId),
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Asset category deleted successfully', 'Success');
          this.fetchCategories();
        } else {
          this.toastr.error(res?.message || 'Failed to delete asset category', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting asset category:', err);
        this.toastr.error('Failed to delete asset category', 'Error');
      },
    });
  }
}
