import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { FEEDBACK_ROWS, FeedbackRow } from '../feedbacks.data';

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent {
  searchQuery = '';
  showColumnDropdown = false;
  showFilterDrawer = false;
  openActionId: string | null = null;
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  private rows: FeedbackRow[] = [...FEEDBACK_ROWS];

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'submittedAt', label: 'Submitted at', visible: true },
    { key: 'tenant', label: 'Tenant', visible: true },
    { key: 'phone', label: 'Phone', visible: true },
    { key: 'propertyUnit', label: 'Property/Unit', visible: true, useTemplate: true },
    { key: 'response', label: 'Response', visible: true, useTemplate: true },
    { key: 'comment', label: 'Comment', visible: true, useTemplate: true },
    { key: 'action', label: '', visible: true, useTemplate: true, width: '48px' },
  ];

  constructor(private toastr: ToastrService) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns
      .filter((col) => col.key !== 'action')
      .every((col) => col.visible !== false);
  }

  get filteredRows(): FeedbackRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter((row) => {
      const hay = [row.id, row.tenant, row.comment, row.propertyUnit, row.phone]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalLabel(): string {
    return this.totalRecords.toLocaleString('en-US');
  }

  get pagedRows(): FeedbackRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  onExport(): void {
    this.toastr.info('Export is not connected yet.', 'Feedbacks');
  }

  toggleDrawer(show: boolean): void {
    this.showFilterDrawer = show;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
    this.openActionId = null;
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

  toggleActionMenu(id: string, event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = false;
    this.openActionId = this.openActionId === id ? null : id;
  }

  viewFeedback(row: FeedbackRow): void {
    this.openActionId = null;
    this.toastr.info(`Feedback #${row.id}`, row.tenant);
  }

  onSharedTablePageChange(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  responseClass(response: string | null): string {
    if (response === 'Happy') {
      return 'fb-response fb-response--happy';
    }
    if (response === 'Sad') {
      return 'fb-response fb-response--sad';
    }
    if (response === 'Flat') {
      return 'fb-response fb-response--flat';
    }
    return 'fb-response fb-response--none';
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionId = null;
  }
}
