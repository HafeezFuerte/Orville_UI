import { Component, OnInit, inject } from '@angular/core';
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

  // Filter Drawer fields
  filterTenant: string = '';
  filterProperty: string = '';
  filterStatus: string | null = null;
  statusOptions = ['Active', 'Draft', 'Completed', 'Pending Approvals'];

  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'leaseName', label: 'Lease Name', visible: true },
    { key: 'tenant', label: 'Tenant', visible: true },
    { key: 'legalCase', label: 'Legal Case', visible: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'rent', label: 'Rent (AED)', visible: true, useTemplate: true },
    { key: 'startDate', label: 'Start Date', visible: true }
  ];

  // Metrics
  metrics = {
    revenue: 'AED 4.3 M',
    totalLeases: 24183,
    activeLeases: 18420,
    draftLeases: 3240,
    expiringLeases: 420
  };

  // Mock Data
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

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredLeases = this.allLeases.filter(lease => {
      // Status Filter
      if (this.activeStatusFilter !== 'All' && lease.status !== this.activeStatusFilter) {
        return false;
      }
      // Drawer Tenant Filter
      if (this.filterTenant && !lease.tenant.toLowerCase().includes(this.filterTenant.toLowerCase())) {
        return false;
      }
      // Drawer Property Filter
      if (this.filterProperty && !lease.property.toLowerCase().includes(this.filterProperty.toLowerCase())) {
        return false;
      }
      // Drawer Status Filter
      if (this.filterStatus && lease.status !== this.filterStatus) {
        return false;
      }
      // Search Filter
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
  }

  setStatusFilter(status: string) {
    this.activeStatusFilter = status;
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
    this.applyFilters();
  }

  navigateToCreate() {
    this.router.navigate(['/leases/create']);
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }
}
