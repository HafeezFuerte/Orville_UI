import { TranslateModule } from '@ngx-translate/core';
import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_QUOTATION_CATEGORIES,
  EMPTY_QUOTATION_CATEGORY,
  QuotationCategory,
  QuotationCategoryColumnDef,
  QuotationCategoryDraft,
} from './quotation-categories.data';

type SortKey = 'id' | 'name' | 'helpText' | 'isAdmin';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-quotation-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent, TranslateModule],
  templateUrl: './quotation-categories.component.html',
  styleUrl: './quotation-categories.component.scss',
})
export class QuotationCategoriesComponent implements OnInit {
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

  draft: QuotationCategoryDraft = { ...EMPTY_QUOTATION_CATEGORY };

  rows: QuotationCategory[] = [];
  lookupTypeId = 34;

  columns: QuotationCategoryColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'helpText', label: 'Help Text', visible: true },
    { key: 'isAdmin', label: 'Admin', visible: true },
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

    // Step 1: Query typeId: 1 to find registered lookup_TypeId or default to 34
    const typePayload = {
      typeId: 1,
      filterId: 0,
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    this.http.post<any>(url, typePayload, { headers }).subscribe({
      next: (typeRes) => {
        if (typeRes?.statusCode === '200' && typeRes?.objResult?.table) {
          const match = typeRes.objResult.table.find((c: any) =>
            c.lookup_name?.toLowerCase().includes('quotation') ||
            c.lookup_name?.toLowerCase().includes('quote')
          );
          if (match && match.id) {
            this.lookupTypeId = Number(match.id);
          }
        }
        this.loadCategoryItems();
      },
      error: () => {
        this.loadCategoryItems();
      },
    });
  }

  private loadCategoryItems(): void {
    const user = this.commonService.getCurrentUser();
    const headers = this.commonService.updateHeaders();
    const url = environment.apiurl + 'api/Masters/_getMasters';

    const payload = {
      typeId: 2,
      filterId: this.lookupTypeId,
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    this.http.post<any>(url, payload, { headers }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200' && res.objResult) {
          const records = res.objResult.table || res.objResult.table0 || (Array.isArray(res.objResult) ? res.objResult : []);
          this.rows = records.map((item: any) => ({
            id: Number(item.id),
            name: item.name || item.lookup_name || '',
            helpText: item.description || '',
            isAdmin: item.is_active ?? true,
          }));
        } else {
          this.rows = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching quotation categories:', err);
        this.rows = [];
      },
    });
  }

  get filteredRows(): QuotationCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = !q
      ? [...this.rows]
      : this.rows.filter(
          (row) =>
            row.name.toLowerCase().includes(q) ||
            row.helpText.toLowerCase().includes(q) ||
            String(row.id).includes(q)
        );

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      const av = a[this.sortKey];
      const bv = b[this.sortKey];
      if (typeof av === 'boolean' && typeof bv === 'boolean') {
        return (Number(av) - Number(bv)) * dir;
      }
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

  get pagedRows(): QuotationCategory[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get visibleColumnCount(): number {
    return this.columns.filter((c) => c.visible).length;
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('72px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(160px, 1.4fr)');
    }
    if (this.isColumnVisible('helpText')) {
      parts.push('minmax(180px, 1.6fr)');
    }
    if (this.isColumnVisible('isAdmin')) {
      parts.push('100px');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): QuotationCategoryColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Quotation Category' : 'Edit Quotation Category';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a new quotation category for your company.'
      : 'Update this quotation category.';
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
    this.draft = { ...EMPTY_QUOTATION_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: QuotationCategory): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      helpText: row.helpText,
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
      lookup_TypeId: this.lookupTypeId,
      code: this.draft.name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20),
      name: this.draft.name.trim(),
      arabic_name: '',
      description: this.draft.helpText ? this.draft.helpText.trim() : '',
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
          this.toastr.success('Quotation category saved successfully', 'Success');
          this.closeModal();
          this.fetchCategories();
        } else {
          this.toastr.error(res?.message || 'Failed to save quotation category', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving quotation category:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save quotation category';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: QuotationCategory): void {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
      return;
    }
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: -1,
      filterId: -1,
      filterText: String(row.id),
      filterText1: String(this.lookupTypeId),
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Quotation category deleted successfully', 'Success');
          this.fetchCategories();
        } else {
          this.toastr.error(res?.message || 'Failed to delete quotation category', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting quotation category:', err);
        this.toastr.error('Failed to delete quotation category', 'Error');
      },
    });
  }
}
