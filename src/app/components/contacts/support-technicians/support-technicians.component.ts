import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

export interface Technician {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
  assignedUnits: number;
  status: string;
  workOrder: string;
}

@Component({
  selector: 'app-support-technicians',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './support-technicians.component.html',
  styleUrl: './support-technicians.component.scss'
})
export class SupportTechniciansComponent implements OnInit {
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
    { key: 'username', label: 'web.contacts.lblUsername', visible: true, useTemplate: true },
    { key: 'assignedUnits', label: 'web.contacts.lblAssignedUnits', visible: true, useTemplate: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'workOrder', label: 'web.contacts.lblWorkOrder', visible: true, useTemplate: true }
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

  technicians: Technician[] = [
    { id: 31658, name: 'Furqan Iyad Soltani', email: 'boston@live.com', phoneNumber: '+971 50 62 3358', username: 'furqan', assignedUnits: 65, status: 'Active', workOrder: 'Yes' },
    { id: 31659, name: 'Mujahid Yaseer al-Ghattas', email: 'slang@planet.net', phoneNumber: '+971 50 62 3358', username: 'mujahid', assignedUnits: 120, status: 'Active', workOrder: 'Yes' },
    { id: 31660, name: 'Muzammil al-Hussain', email: 'bonmots@att.net', phoneNumber: '+971 50 62 3358', username: 'muzammil', assignedUnits: 201, status: 'Active', workOrder: 'Yes' },
    { id: 31661, name: 'Abdul Hameed al-Bishara', email: 'bonmots@optonline.net', phoneNumber: '+971 50 62 3358', username: 'abdul', assignedUnits: 53, status: 'Blocked', workOrder: 'No' },
    { id: 31662, name: 'Dawood Ashkir Fakhri', email: 'jgillig@hotmail.com', phoneNumber: '+971 50 62 3358', username: 'dawood', assignedUnits: 10, status: 'Active', workOrder: 'Yes' }
  ];

  paginatedTechnicians: Technician[] = [];

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
    let filtered = this.technicians;
    
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(l => l.status === this.statusFilter);
    }
    
    if (this.searchQuery) {
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        l.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.id.toString().includes(this.searchQuery)
      );
    }
    
    this.totalRecords = filtered.length;
    this.paginatedTechnicians = filtered;
  }
  
  getStatusClass(status: string) {
    switch(status) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Blocked': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
