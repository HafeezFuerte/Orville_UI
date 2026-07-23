import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: string;
}

@Component({
  selector: 'app-all-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './all-contacts.component.html',
  styleUrl: './all-contacts.component.scss'
})
export class AllContactsComponent implements OnInit {
  searchQuery: string = '';
  showColumnDropdown: boolean = false;

  // Pagination
  pageNo = 1;
  pageSize = 10;
  totalRecords = 150;

  tableColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true, useTemplate: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'phoneNumber', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
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

  contacts: Contact[] = [
    { id: 31658, name: 'Ahmed Yassin', email: 'ahmed.yassin@mail.com', phoneNumber: '+971 50 62 3358', status: 'Active' },
    { id: 31659, name: 'Dina Said', email: 'dina.said23@mail.com', phoneNumber: '+971 50 62 3358', status: 'Active' },
    { id: 31660, name: 'Fatma Ashraf', email: 'fatmaashraf@mail.com', phoneNumber: '+971 50 62 3358', status: 'Blocked' },
    { id: 31661, name: 'Yousef Imam', email: 'yousefimam@mail.com', phoneNumber: '+971 50 62 3358', status: 'Active' },
    { id: 31662, name: 'Nagla Mustafa', email: 'naglamustafa@mail.com', phoneNumber: '+971 50 62 3358', status: 'Blocked' },
    { id: 31663, name: 'Rania Amr', email: 'raniaamr@mail.com', phoneNumber: '+971 50 62 3358', status: 'Active' },
    { id: 31664, name: 'Aya Sayed', email: 'ayasayed87@mail.com', phoneNumber: '+971 50 62 3358', status: 'Active' },
    { id: 31665, name: 'Samer Youssef', email: 'samer_youssef@mail.com', phoneNumber: '+971 50 62 3358', status: 'Blocked' },
    { id: 31666, name: 'Mo Naser', email: 'mo_naser@mail.com', phoneNumber: '+971 50 62 3358', status: 'Active' },
    { id: 31667, name: 'Mona Ramy', email: 'monaramy21@mail.com', phoneNumber: '+971 50 62 3358', status: 'Active' },
  ];

  paginatedContacts: Contact[] = [];

  ngOnInit(): void {
    this.updatePagination();
  }

  onSearch() {
    this.pageNo = 1;
    this.updatePagination();
  }

  onSharedTablePageChange(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination() {
    let filtered = this.contacts;
    if (this.searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.id.toString().includes(this.searchQuery)
      );
    }
    this.totalRecords = filtered.length;
    
    this.paginatedContacts = filtered;
  }

  getStatusClass(status: string) {
    switch(status) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Blocked': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
