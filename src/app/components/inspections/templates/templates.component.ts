import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './templates.component.html',
  styleUrls: []
})
export class TemplatesComponent implements OnInit {
  isLoading = false;
  activeFilter: 'All' | 'Admin' | 'User' = 'All';
  searchQuery = '';
  isDrawerOpen = false;
  isColumnDropdownOpen = false;

  // Filter properties
  filterCreatedBy: any = null;
  filterTemplateName = '';
  filterTag: string | null = null;
  filterArea: string | null = null;
  filterId: any = null;
  filterRefNo: string | null = null;
  filterOffPlanStatus: string | null = null;
  filterLandlord: string | null = null;
  filterInternalStatus: string | null = null;

  createdByOptions = ['Admin', 'User'];

  // Table row data
  templatesData = [
    { id: '31658', templateName: 'Move Out Inspection', createdBy: 'Admin', createdAt: '10-01-2026, 09:14 PM' },
    { id: '31658', templateName: 'Move In Inspection', createdBy: 'Admin', createdAt: '10-01-2026, 09:14 PM' },
    { id: '31658', templateName: 'Annual Property Inspection', createdBy: 'User', createdAt: '10-01-2026, 09:14 PM' },
    { id: '31658', templateName: 'Preventive Maintenance', createdBy: 'Admin', createdAt: '10-01-2026, 09:14 PM' },
    { id: '31658', templateName: 'Common Area Audit', createdBy: 'User', createdAt: '10-01-2026, 09:14 PM' },
    { id: '31658', templateName: 'Villa Handover', createdBy: 'Admin', createdAt: '10-01-2026, 09:14 PM' },
    { id: '31658', templateName: 'Move In Inspection', createdBy: 'User', createdAt: '10-01-2026, 09:14 PM' },
    { id: '31658', templateName: 'Move Out Inspection', createdBy: 'Admin', createdAt: '10-01-2026, 09:14 PM' }
  ];

  filteredData = [...this.templatesData];

  columns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'templateName', label: 'Template Name', visible: true, useTemplate: true },
    { key: 'createdBy', label: 'Created By', visible: true, useTemplate: true },
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  activeActionRow: any = null;

  ngOnInit() {
    this.applyFilters();
  }

  get visibleColumns() {
    return this.columns.filter(c => c.visible !== false);
  }

  get allColumnsVisible() {
    return this.columns.every(c => c.visible !== false);
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

  filterByCreatedBy(tab: 'All' | 'Admin' | 'User') {
    this.activeFilter = tab;
    this.applyFilters();
  }

  applyFilters() {
    let temp = [...this.templatesData];

    // Tabs filter
    if (this.activeFilter === 'Admin') {
      temp = temp.filter(x => x.createdBy === 'Admin');
    } else if (this.activeFilter === 'User') {
      temp = temp.filter(x => x.createdBy === 'User');
    }

    // Search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      temp = temp.filter(x => x.templateName.toLowerCase().includes(query));
    }

    // Drawer filters
    if (this.filterCreatedBy) {
      temp = temp.filter(x => x.createdBy === this.filterCreatedBy);
    }
    if (this.filterTemplateName) {
      temp = temp.filter(x => x.templateName.toLowerCase().includes(this.filterTemplateName.toLowerCase()));
    }

    this.filteredData = temp;
  }

  resetFilters() {
    this.filterCreatedBy = null;
    this.filterTemplateName = '';
    this.filterTag = null;
    this.filterArea = null;
    this.filterId = null;
    this.filterRefNo = null;
    this.filterOffPlanStatus = null;
    this.filterLandlord = null;
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
