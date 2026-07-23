import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
  activeLease: string;
  leases: number;
  gender: string;
  status: string;
}

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent implements OnInit {
  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  statusFilter: 'All' | 'Active' | 'Blocked' = 'All';

  // Pagination
  pageNo = 1;
  pageSize = 10;
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

  tenants: Tenant[] = [
    { id: 31658, name: 'Ahmed Yassin', email: 'ahmed.yassin@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 2, gender: 'Male', status: 'Active' },
    { id: 31659, name: 'Dina Said', email: 'dina.said23@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 1, gender: 'Female', status: 'Active' },
    { id: 31660, name: 'Fatma Ashraf', email: 'fatmaashraf@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 4, gender: 'Female', status: 'Active' },
    { id: 31661, name: 'Yousef Imam', email: 'yousefimam@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 0, gender: 'Male', status: 'Blocked' },
    { id: 31662, name: 'Nagla Mustafa', email: 'naglamustafa@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 1, gender: 'Female', status: 'Active' },
    { id: 31663, name: 'Rania Amr', email: 'raniaamr@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 3, gender: 'Female', status: 'Blocked' },
    { id: 31664, name: 'Aya Sayed', email: 'ayasayed87@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 0, gender: 'Female', status: 'Blocked' },
    { id: 31665, name: 'Samer Youssef', email: 'samer_youssef@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 2, gender: 'Male', status: 'Active' },
    { id: 31666, name: 'Mo Naser', email: 'mo_naser@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 2, gender: 'Male', status: 'Active' },
    { id: 31667, name: 'Maha Rama', email: 'moharama214@mail.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', activeLease: 'Lease - 134273 - Marina Heights Towers', leases: 2, gender: 'Female', status: 'Active' }
  ];

  paginatedTenants: Tenant[] = [];

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
    let filtered = this.tenants;
    
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(l => l.status === this.statusFilter);
    }
    
    if (this.searchQuery) {
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        l.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.id.toString().includes(this.searchQuery)
      );
    }
    
    this.totalRecords = filtered.length;
    this.paginatedTenants = filtered;
  }
  
  getStatusClass(status: string) {
    switch(status) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Blocked': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
