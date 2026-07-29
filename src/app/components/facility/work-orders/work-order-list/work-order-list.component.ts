import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';

export interface WorkOrder {
  id: string;
  workOrder: string;
  property: string;
  unit: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Closed' | 'Rejected';
  vendor: string;
  category: string;
  responsiblePerson: string;
  technician: string;
  lastUpdate: string;
  createdAt: string;
  createdBy: string;
}

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent],
  templateUrl: './work-order-list.component.html',
  styleUrl: './work-order-list.component.scss'
})
export class WorkOrderListComponent implements OnInit {
  private router = inject(Router);

  searchQuery: string = '';
  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1'];

  activeTab: string = 'All';
  tabs = ['All', 'New', 'Open', 'In Progress', 'On Hold', 'Resolved', 'Rejected', 'Accepted', 'Tenant Rejected', 'Canceled', 'Re-opened'];

  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'workOrder', label: 'Work order', visible: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'vendor', label: 'Vendor', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'responsiblePerson', label: 'Responsible person(s)', visible: true },
    { key: 'technician', label: 'Technician', visible: true },
    { key: 'lastUpdate', label: 'Last update', visible: true },
    { key: 'createdAt', label: 'Created at', visible: true },
    { key: 'createdBy', label: 'Created by', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  workOrderData: WorkOrder[] = [
    { id: '43644', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'Medium', status: 'Open', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43645', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'High', status: 'Closed', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43646', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'Medium', status: 'Open', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43647', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'High', status: 'Closed', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43648', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'High', status: 'Closed', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43649', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'High', status: 'Closed', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43650', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'Low', status: 'Rejected', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43651', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'Medium', status: 'Open', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43652', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'High', status: 'Closed', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' },
    { id: '43653', workOrder: 'Ac not working', property: 'Marina Heights Tower A', unit: 'Apartment-101-FR', priority: 'High', status: 'Closed', vendor: 'Rahman Mohammad', category: 'Air Conditioner', responsiblePerson: 'Sanul Hameed', technician: 'Kaif Mohammed', lastUpdate: '2026-07-28', createdAt: '2026-07-28', createdBy: 'Zaid Rahman' }
  ];

  get filteredData(): WorkOrder[] {
    if (!this.searchQuery) return this.workOrderData;
    return this.workOrderData.filter(w =>
      w.workOrder.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }

  ngOnInit() {}

  navigateToCreate() {
    this.router.navigate(['/facility/work-orders/create']);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/facility/work-orders', id]);
  }
}
