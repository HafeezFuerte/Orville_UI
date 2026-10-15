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
  DEFAULT_PROMOTION_CATEGORIES,
  EMPTY_PROMOTION_CATEGORY,
  PromotionCategory,
  PromotionCategoryColumnDef,
  PromotionCategoryDraft,
} from './promotion-categories.data';

type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-promotion-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent, TranslateModule],
  templateUrl: './promotion-categories.component.html',
  styleUrl: './promotion-categories.component.scss',
})
export class PromotionCategoriesComponent implements OnInit {
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

  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  draft: PromotionCategoryDraft = { ...EMPTY_PROMOTION_CATEGORY };

  rows: PromotionCategory[] = [];
  lookupTypeId = 46;

  columns: PromotionCategoryColumnDef[] = [
    { key: 'name', label: 'Name', visible: true },
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

    const payload = {
      typeId: 2,
      filterId: this.lookupTypeId, // Promotion Categories lookup_TypeId = 46
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
          }));
        } else {
          this.rows = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching promotion categories:', err);
        this.rows = [];
      },
    });
  }

  get filteredRows(): PromotionCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = !q
      ? [...this.rows]
      : this.rows.filter((row) => row.name.toLowerCase().includes(q));

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => a.name.localeCompare(b.name) * dir);
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

  get pagedRows(): PromotionCategory[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('name')) {
      parts.push('minmax(200px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): PromotionCategoryColumnDef[] {
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
    return this.editingId == null ? 'New Promotion Category' : 'Edit Promotion Category';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a new promotion category for your company.'
      : 'Update this promotion category.';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  toggleSort(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
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
    this.draft = { ...EMPTY_PROMOTION_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: PromotionCategory): void {
    this.editingId = row.id;
    this.draft = { name: row.name };
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
      description: '',
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
          this.toastr.success('Promotion category saved successfully', 'Success');
          this.closeModal();
          this.fetchCategories();
        } else {
          this.toastr.error(res?.message || 'Failed to save promotion category', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving promotion category:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save promotion category';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: PromotionCategory): void {
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
          this.toastr.success('Promotion category deleted successfully', 'Success');
          this.fetchCategories();
        } else {
          this.toastr.error(res?.message || 'Failed to delete promotion category', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting promotion category:', err);
        this.toastr.error('Failed to delete promotion category', 'Error');
      },
    });
  }
}

