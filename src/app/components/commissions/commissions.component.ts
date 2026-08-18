import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../shared/components/column-menu/column-menu.component';
import { COMMISSION_ROWS, CommissionKind, CommissionRow } from './commissions.data';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.scss'
})
export class CommissionsComponent implements OnInit {
  searchQuery = '';
  kindFilter: 'All' | CommissionKind = 'All';
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterFrom = '';
  filterType: string | null = null;
  typeOptions = ['Percentage', 'Fixed'];
  pageIndex = 0;
  pageSize = 10;
  allRows = COMMISSION_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'from', label: 'From', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'commissionable', label: 'Commissionable', visible: true, useTemplate: true },
    { key: 'amount', label: 'Amount', visible: true },
    { key: 'toCompany', label: 'To Company', visible: true },
    { key: 'toAgent', label: 'To Agent', visible: true },
    { key: 'fixedAmount', label: 'Fixed Amount', visible: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.syncTabFromUrl();
    this.route.url.subscribe(() => this.syncTabFromUrl());
  }

  get tenantCount(): number {
    return this.allRows.filter((row) => row.kind === 'Tenant').length;
  }

  get landlordCount(): number {
    return this.allRows.filter((row) => row.kind === 'Landlord').length;
  }

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): CommissionRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.kindFilter !== 'All' && row.kind !== this.kindFilter) {
        return false;
      }
      if (this.filterFrom && !row.from.toLowerCase().includes(this.filterFrom.toLowerCase())) {
        return false;
      }
      if (this.filterType && row.type !== this.filterType) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.toLowerCase().includes(q) ||
        row.from.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
        row.commissionable.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): CommissionRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageIndex * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalRecords);
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  setKindFilter(kind: 'All' | CommissionKind): void {
    this.kindFilter = kind;
    this.pageIndex = 0;
    const path =
      kind === 'Tenant' ? '/commissions/tenant' : kind === 'Landlord' ? '/commissions/landlord' : '/commissions';
    void this.router.navigate([path]);
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterFrom = '';
    this.filterType = null;
    this.pageIndex = 0;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => (col.visible = checked));
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex++;
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages) {
      this.pageIndex = target;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }

  private syncTabFromUrl(): void {
    const path = this.router.url.split('?')[0];
    if (path.endsWith('/tenant')) {
      this.kindFilter = 'Tenant';
    } else if (path.endsWith('/landlord')) {
      this.kindFilter = 'Landlord';
    } else {
      this.kindFilter = 'All';
    }
    this.pageIndex = 0;
  }
}
