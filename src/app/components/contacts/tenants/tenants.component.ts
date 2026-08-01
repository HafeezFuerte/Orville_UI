import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../portfolio/services/properties.service';
import { Router } from '@angular/router';

export interface Tenant {
  id: number;
  code: string;
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
  activeLease: string;
  leases: number;
  gender: string;
  status: string;
  image_path: string;
}

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent implements OnInit {
  private propertiesService = inject(PropertiesService);
  private router = inject(Router);

  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  statusFilter: 'All' | 'Active' | 'Blocked' = 'All';
  isLoading: boolean = false;

  // Pagination
  pageNo = 1;
  pageSize = 20;
  totalRecords = 0;

  tableColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true, useTemplate: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'phoneNumber', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
    { key: 'company', label: 'web.contacts.lblCompany', visible: true, useTemplate: true },
    { key: 'activeLease', label: 'web.contacts.lblActiveLease', visible: true, useTemplate: true },
    { key: 'leases', label: 'web.contacts.lblLeases', visible: true, useTemplate: true },
    { key: 'gender', label: 'web.contacts.lblGender', visible: true, useTemplate: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true }
  ];

  get visibleColumns() {
    return this.tableColumns.filter(col => col.visible !== false);
  }

  toggleColumn(colKey: string) {
    const col = this.tableColumns.find(c => c.key === colKey);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(event: any) {
    const checked = event.target.checked;
    this.tableColumns.forEach(c => c.visible = checked);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible !== false);
  }

  tenants: Tenant[] = [];
  paginatedTenants: Tenant[] = [];

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem("selectedLang") === "EN" ? key : key + '_ar'] || row[key] || '';
  }

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants() {
    this.isLoading = true;
    const payload = {
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: localStorage.getItem('clientId') || '74BB6922',
      source: 'web',
      languageid: 1,
      page_no: this.pageNo - 1,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      filter_by: this.statusFilter !== 'All' ? this.statusFilter : '',
      filter_list: '',
      featureid: 'Tenants'
    };

    this.propertiesService.getTenants(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        let rawList: any[] = [];
        if (Array.isArray(response)) {
          rawList = response;
        } else if (response && response.objResult) {
          if (Array.isArray(response.objResult)) rawList = response.objResult;
          else if (response.objResult.tenants) rawList = response.objResult.tenants;
          else if (response.objResult.tenant) rawList = response.objResult.tenant;
        }

        this.tenants = (rawList || []).map((t: any) => ({
          id: t.id || 0,
          code: t.code || '',
          name: t.tenant || '',
          email: t.email_address || '-',
          phoneNumber: t.phone_number || '-',
          company: t.company_name || '-',
          activeLease: t.active_lease || '-',
          leases: t.total_leases || 0,
          gender: t.gender || 'Male',
          status: t.is_active ? 'Active' : 'Blocked',
          image_path: t.image_path || ''
        })).sort((a, b) => a.id - b.id);

        this.totalRecords = response?.totalCount || this.tenants.length;
        this.paginatedTenants = this.tenants;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching tenants:', err);
      }
    });
  }

  onSearch() {
    this.pageNo = 1;
    this.loadTenants();
  }
  
  setStatusFilter(status: 'All' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.pageNo = 1;
    this.loadTenants();
  }

  onSharedTablePageChange(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadTenants();
  }

  handleEditAction(row: any) {
    if (row.action_name === 'edit') {
      this.router.navigate(['/contacts/tenants/edit-tenant', row.code]);
    } else if (row.action_name === 'delete') {
      console.log('Delete tenant clicked', row.id);
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }
}
