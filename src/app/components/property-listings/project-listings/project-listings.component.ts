import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { PROJECT_LISTING_ROWS, ProjectListingRow } from '../property-listings.data';

@Component({
  selector: 'app-project-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, SharedTableComponent],
  templateUrl: './project-listings.component.html'
})
export class ProjectListingsComponent implements OnInit {
  private translate = inject(TranslateService);

  searchQuery = '';
  pageIndex = 0;
  pageSize = 10;
  allRows = PROJECT_LISTING_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', labelKey: 'web.propertyListings.projectListings.colId', visible: true },
    { key: 'name', label: 'Project', labelKey: 'web.propertyListings.projectListings.colProject', visible: true, useTemplate: true },
    { key: 'developer', label: 'Developer', labelKey: 'web.propertyListings.projectListings.colDeveloper', visible: true },
    { key: 'location', label: 'Location', labelKey: 'web.propertyListings.projectListings.colLocation', visible: true },
    { key: 'units', label: 'Units', labelKey: 'web.propertyListings.projectListings.colUnits', visible: true },
    { key: 'available', label: 'Available', labelKey: 'web.propertyListings.projectListings.colAvailable', visible: true },
    { key: 'status', label: 'Status', labelKey: 'web.propertyListings.projectListings.colStatus', visible: true, useTemplate: true }
  ];

  ngOnInit(): void {
    this.updateColumnLabels();
    this.translate.onLangChange.subscribe(() => {
      this.updateColumnLabels();
    });
  }

  private updateColumnLabels(): void {
    this.tableColumns.forEach(col => {
      if (col.labelKey) {
        col.label = this.translate.instant(col.labelKey);
      }
    });
  }

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
