import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';

export interface Lease {
  id: string;
  code: string;
  leaseName: string;
  tenant: string;
  legalCase: string;
  unit: string;
  property: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Pending Approvals';
  rent: number;
  startDate: string;
}

@Component({
  selector: 'app-leases-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './leases-list.component.html',
  styleUrl: './leases-list.component.scss'
})
export class LeasesListComponent implements OnInit {
  private router = inject(Router);

  searchQuery: string = '';
  isLoading: boolean = false;
  activeStatusFilter: string = 'All';
  isDrawerOpen: boolean = false;
  showColumnDropdown = false;
  openActionId: string | null = null;

  filterTenant: string = '';
  filterProperty: string = '';
  filterStatus: string | null = null;
  statusOptions = ['Active', 'Draft', 'Completed', 'Pending Approvals'];

  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'leaseName', label: 'Lease Name', visible: true },
    { key: 'tenant', label: 'Tenant', visible: true },
    { key: 'legalCase', label: 'Legal Case', visible: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'rent', label: 'Rent (AED)', visible: true, useTemplate: true },
    { key: 'startDate', label: 'Start Date', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  metrics = {
    revenue: 'AED 4.3 M',
    totalLeases: 24183,
    activeLeases: 18420,
    draftLeases: 3240,
    expiringLeases: 420
  };

  allLeases: Lease[] = [
    { id: '31650', code: 'LSE-31650', leaseName: 'Lease - 31650 - Marina Heights Towers', tenant: 'James T. Hirai', legalCase: 'No', unit: 'Apartment 205-PR-4', property: 'Marina Heights Tower', status: 'Draft', rent: 24000.00, startDate: '07-01-2026' },
    { id: '31651', code: 'LSE-31651', leaseName: 'Lease - 31651 - Marina Heights Towers', tenant: 'Myo Thet', legalCase: 'No', unit: 'Apartment 205-PR-4', property: 'Marina Heights Tower', status: 'Active', rent: 24000.00, startDate: '07-01-2026' },
    { id: '31652', code: 'LSE-31652', leaseName: 'Lease - 31652 - Marina Heights Towers', tenant: 'Major Anthony M Brown, Jr.', legalCase: 'No', unit: 'Apartment 205-PR-4', property: 'Marina Heights Tower', status: 'Active', rent: 24000.00, startDate: '07-01-2026' },
    { id: '31653', code: 'LSE-31653', leaseName: 'Lease - 31653 - Marina Heights Towers', tenant: 'Umar Abubakar', legalCase: 'No', unit: 'Apartment 205-PR-4', property: 'Marina Heights Tower', status: 'Completed', rent: 24000.00, startDate: '07-01-2026' },
    { id: '31654', code: 'LSE-31654', leaseName: 'Lease - 31654 - Marina Heights Towers', tenant: 'Andres Ceceres', legalCase: 'No', unit: 'Apartment 205-PR-4', property: 'Marina Heights Tower', status: 'Active', rent: 24000.00, startDate: '07-01-2026' },
    { id: '31655', code: 'LSE-31655', leaseName: 'Lease - 31655 - Marina Heights Towers', tenant: 'Dr. Saira Yamin', legalCase: 'No', unit: 'Apartment 205-PR-4', property: 'Marina Heights Tower', status: 'Draft', rent: 24000.00, startDate: '07-01-2026' },
    { id: '31656', code: 'LSE-31656', leaseName: 'Lease - 31656 - Marina Heights Towers', tenant: 'Dr. Rajib Subba', legalCase: 'No', unit: 'Apartment 205-PR-4', property: 'Marina Heights Tower', status: 'Completed', rent: 24000.00, startDate: '07-01-2026' },
    { id: '31657', code: 'LSE-31657', leaseName: 'Lease - 31657 - Marina Heights Towers', tenant: 'Mary Markovich', legalCase: 'No', unit: 'Apartment 205-PR-4', property: 'Marina Heights Tower', status: 'Active', rent: 24000.00, startDate: '07-01-2026' }
  ];

  filteredLeases: Lease[] = [];
  paginatedLeases: Lease[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredLeases = this.allLeases.filter(lease => {
      if (this.activeStatusFilter !== 'All' && lease.status !== this.activeStatusFilter) {
        return false;
      }
      if (this.filterTenant && !lease.tenant.toLowerCase().includes(this.filterTenant.toLowerCase())) {
        return false;
      }
      if (this.filterProperty && !lease.property.toLowerCase().includes(this.filterProperty.toLowerCase())) {
        return false;
      }
      if (this.filterStatus && lease.status !== this.filterStatus) {
        return false;
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return (
          lease.leaseName.toLowerCase().includes(query) ||
          lease.tenant.toLowerCase().includes(query) ||
          lease.property.toLowerCase().includes(query) ||
          lease.unit.toLowerCase().includes(query) ||
          lease.id.includes(query)
        );
      }
      return true;
    });
    this.totalRecords = this.filteredLeases.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
    if (this.pageNo >= this.totalPages) {
      this.pageNo = Math.max(0, this.totalPages - 1);
    }
    this.updatePaginatedLeases();
  }

  private updatePaginatedLeases(): void {
    const start = this.pageNo * this.pageSize;
    this.paginatedLeases = this.filteredLeases.slice(start, start + this.pageSize);
  }

  setStatusFilter(status: string) {
    this.activeStatusFilter = status;
    this.pageNo = 0;
    this.applyFilters();
  }

  onSearch() {
    this.pageNo = 0;
    this.applyFilters();
  }

  clearFilters() {
    this.filterTenant = '';
    this.filterProperty = '';
    this.filterStatus = null;
    this.searchQuery = '';
    this.pageNo = 0;
    this.applyFilters();
  }

  navigateToCreate() {
    this.router.navigate(['/leases/create']);
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible !== false);
  }

  toggleColumn(colKey: string): void {
    const col = this.tableColumns.find(c => c.key === colKey);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableColumns.forEach(c => (c.visible = checked));
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openActionId = null;
    this.showColumnDropdown = false;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.openActionId = null;
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = false;
    this.openActionId = this.openActionId === id ? null : id;
  }

  get displayPage(): number {
    return this.pageNo + 1;
  }

  get startRecord(): number {
    if (this.totalRecords === 0) return 0;
    return this.pageNo * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = (this.pageNo + 1) * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages || 1;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  onPageSizeChange(): void {
    this.pageNo = 0;
    this.applyFilters();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.updatePaginatedLeases();
    }
  }

  nextPage(): void {
    if (this.displayPage < (this.totalPages || 1)) {
      this.pageNo++;
      this.updatePaginatedLeases();
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < (this.totalPages || 1) && target !== this.pageNo) {
      this.pageNo = target;
      this.updatePaginatedLeases();
    }
  }
}
