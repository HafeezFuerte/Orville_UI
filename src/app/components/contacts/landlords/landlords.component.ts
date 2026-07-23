import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

export interface Landlord {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
  noOfProperties: number;
  unitsRooms: string;
  country: string;
  tag: string;
  status: string;
}

@Component({
  selector: 'app-landlords',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './landlords.component.html',
  styleUrl: './landlords.component.scss'
})
export class LandlordsComponent implements OnInit {
  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  statusFilter: 'All' | 'Active' | 'Blocked' = 'All';

  // Pagination
  pageNo = 1;
  pageSize = 5;
  totalRecords = 0;

  tableColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true, useTemplate: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'phoneNumber', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
    { key: 'company', label: 'web.contacts.lblCompany', visible: true, useTemplate: true },
    { key: 'noOfProperties', label: 'web.contacts.lblNoOfProperties', visible: true, useTemplate: true },
    { key: 'unitsRooms', label: 'web.contacts.lblUnitsRooms', visible: true, useTemplate: true },
    { key: 'country', label: 'web.contacts.lblCountry', visible: true, useTemplate: true },
    { key: 'tag', label: 'web.contacts.lblTag', visible: true, useTemplate: true }
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

  landlords: Landlord[] = [
    { id: 31658, name: 'Orville Real Estate', email: 'rental@orvillerealestate.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', noOfProperties: 2, unitsRooms: '280 / 1280', country: 'United Arab Emirates', tag: 'Tag', status: 'Active' },
    { id: 31659, name: 'Orville Real Estate', email: 'rental@orvillerealestate.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', noOfProperties: 1, unitsRooms: '280 / 1280', country: 'United Arab Emirates', tag: 'Tag', status: 'Blocked' },
    { id: 31660, name: 'Orville Real Estate', email: 'rental@orvillerealestate.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', noOfProperties: 4, unitsRooms: '280 / 1280', country: 'United Arab Emirates', tag: 'Tag', status: 'Active' },
    { id: 31661, name: 'Orville Real Estate', email: 'rental@orvillerealestate.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', noOfProperties: 0, unitsRooms: '0 / 0', country: 'United Arab Emirates', tag: 'Tag', status: 'Active' },
    { id: 31662, name: 'Orville Real Estate', email: 'rental@orvillerealestate.com', phoneNumber: '+971 50 62 3358', company: 'Orville real estate', noOfProperties: 1, unitsRooms: '280 / 1280', country: 'United Arab Emirates', tag: 'Tag', status: 'Active' }
  ];

  paginatedLandlords: Landlord[] = [];

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
    let filtered = this.landlords;
    
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
    this.paginatedLandlords = filtered;
  }
}
