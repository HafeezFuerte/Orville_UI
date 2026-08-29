import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import {
  MOBILE_STATS_ROWS,
  MOBILE_STATS_TABS,
  MobileStatsRow,
  MobileStatsTab,
  mobileStatsAudienceLabel,
} from '../mobile-stats.data';

@Component({
  selector: 'app-mobile-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './mobile-stats.component.html',
  styleUrls: ['./mobile-stats.component.scss'],
})
export class MobileStatsComponent {
  readonly tabs = MOBILE_STATS_TABS;

  activeTab: MobileStatsTab = 'tenants';
  searchQuery = '';
  showColumnDropdown = false;
  showFilterDrawer = false;
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  private rows: MobileStatsRow[] = [...MOBILE_STATS_ROWS];

  tableColumns = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true, useTemplate: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'company', label: 'Company', visible: true },
    { key: 'tags', label: 'Tags', visible: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'leases', label: 'Leases', visible: true, useTemplate: true },
    { key: 'gender', label: 'Gender', visible: true },
    { key: 'application', label: 'Application', visible: true, useTemplate: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '72px' },
  ];

  constructor(private toastr: ToastrService) {}

  get audienceLabel(): string {
    return mobileStatsAudienceLabel(this.activeTab);
  }

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns
      .filter((col) => col.key !== 'action')
      .every((col) => col.visible !== false);
  }

  get filteredRows(): MobileStatsRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.rows.filter((row) => {
      if (row.audience !== this.activeTab) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.company.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalLabel(): string {
    return this.totalRecords.toLocaleString('en-US');
  }

  get pagedRows(): MobileStatsRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  setTab(tab: MobileStatsTab): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.pageNo = 0;
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  onExport(): void {
    this.toastr.info('Export is not connected yet.', 'Mobile Stats');
  }

  sendMail(row: MobileStatsRow): void {
    this.toastr.info(`Compose email to ${row.email}`, 'Mobile Stats');
  }

  toggleDrawer(show: boolean): void {
    this.showFilterDrawer = show;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    if (key === 'action') {
      return;
    }
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = col.visible === false ? true : false;
    }
  }

  toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableColumns.forEach((col) => {
      if (col.key !== 'action') {
        col.visible = checked;
      }
    });
  }

  onSharedTablePageChange(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  applicationClass(status: string): string {
    return status === 'Installed'
      ? 'ms-app-status ms-app-status--installed'
      : 'ms-app-status ms-app-status--not';
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
