import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

export interface Vendor {
  id: number;
  company: string;
  email: string;
  contact: string;
  phoneNumber: string;
  location: string;
  categories: number;
  tag: string;
  status: string;
}

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.scss'
})
export class VendorsComponent implements OnInit {
  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  statusFilter: 'All' | 'Active' | 'Blocked' = 'All';

  // Pagination
  pageNo = 1;
  pageSize = 10;
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

  vendors: Vendor[] = [
    { id: 31658, company: 'Darone L.L.C.', email: 'boston@live.com', contact: 'Marley Natural', phoneNumber: '+971 50 62 3358', location: 'Al Karama, Dubai', categories: 5, tag: 'Tag', status: 'Active' },
    { id: 31659, company: 'Office Enterprises Ltd.', email: 'slang@planet.net', contact: 'Cannabis City', phoneNumber: '+971 50 62 3358', location: 'Al Karama, Dubai', categories: 10, tag: 'Tag', status: 'Active' },
    { id: 31660, company: 'Acme Co.', contact: 'Goodship', email: 'bonmots@att.net', phoneNumber: '+971 50 62 3358', location: 'Al Karama, Dubai', categories: 2, tag: 'Tag', status: 'Active' },
    { id: 31661, company: 'Amerigo Ltd.', contact: 'Canopy Growth', email: 'bonmots@optonline.net', phoneNumber: '+971 50 62 3358', location: 'Al Karama, Dubai', categories: 3, tag: 'Tag', status: 'Blocked' },
    { id: 31662, company: 'Redwood Inc.', contact: 'Aurora Cannabis', email: 'jgillig@hotmail.com', phoneNumber: '+971 50 62 3358', location: 'Al Karama, Dubai', categories: 2, tag: 'Tag', status: 'Active' }
  ];

  paginatedVendors: Vendor[] = [];

  ngOnInit(): void {
    this.updatePagination();
  }

  onSearch() {
    this.pageNo = 1;
    this.updatePagination();
  }
  
  setStatusFilter(status: 'All' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.pageNo = 1;
    this.updatePagination();
  }

  onSharedTablePageChange(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination() {
    let filtered = this.vendors;
    
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(l => l.status === this.statusFilter);
    }
    
    if (this.searchQuery) {
      filtered = filtered.filter(l => 
        l.company.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        l.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.contact.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.id.toString().includes(this.searchQuery)
      );
    }
    
    this.totalRecords = filtered.length;
    this.paginatedVendors = filtered;
  }
  
  getStatusClass(status: string) {
    switch(status) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Blocked': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
