import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { PROJECT_LISTING_ROWS, ProjectListingRow } from '../property-listings.data';

@Component({
  selector: 'app-project-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent],
  templateUrl: './project-listings.component.html'
})
export class ProjectListingsComponent {
  searchQuery = '';
  pageIndex = 0;
  pageSize = 10;
  allRows = PROJECT_LISTING_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Project', visible: true, useTemplate: true },
    { key: 'developer', label: 'Developer', visible: true },
    { key: 'location', label: 'Location', visible: true },
    { key: 'units', label: 'Units', visible: true },
    { key: 'available', label: 'Available', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true }
  ];

  get filteredRows(): ProjectListingRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.allRows;
    }
    return this.allRows.filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.developer.toLowerCase().includes(q) ||
        row.location.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
    );
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get paginatedRows(): ProjectListingRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  statusClass(status: ProjectListingRow['status']): string {
    switch (status) {
      case 'Active':
        return 'ov-status ov-status--success';
      case 'Coming Soon':
        return 'ov-status ov-status--info';
      default:
        return 'ov-status ov-status--muted';
    }
  }
}
