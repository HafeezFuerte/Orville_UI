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
  AmenityColumnDef,
  AmenityDraft,
  AmenityRow,
  DEFAULT_PROPERTY_AMENITIES,
  EMPTY_AMENITY,
} from './property-amenities.data';

type SortKey = 'id' | 'name';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-property-amenities',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, OvPaginatorComponent],
  templateUrl: './property-amenities.component.html',
  styleUrl: './property-amenities.component.scss',
})
export class PropertyAmenitiesComponent implements OnInit {
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

  draft: AmenityDraft = { ...EMPTY_AMENITY };
  rows: AmenityRow[] = DEFAULT_PROPERTY_AMENITIES.map((r) => ({ ...r }));

  columns: AmenityColumnDef[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.fetchAmenities();
  }

  fetchAmenities(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 2, // Category 2 is Amenities
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
        if (res?.statusCode === '200' && res?.objResult?.table && res.objResult.table.length > 0) {
          this.rows = res.objResult.table.map((item: any) => ({
            id: item.id ?? item.code,
            name: item.name || item.lookup_name || '',
            code: item.code || '',
            description: item.description || '',
            isDefault: false,
            isActive: item.is_active ?? item.isActive ?? true,
          }));
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching amenities:', err);
      },
    });
  }

  get filteredRows(): AmenityRow[] {
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

  get pagedRows(): AmenityRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('id')) {
      parts.push('72px');
    }
    if (this.isColumnVisible('name')) {
      parts.push('minmax(240px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('120px');
    }
    return parts.join(' ');
  }

  get filteredColumns(): AmenityColumnDef[] {
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
      return 'No amenities yet. Create your first amenity to assign to properties.';
    }
    return 'No amenities match your search.';
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Amenity' : 'Edit Amenity';
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
    this.draft = { ...EMPTY_AMENITY };
    this.modalOpen = true;
  }

  openEdit(row: AmenityRow): void {
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
      lookup_TypeId: 2, // Category 2 is Amenities
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
          this.toastr.success('Amenity saved successfully', 'Success');
          this.closeModal();
          this.fetchAmenities();
        } else {
          this.toastr.error(res?.message || 'Failed to save amenity', 'Error');
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving amenity:', err);
        const errMsg = err.error?.message || err.error?.title || 'Failed to save amenity';
        this.toastr.error(errMsg, 'Error');
      },
    });
  }

  deleteRow(row: AmenityRow): void {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
      return;
    }
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: -1,
      filterId: -1,
      filterText: String(row.id),
      filterText1: '2', // Category 2 is Amenities
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res?.statusCode === '200') {
          this.toastr.success('Amenity deleted successfully', 'Success');
          this.fetchAmenities();
        } else {
          this.toastr.error(res?.message || 'Failed to delete amenity', 'Error');
        }
      },
      error: (err) => {
        console.error('Error deleting amenity:', err);
        this.toastr.error('Failed to delete amenity', 'Error');
      },
    });
  }
}
