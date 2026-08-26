import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { EMAIL_LOG_ROWS, EmailLogRow, EmailLogTab } from '../email-logs.data';

@Component({
  selector: 'app-email-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './email-logs.component.html',
  styleUrls: ['./email-logs.component.scss'],
})
export class EmailLogsComponent {
  tabs: { id: EmailLogTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'failed', label: 'Failed Emails' },
  ];

  activeTab: EmailLogTab = 'all';
  searchQuery = '';
  showColumnDropdown = false;
  showFilterDrawer = false;
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  private rows: EmailLogRow[] = [...EMAIL_LOG_ROWS];

  tableColumns = [
    { key: 'date', label: 'Date', visible: true },
    { key: 'subject', label: 'Subject', visible: true, useTemplate: true },
    { key: 'from', label: 'From', visible: true },
    { key: 'to', label: 'To', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): EmailLogRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.rows.filter((row) => {
      const tabMatch = this.activeTab === 'all' || row.status === 'Failed';
      const searchMatch = !q || row.subject.toLowerCase().includes(q);
      return tabMatch && searchMatch;
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalLabel(): string {
    return this.totalRecords.toLocaleString('en-US');
  }

  get pagedRows(): EmailLogRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  setTab(tab: EmailLogTab): void {
    this.activeTab = tab;
    this.pageNo = 0;
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  toggleDrawer(show: boolean): void {
    this.showFilterDrawer = show;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = col.visible === false ? true : false;
    }
  }

  toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableColumns.forEach((col) => (col.visible = checked));
  }

  onSharedTablePageChange(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  statusClass(status: string): string {
    return status === 'Failed' ? 'email-logs-status email-logs-status--failed' : 'email-logs-status';
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
