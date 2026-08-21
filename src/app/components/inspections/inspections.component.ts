import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../shared/components/filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-inspections',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './inspections.component.html',
  styleUrls: []
})
export class InspectionsComponent implements OnInit {
  isLoading = false;
  activeFilter: 'All' | 'Scheduled' | 'Not Scheduled' = 'All';
  searchQuery = '';
  isDrawerOpen = false;
  isColumnDropdownOpen = false;

  // Filter properties from sidebar
  filterTags = '';
  filterArea = '';
  filterId = '';
  filterRefNo = '';
  filterOffPlanStatus = null;
  filterLandlord = '';
  filterInternalStatus = null;

  offPlanStatuses = ['Yes', 'No'];
  internalStatuses = ['Completed', 'Pending', 'Scheduled'];

  // Table row data
  inspectionsData = [
    { id: '31658', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215-PR-1', scheduled: 'Yes', userId: '59838', created: '10-01-2026, 09:14' },
    { id: '31658', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215-PR-1', scheduled: 'No', userId: '59838', created: '10-01-2026, 09:14' },
    { id: '31658', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215-PR-1', scheduled: 'Yes', userId: '59838', created: '10-01-2026, 09:14' },
    { id: '31658', name: 'Move Out', status: 'Pending', type: 'Move Out', property: 'Marina Heights Tower', unit: '215-PR-1', scheduled: 'No', userId: '59838', created: '10-01-2026, 09:14' },
    { id: '31658', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215-PR-1', scheduled: 'Yes', userId: '59838', created: '10-01-2026, 09:14' },
    { id: '31658', name: 'Move Out', status: 'Pending', type: 'Move Out', property: 'Marina Heights Tower', unit: '215-PR-1', scheduled: 'No', userId: '59838', created: '10-01-2026, 09:14' },
    { id: '31658', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215-PR-1', scheduled: 'Yes', userId: '59838', created: '10-01-2026, 09:14' },
    { id: '31658', name: 'Move Out', status: 'Pending', type: 'Move Out', property: 'Marina Heights Tower', unit: '215-PR-1', scheduled: 'Yes', userId: '59838', created: '10-01-2026, 09:14' }
  ];

  filteredData = [...this.inspectionsData];

  // Column checkbox list matching Figma column selector
  columns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'type', label: 'Type', visible: true, useTemplate: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'scheduled', label: 'Scheduled', visible: true, useTemplate: true },
    { key: 'userId', label: 'User Id', visible: true, useTemplate: true },
    { key: 'created', label: 'Created', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  // Dropdown menu state
  activeActionRow: any = null;

  ngOnInit() {
    this.applyFilters();
  }

  get visibleColumns() {
    return this.columns.filter(c => c.visible !== false);
  }

  toggleColumnDropdown() {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }

  toggleColumn(col: any) {
    col.visible = !(col.visible !== false);
  }

  toggleAllColumns(event: any) {
    const isChecked = event.target.checked;
    this.columns.forEach(c => c.visible = isChecked);
  }

  get allColumnsVisible() {
    return this.columns.every(c => c.visible !== false);
  }

  filterByStatus(tab: 'All' | 'Scheduled' | 'Not Scheduled') {
    this.activeFilter = tab;
    this.applyFilters();
  }

  applyFilters() {
    let temp = [...this.inspectionsData];

    // Status tabs filter
    if (this.activeFilter === 'Scheduled') {
      temp = temp.filter(x => x.scheduled === 'Yes');
    } else if (this.activeFilter === 'Not Scheduled') {
      temp = temp.filter(x => x.scheduled === 'No');
    }

    // Keyword search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      temp = temp.filter(x => 
        x.name.toLowerCase().includes(query) || 
        x.property.toLowerCase().includes(query) || 
        x.unit.toLowerCase().includes(query)
      );
    }

    // Sidebar search filters
    if (this.filterId) {
      temp = temp.filter(x => x.id.includes(this.filterId));
    }
    if (this.filterInternalStatus) {
      temp = temp.filter(x => x.status === this.filterInternalStatus);
    }

    this.filteredData = temp;
  }

  resetFilters() {
    this.filterTags = '';
    this.filterArea = '';
    this.filterId = '';
    this.filterRefNo = '';
    this.filterOffPlanStatus = null;
    this.filterLandlord = '';
    this.filterInternalStatus = null;
    this.applyFilters();
  }

  toggleActionMenu(row: any, event: MouseEvent) {
    event.stopPropagation();
    if (this.activeActionRow === row) {
      this.activeActionRow = null;
    } else {
      this.activeActionRow = row;
    }
  }

  closeActionMenu() {
    this.activeActionRow = null;
  }
}
