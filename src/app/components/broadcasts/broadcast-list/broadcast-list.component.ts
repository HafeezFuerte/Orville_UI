import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';

export interface Broadcast {
  id: string;
  subject: string;
  preview: string;
  status: 'Published' | 'Draft';
  broadcastType: string;
  sendTo: string;
  scheduled: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-broadcast-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent],
  templateUrl: './broadcast-list.component.html',
  styleUrl: './broadcast-list.component.scss'
})
export class BroadcastListComponent implements OnInit {
  private router = inject(Router);

  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  showFilterPanel: boolean = false;
  isLoading: boolean = false;

  pageNo = 1;
  pageSize = 20;
  totalRecords = 0;

  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1', 'Building 2'];

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'subject', label: 'Subject', visible: true },
    { key: 'preview', label: 'Preview', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'broadcastType', label: 'Broadcast Type', visible: true },
    { key: 'sendTo', label: 'Send To', visible: true },
    { key: 'scheduled', label: 'Scheduled', visible: true, useTemplate: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'updatedAt', label: 'Updated At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true },
  ];

  broadcastData: Broadcast[] = [
    { id: '31408', subject: 'Water maintenance notice', preview: 'Quick View', status: 'Published', broadcastType: 'Memo', sendTo: 'Property', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31609', subject: 'Fire drill announcement', preview: 'Quick View', status: 'Draft', broadcastType: 'Announcement', sendTo: 'Property', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31447', subject: 'Parking access update', preview: 'Quick View', status: 'Published', broadcastType: 'Memo', sendTo: 'Landlord', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31443', subject: 'Gym renewal or schedule', preview: 'Quick View', status: 'Draft', broadcastType: 'Lease', sendTo: 'Tenant', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31445', subject: 'Rent payment reminder', preview: 'Quick View', status: 'Published', broadcastType: 'Updates', sendTo: 'Lease', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31620', subject: 'Safety, cleaning alert', preview: 'Quick View', status: 'Draft', broadcastType: 'Memo', sendTo: 'Property', scheduled: true, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31619', subject: 'Elevator service notice', preview: 'Quick View', status: 'Published', broadcastType: 'Alert', sendTo: 'Lease', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31618', subject: 'Community event invitation', preview: 'Quick View', status: 'Published', broadcastType: 'Announcement', sendTo: 'Property', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31617', subject: 'Discount service notice', preview: 'Quick View', status: 'Draft', broadcastType: 'Announcement', sendTo: 'Tenant', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
    { id: '31616', subject: 'Water maintenance notice', preview: 'Quick View', status: 'Draft', broadcastType: 'Announcement', sendTo: 'Tenant', scheduled: false, date: '12-01-2026', createdAt: '10-01-2026, 20:14', updatedAt: '01-01-2026, 13:06' },
  ];

  get filteredData(): Broadcast[] {
    if (!this.searchQuery) return this.broadcastData;
    return this.broadcastData.filter(b =>
      b.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }

  ngOnInit() {}

  navigateToDetail(id: string) {
    this.router.navigate(['/broadcasts', id]);
  }

  navigateToCreate() {
    this.router.navigate(['/broadcasts/create']);
  }

  toggleColumn(col: any) {
    col.visible = !col.visible;
  }
}
