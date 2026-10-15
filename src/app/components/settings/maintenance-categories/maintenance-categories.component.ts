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
  DEFAULT_MAINTENANCE_CATEGORIES,
  EMPTY_MAINTENANCE_CATEGORY,
  MAINTENANCE_CATEGORY_ICONS,
  MAINTENANCE_CATEGORY_TYPES,
  MaintenanceCategory,
  MaintenanceCategoryColumnDef,
  MaintenanceCategoryDraft,
  MaintenanceCategoryIcon,
} from './maintenance-categories.data';

@Component({
  selector: 'app-maintenance-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, OvPaginatorComponent],
  templateUrl: './maintenance-categories.component.html',
  styleUrl: './maintenance-categories.component.scss',
})
export class MaintenanceCategoriesComponent implements OnInit {
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

  draft: MaintenanceCategoryDraft = { ...EMPTY_MAINTENANCE_CATEGORY };

  rows: MaintenanceCategory[] = [];

  readonly categoryTypes = MAINTENANCE_CATEGORY_TYPES;
  readonly iconOptions = MAINTENANCE_CATEGORY_ICONS;

  columns: MaintenanceCategoryColumnDef[] = [
    { key: 'icon', label: 'Icon', visible: true },
    { key: 'name', label: 'Category / Subcategory', visible: true },
    { key: 'categoryType', label: 'Category Type', visible: true },
    { key: 'workOrders', label: 'Work Orders', visible: true },
    { key: 'avgCompletionTime', label: 'Avg Completion Time', visible: true },
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
      filterId: 30, // Maintenance Categories
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const subcatPayload = {
      typeId: 2,
      filterId: 31, // Maintenance Subcategories
      filterText: '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    forkJoin({
      catRes: this.http.post<any>(url, catPayload, { headers }).pipe(
        catchError((err) => {
          console.error('Error fetching maintenance categories (filterId 30):', err);
          return of(null);
        })
      ),
      subcatRes: this.http.post<any>(url, subcatPayload, { headers }).pipe(
        catchError((err) => {
          console.error('Error fetching maintenance subcategories (filterId 31):', err);
          return of(null);
        })
      ),
    }).subscribe({
      next: ({ catRes, subcatRes }) => {
        this.isLoading = false;
        const allRows: MaintenanceCategory[] = [];

        if (catRes?.statusCode === '200' && catRes?.objResult) {
          const list = catRes.objResult.table || catRes.objResult.table0 || (Array.isArray(catRes.objResult) ? catRes.objResult : []);
          list.forEach((item: any) => {
            allRows.push({
              id: Number(item.id),
              name: item.name || item.lookup_name || '',
              isGlobal: item.is_active ?? true,
              categoryType: 'Maintenance',
              workOrders: item.records ?? 0,
              avgCompletionTime: null,
              icon: (item.class_name as MaintenanceCategoryIcon) || 'wrench',
              parentId: null,
              helpText: item.description || '',
              avgHours: '00',
              avgMinutes: '00',
            });
          });
        }

        if (subcatRes?.statusCode === '200' && subcatRes?.objResult) {
          const list = subcatRes.objResult.table || subcatRes.objResult.table0 || (Array.isArray(subcatRes.objResult) ? subcatRes.objResult : []);
          list.forEach((item: any) => {
            allRows.push({
              id: Number(item.id),
              name: item.name || item.lookup_name || '',
              isGlobal: item.is_active ?? true,
              categoryType: 'Maintenance',
              workOrders: item.records ?? 0,
              avgCompletionTime: null,
              icon: (item.class_name as MaintenanceCategoryIcon) || 'wrench',
              parentId: item.dependency_id ? Number(item.dependency_id) : null,
              helpText: item.description || '',
              avgHours: '00',
              avgMinutes: '00',
            });
          });
        }

        this.rows = allRows;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error in forkJoin fetching maintenance categories:', err);
        this.rows = [];
      },
    });
  }

  get filteredRows(): MaintenanceCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) || row.categoryType.toLowerCase().includes(q)
    );
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize));
  }

  get rangeStart(): number {
    if (this.totalFiltered === 0) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalFiltered);
  }

  get pagedRows(): MaintenanceCategory[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get visibleColumnCount(): number {
    return this.columns.filter((c) => c.visible).length;
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('icon')) {
      parts.push('56px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(180px, 1.6fr)');
    }
    if (this.isColumnVisible('categoryType')) {
      parts.push('minmax(120px, 1fr)');
    }
    if (this.isColumnVisible('workOrders')) {
      parts.push('110px');
    }
    if (this.isColumnVisible('avgCompletionTime')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): MaintenanceCategoryColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get parentOptions(): MaintenanceCategory[] {
    return this.rows.filter((r) => r.parentId == null && r.id !== this.editingId);
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Maintenance Category' : 'Edit Maintenance Category';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0 && this.draft.categoryType.trim().length > 0;
  }

  iconSrc(icon: MaintenanceCategoryIcon): string {
    return (
      this.iconOptions.find((o) => o.value === icon)?.src ??
      './assets/images/settings/screwdriver-wrench.svg'
    );
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
    this.draft = { ...EMPTY_MAINTENANCE_CATEGORY };
    this.modalOpen = true;
  }

  openEdit(row: MaintenanceCategory): void {
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      categoryType: row.categoryType,
      parentId: row.parentId,
      icon: row.icon,
      helpText: row.helpText,
      avgHours: row.avgHours,
      avgMinutes: row.avgMinutes,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  formatAvgTime(hours: string, minutes: string): string | null {
    const h = (hours || '00').padStart(2, '0');
    const m = (minutes || '00').padStart(2, '0');
    if (h === '00' && m === '00') {
      return null;
    }
    return `${h}:${m} Hours`;
  }

  save(): void {
    if (!this.canSave || this.isSaving) {
      return;
    }
    this.isSaving = true;
    const user = this.commonService.getCurrentUser();
    const isSubcategory = this.draft.parentId != null && Number(this.draft.parentId) > 0;
    const lookupTypeId = isSubcategory ? 31 : 30;
    const depId = isSubcategory ? Number(this.draft.parentId) : 0;
    const icon = this.draft.icon || 'wrench';

    const payload = {
      id: Number(this.editingId) || 0,
      lookup_TypeId: lookupTypeId,
      code: this.draft.name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20),
      name: this.draft.name.trim(),
      arabic_name: '',
      description: this.draft.helpText ? this.draft.helpText.trim() : '',
      is_Active: true,
      company_id: Number(user?.companyId) || 1,
      display_order: 0,
      user_id: Number(user?.userId) || 1,
      dependency_id: depId,
      class_name: icon,
      clientid: user?.clientId || '74BB6922',
    };

    const url = environment.apiurl + 'api/Masters/save_lookup';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res?.statusCode === '200') {
          this.toastr.success('Maintenance category saved successfully', 'Success');
          this.closeModal();
          this.fetchCategories();
        } else {
          this.toastr.error(res?.message || 'Failed to save maintenance category', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving maintenance category:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save maintenance category';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: MaintenanceCategory): void {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
      return;
    }
    const user = this.commonService.getCurrentUser();
    const lookupTypeId = row.parentId ? 31 : 30;
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
          this.toastr.success('Maintenance category deleted successfully', 'Success');
          this.fetchCategories();
        } else {
          this.toastr.error(res?.message || 'Failed to delete maintenance category', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting maintenance category:', err);
        this.toastr.error('Failed to delete maintenance category', 'Error');
      },
    });
  }
}
