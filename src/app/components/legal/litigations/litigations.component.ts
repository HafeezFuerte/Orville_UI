import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';

export interface Litigation {
  id: string;
  name: string;
  details: string;
  legalFirm: string;
  caseDate: string;
  status: 'Open' | 'Closed' | 'Pending';
  escalationOption: number;
  property: string;
  unit: string;
  lease: string;
  unitBlocked: 'Yes' | 'No';
  tenantBlocked: 'Yes' | 'No';
  hearingsCount: number;
  attachmentsCount: number;
  notesCount: number;
  internalStatus: string;
}

@Component({
  selector: 'app-litigations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './litigations.component.html',
  styleUrls: []
})
export class LitigationsComponent implements OnInit {
  searchQuery: string = '';
  isLoading: boolean = false;
  activeStatusFilter: string = 'All';
  showColumnDropdown = false;
  isDrawerOpen: boolean = false;

  // Filter models
  filterLegalFirm: string | null = null;
  filterProperty: string | null = null;
  filterUnitBlocked: string | null = null;
  filterTenantBlocked: string | null = null;

  // Filter option lists
  legalFirmsList: string[] = ['Smith & Partners', 'Legal Associates LLC', 'Justice Legal Consultants', 'Elite Law Firm', 'Prime Legal Services'];
  propertiesList: string[] = ['Sunrise Apartments', 'Green Heights', 'Oak Residency', 'City Center Plaza', 'River View Towers'];
  blockedStatusList: string[] = ['Yes', 'No'];

  pageNo = 0;
  pageSize = 10;
  totalRecords = 5;
  
  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'details', label: 'Details', visible: true },
    { key: 'legalFirm', label: 'Legal Firm', visible: true },
    { key: 'caseDate', label: 'Case Date', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'escalationOption', label: 'Escalation Option', visible: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'lease', label: 'Lease', visible: true, useTemplate: true },
    { key: 'unitBlocked', label: 'Unit Blocked', visible: true, useTemplate: true },
    { key: 'tenantBlocked', label: 'Tenant Blocked', visible: true, useTemplate: true },
    { key: 'hearingsCount', label: 'Hearings Count', visible: true, useTemplate: true },
    { key: 'attachmentsCount', label: 'Attachments Count', visible: true, useTemplate: true },
    { key: 'notesCount', label: 'Notes Count', visible: true, useTemplate: true },
    { key: 'internalStatus', label: 'Internal Statuses', visible: true }
  ];

  litigationsData: Litigation[] = [
    {
      id: 'LC-1001',
      name: 'Rent Recovery Case',
      details: 'Tenant has 3 months overdue rent.',
      legalFirm: 'Smith & Partners',
      caseDate: '15-07-2026',
      status: 'Open',
      escalationOption: 2,
      property: 'Sunrise Apartments',
      unit: 'A-101',
      lease: 'LEASE-2025-001',
      unitBlocked: 'Yes',
      tenantBlocked: 'No',
      hearingsCount: 2,
      attachmentsCount: 5,
      notesCount: 3,
      internalStatus: 'Under Review'
    },
    {
      id: 'LC-1002',
      name: 'Lease Violation',
      details: 'Unauthorized structural modifications.',
      legalFirm: 'Legal Associates LLC',
      caseDate: '18-07-2026',
      status: 'Closed',
      escalationOption: 5,
      property: 'Green Heights',
      unit: 'B-205',
      lease: 'LEASE-2024-056',
      unitBlocked: 'No',
      tenantBlocked: 'No',
      hearingsCount: 1,
      attachmentsCount: 2,
      notesCount: 4,
      internalStatus: 'Awaiting Response'
    },
    {
      id: 'LC-1003',
      name: 'Eviction Proceedings',
      details: 'Continuous rent default despite notices.',
      legalFirm: 'Justice Legal Consultants',
      caseDate: '08-07-2026',
      status: 'Pending',
      escalationOption: 3,
      property: 'Oak Residency',
      unit: 'C-312',
      lease: 'LEASE-2023-089',
      unitBlocked: 'Yes',
      tenantBlocked: 'Yes',
      hearingsCount: 4,
      attachmentsCount: 8,
      notesCount: 6,
      internalStatus: 'Hearing Scheduled'
    },
    {
      id: 'LC-1004',
      name: 'Property Damage Claim',
      details: 'Significant damage found during inspection.',
      legalFirm: 'Elite Law Firm',
      caseDate: '22-07-2026',
      status: 'Open',
      escalationOption: 2,
      property: 'City Center Plaza',
      unit: 'D-108',
      lease: 'LEASE-2025-018',
      unitBlocked: 'No',
      tenantBlocked: 'No',
      hearingsCount: 0,
      attachmentsCount: 3,
      notesCount: 2,
      internalStatus: 'Evidence Collection'
    },
    {
      id: 'LC-1005',
      name: 'Security Deposit Dispute',
      details: 'Tenant disputes final deductions.',
      legalFirm: 'Prime Legal Services',
      caseDate: '20-07-2026',
      status: 'Closed',
      escalationOption: 1,
      property: 'River View Towers',
      unit: 'E-412',
      lease: 'LEASE-2022-145',
      unitBlocked: 'No',
      tenantBlocked: 'No',
      hearingsCount: 3,
      attachmentsCount: 6,
      notesCount: 5,
      internalStatus: 'Closed Successfully'
    }
  ];

  filteredData: Litigation[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible);
  }

  toggleColumn(key: string) {
    const col = this.tableColumns.find(c => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(event: any) {
    const checked = event.target.checked;
    this.tableColumns.forEach(c => c.visible = checked);
  }

  setStatusFilter(status: string) {
    this.activeStatusFilter = status;
    this.applyFilters();
  }

  applyFilters() {
    let temp = [...this.litigationsData];

    // Status filter
    if (this.activeStatusFilter !== 'All') {
      temp = temp.filter(item => item.status.toLowerCase() === this.activeStatusFilter.toLowerCase());
    }

    // Search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.id.toLowerCase().includes(q) ||
        item.legalFirm.toLowerCase().includes(q)
      );
    }

    // Drawer Filters
    if (this.filterLegalFirm) {
      temp = temp.filter(item => item.legalFirm === this.filterLegalFirm);
    }
    if (this.filterProperty) {
      temp = temp.filter(item => item.property === this.filterProperty);
    }
    if (this.filterUnitBlocked) {
      temp = temp.filter(item => item.unitBlocked === this.filterUnitBlocked);
    }
    if (this.filterTenantBlocked) {
      temp = temp.filter(item => item.tenantBlocked === this.filterTenantBlocked);
    }

    this.filteredData = temp;
    this.totalRecords = this.filteredData.length;
  }

  clearFilters() {
    this.filterLegalFirm = null;
    this.filterProperty = null;
    this.filterUnitBlocked = null;
    this.filterTenantBlocked = null;
    this.applyFilters();
  }

  onPageChange(event: any) {
    // Shared table pagination trigger hook
  }
}
