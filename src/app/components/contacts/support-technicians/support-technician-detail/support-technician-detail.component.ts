import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-support-technician-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule],
  templateUrl: './support-technician-detail.component.html',
  styleUrl: './support-technician-detail.component.scss'
})
export class SupportTechnicianDetailComponent {
  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];

  activeTab = 'Work Orders';
  tabs = ['Work Orders'];

  showActionDropdown = false;

  // Dropdown options
  actionOptions = [
    { label: 'Edit Technician', icon: 'ri-edit-line' },
    { label: 'Block Technician', icon: 'ri-prohibit-line' }
  ];

  // Technician details mock
  technician = {
    id: 31658,
    name: 'suhel barwani Muhammed',
    email: 'suhelbarwani@gmail.com',
    phone: '+971 0528 6135 68',
    username: 'suhel10',
    status: 'Active',
    assignedJob: 'shamedvendor@gmail.com',
    responsibleForWorkOrders: false,
    system: {
      createdAt: '09-10-2025 03:22 PM',
      lastLoginAt: '09-10-2026 09:21 PM'
    }
  };

  // Work orders table columns
  workOrderColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'title', label: 'web.contacts.lblSubject', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'closingStatus', label: 'web.contacts.lblStatus', visible: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'dueDate', label: 'web.contacts.lblDueDate', visible: true },
    { key: 'priority', label: 'web.contacts.lblPriority', visible: true, useTemplate: true },
    { key: 'property', label: 'web.contacts.lblProperty', visible: true }
  ];

  workOrderData = [
    { id: 'WO-1001', title: 'Repair Water Leak', status: 'Open', closingStatus: 'Pending', internalStatus: 'Assigned', dueDate: '15-07-2026', priority: 'High', property: 'Sunrise Ap...' },
    { id: 'WO-1002', title: 'Replace Corridor Lights', status: 'In Progress', closingStatus: 'Pending', internalStatus: 'Working', dueDate: '18-07-2026', priority: 'Medium', property: 'Green Heig...' },
    { id: 'WO-1003', title: 'HVAC Annual Service', status: 'Completed', closingStatus: 'Closed', internalStatus: 'Verified', dueDate: '08-07-2026', priority: 'Low', property: 'Oak Reside...' },
    { id: 'WO-1004', title: 'Paint Lobby Walls', status: 'Open', closingStatus: 'Pending', internalStatus: 'Awaiting Approval', dueDate: '22-07-2026', priority: 'Medium', property: 'City Centre' },
    { id: 'WO-1005', title: 'Elevator Inspection', status: 'Scheduled', closingStatus: 'Pending', internalStatus: 'Scheduled', dueDate: '20-07-2026', priority: 'High', property: 'River View' }
  ];

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
