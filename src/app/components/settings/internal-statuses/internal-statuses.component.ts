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
  DEFAULT_INTERNAL_STATUSES,
  EMPTY_INTERNAL_STATUS,
  INTERNAL_STATUS_COLORS,
  INTERNAL_STATUS_MODULES,
  InternalStatusColumnDef,
  InternalStatusColorOption,
  InternalStatusDraft,
  InternalStatusModule,
  InternalStatusRow,
} from './internal-statuses.data';

type SortKey = 'name' | 'module' | 'colorKey';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-internal-statuses',
  standalone: true,
  imports: [CommonModule, FormsModule, OvPaginatorComponent, TranslateModule],
  templateUrl: './internal-statuses.component.html',
  styleUrl: './internal-statuses.component.scss',
})
export class InternalStatusesComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  searchQuery = '';
  columnSearch = '';
  filterModule: InternalStatusModule | '' = '';
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

  draft: InternalStatusDraft = { ...EMPTY_INTERNAL_STATUS };
  rows: InternalStatusRow[] = DEFAULT_INTERNAL_STATUSES.map((r) => ({ ...r }));

  readonly modules = INTERNAL_STATUS_MODULES;
  readonly colors = INTERNAL_STATUS_COLORS;

  columns: InternalStatusColumnDef[] = [
    { key: 'name', label: 'Name', visible: true },
    { key: 'module', label: 'Module', visible: true },
    { key: 'color', label: 'Color', visible: true },
    { key: 'actions', label: 'Action', visible: true },
  ];

  private static readonly STORAGE_KEY = 'orville_internal_statuses';
  private nextId = 1;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.loadCachedStatuses();
    this.fetchStatuses();
  }

  private loadCachedStatuses(): void {
    try {
      const cached = localStorage.getItem(InternalStatusesComponent.STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.rows = parsed;
          const maxId = this.rows.reduce((m, r) => (r.id > m ? r.id : m), 0);
          this.nextId = maxId + 1;
        }
      }
    } catch (e) {
      console.error('Failed to parse cached internal_statuses:', e);
    }
  }

  fetchStatuses(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'internal_statuses',
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
                const maxId = this.rows.reduce((m, r) => (r.id > m ? r.id : m), 0);
                this.nextId = maxId + 1;
                localStorage.setItem(InternalStatusesComponent.STORAGE_KEY, JSON.stringify(this.rows));
                return;
              }
            } catch (e) {
              console.error('Failed to parse internal_statuses strValue:', e);
            }
          }
        }
        // If backend returned -200 or empty, keep cached statuses if they exist
        const cached = localStorage.getItem(InternalStatusesComponent.STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              this.rows = parsed;
              const maxId = this.rows.reduce((m, r) => (r.id > m ? r.id : m), 0);
              this.nextId = maxId + 1;
              return;
            }
          } catch (e) {}
        }
        this.rows = DEFAULT_INTERNAL_STATUSES.map((r) => ({ ...r }));
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching internal statuses:', err);
        const cached = localStorage.getItem(InternalStatusesComponent.STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              this.rows = parsed;
              const maxId = this.rows.reduce((m, r) => (r.id > m ? r.id : m), 0);
              this.nextId = maxId + 1;
              return;
            }
          } catch (e) {}
        }
        this.rows = DEFAULT_INTERNAL_STATUSES.map((r) => ({ ...r }));
      },
    });
  }

  get filteredRows(): InternalStatusRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (this.filterModule && row.module !== this.filterModule) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.module.toLowerCase().includes(q) ||
        this.colorLabel(row.colorKey).toLowerCase().includes(q)
      );
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av =
        this.sortKey === 'colorKey' ? this.colorLabel(a.colorKey) : String(a[this.sortKey]);
      const bv =
        this.sortKey === 'colorKey' ? this.colorLabel(b.colorKey) : String(b[this.sortKey]);
      return av.localeCompare(bv, undefined, { sensitivity: 'base' }) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFiltered / this.pageSize) || 1);
  }

  get pagedRows(): InternalStatusRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('name')) {
      parts.push('minmax(180px, 1.4fr)');
    }
    if (this.isColumnVisible('module')) {
      parts.push('minmax(140px, 1fr)');
    }
    if (this.isColumnVisible('color')) {
      parts.push('minmax(120px, 0.9fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('96px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): InternalStatusColumnDef[] {
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
    return this.filterModule ? 1 : 0;
  }

  get emptyMessage(): string {
    if (this.rows.length === 0 && !this.searchQuery.trim() && !this.filterModule) {
      return "We don't have any internal statuses that match your search. Try adjusting your search to find what you're looking for.";
    }
    return "We don't have any internal statuses that match your search. Try adjusting your search to find what you're looking for.";
  }

  get modalTitle(): string {
    return this.editingId == null ? 'Create Internal Status' : 'Edit Internal Status';
  }

  get canSubmit(): boolean {
    return (
      this.draft.name.trim().length > 0 &&
      this.draft.module !== '' &&
      this.draft.colorKey !== ''
    );
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  colorOption(key: string): InternalStatusColorOption | undefined {
    return this.colors.find((c) => c.key === key);
  }

  colorLabel(key: string): string {
    return this.colorOption(key)?.label ?? key;
  }

  colorCss(key: string): string {
    return this.colorOption(key)?.cssVar ?? 'rgb(var(--text-muted))';
  }

  canEdit(row: InternalStatusRow): boolean {
    return !row.hasAssociatedRecords;
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
    this.pageIndex = 0;
  }

  applyFilterModule(value: InternalStatusModule | ''): void {
    this.filterModule = value;
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
    this.draft = { ...EMPTY_INTERNAL_STATUS };
    this.modalOpen = true;
  }

  openEdit(row: InternalStatusRow): void {
    if (!this.canEdit(row)) {
      return;
    }
    this.editingId = row.id;
    this.draft = {
      name: row.name,
      module: row.module,
      colorKey: row.colorKey,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    if (!this.canSubmit || this.draft.module === '' || this.isSaving) {
      return;
    }
    this.isSaving = true;
    let updatedRows: InternalStatusRow[];
    if (this.editingId == null) {
      const newStatus: InternalStatusRow = {
        id: this.nextId++,
        name: this.draft.name.trim(),
        module: this.draft.module,
        colorKey: this.draft.colorKey,
        hasAssociatedRecords: false,
      };
      updatedRows = [...this.rows, newStatus];
    } else {
      updatedRows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name: this.draft.name.trim(),
              module: this.draft.module as InternalStatusModule,
              colorKey: this.draft.colorKey,
            }
          : r
      );
    }

    const user = this.commonService.getCurrentUser();
    this.rows = updatedRows;
    localStorage.setItem(InternalStatusesComponent.STORAGE_KEY, JSON.stringify(this.rows));
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'internal_statuses',
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
          this.toastr.success('Internal status saved successfully', 'Success');
          this.closeModal();
        } else {
          this.toastr.error(res?.message || 'Failed to save internal status', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving internal status:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save internal status';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: InternalStatusRow): void {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
      return;
    }
    const updatedRows = this.rows.filter((r) => r.id !== row.id);
    this.rows = updatedRows;
    localStorage.setItem(InternalStatusesComponent.STORAGE_KEY, JSON.stringify(this.rows));
    if (this.pageIndex > this.totalPages - 1) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'internal_statuses',
      filterText1: JSON.stringify(updatedRows),
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Internal status deleted successfully', 'Success');
        } else {
          this.toastr.error(res?.message || 'Failed to delete internal status', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting internal status:', err);
        this.toastr.error('Failed to delete internal status', 'Error');
      },
    });
  }
}
