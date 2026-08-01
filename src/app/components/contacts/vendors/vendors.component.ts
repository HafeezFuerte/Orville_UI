import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../portfolio/services/properties.service';
import { Router } from '@angular/router';

export interface Vendor {
  id: number;
  code: string;
  company: string;
  email: string;
  contact: string;
  phoneNumber: string;
  location: string;
  categories: number;
  tag: string;
  status: string;
  image_path: string;
}

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.scss'
})
export class VendorsComponent implements OnInit {
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
    { key: 'company', label: 'web.contacts.lblCompany', visible: true, useTemplate: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'contact', label: 'web.contacts.lblContact', visible: true, useTemplate: true },
    { key: 'phoneNumber', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
    { key: 'location', label: 'web.contacts.lblLocation', visible: true, useTemplate: true },
    { key: 'categories', label: 'web.contacts.lblCategories', visible: true, useTemplate: true },
    { key: 'tag', label: 'web.contacts.lblTag', visible: true, useTemplate: true },
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

  vendors: Vendor[] = [];
  paginatedVendors: Vendor[] = [];

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem("selectedLang") === "EN" ? key : key + '_ar'] || row[key] || '';
  }

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors() {
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
      featureid: 'Vendors'
    };

    this.propertiesService.getTenants(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        let rawList: any[] = [];
        if (Array.isArray(response)) {
          rawList = response;
        } else if (response && response.objResult) {
          if (Array.isArray(response.objResult)) rawList = response.objResult;
          else if (response.objResult.vendors) rawList = response.objResult.vendors;
          else if (response.objResult.vendor) rawList = response.objResult.vendor;
        }

        console.log("Raw Vendors Response First Item:", rawList[0] ? JSON.stringify(rawList[0]) : "Empty");
        this.vendors = (rawList || []).map((t: any) => ({
          id: t.id || 0,
          code: t.code || '',
          company: t.company_name || t.company || t.name || '',
          email: t.email_address || t.email || '-',
          contact: t.contact_name || t.contact_person || t.contact || '-',
          phoneNumber: t.phone_number || t.phoneNumber || t.mobile_no || '-',
          location: t.country_name || t.location || t.address1 || t.city || '-',
          categories: t.vendor_type_name || t.maintainance_categories || '-',
          tag: t.tag || t.tags || '-',
          status: t.is_active ? 'Active' : 'Blocked',
          image_path: t.image_path || ''
        })).sort((a, b) => a.id - b.id);

        this.totalRecords = response?.totalCount || this.vendors.length;
        this.paginatedVendors = this.vendors;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching vendors:', err);
      }
    });
  }

  onSearch() {
    this.pageNo = 1;
    this.loadVendors();
  }
  
  setStatusFilter(status: 'All' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.pageNo = 1;
    this.loadVendors();
  }

  onSharedTablePageChange(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadVendors();
  }
  
  handleEditAction(row: any) {
    if (row.action_name === 'edit') {
      this.router.navigate(['/contacts/vendors/edit-vendor', row.code]);
    } else if (row.action_name === 'delete') {
      console.log('Delete vendor clicked', row.id);
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }
}
