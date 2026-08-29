import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { IMPORT_LOG_ROWS, ImportLogRow, ImportProcessStatus } from '../import-logs.data';

@Component({
  selector: 'app-import-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent],
  templateUrl: './import-logs.component.html',
  styleUrls: ['./import-logs.component.scss'],
})
export class ImportLogsComponent {
  private router = inject(Router);
  private toastr = inject(ToastrService);

  showActions = false;
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  actionImports = [
    'Import Rentals',
    'Import Tenants',
    'Import Assets',
    'Import PPMs',
    'Import Leads',
    'Import Units',
    'Import Properties',
    'Import Landlords',
    'Import Leases',
    'Import Users',
    'Import Contacts',
    'Import Deals',
  ];

  private rows: ImportLogRow[] = [...IMPORT_LOG_ROWS];

  tableColumns = [
    { key: 'importedAt', label: 'Imported At', visible: true, useTemplate: true },
    { key: 'importType', label: 'Import Type', visible: true },
    { key: 'totalRecords', label: 'Total Records', visible: true },
    { key: 'jobId', label: 'Job Id', visible: true, useTemplate: true },
    { key: 'file', label: 'File', visible: true, useTemplate: true },
    { key: 'status', label: 'Process Status', visible: true, useTemplate: true },
    { key: 'actions', label: 'Actions', visible: true, useTemplate: true, width: '100px' },
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get totalRecords(): number {
    return this.rows.length;
  }

  get pagedRows(): ImportLogRow[] {
    const start = this.pageNo * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  toggleActions(event: Event): void {
    event.stopPropagation();
    this.showActions = !this.showActions;
  }

  onImportAction(label: string): void {
    this.showActions = false;
    this.toastr.info(`${label} is presentation only.`, 'Import Logs');
  }

  retryImport(row: ImportLogRow): void {
    this.toastr.success(`Retry started for ${row.file}`, 'Import Logs');
  }

  viewImport(row: ImportLogRow): void {
    void this.router.navigate(['/imports', row.id]);
  }

  openFile(row: ImportLogRow, event: Event): void {
    event.preventDefault();
    this.toastr.info(`Open file: ${row.file}`, 'Import Logs');
  }

  statusClass(status: ImportProcessStatus): string {
    switch (status) {
      case 'Fully Imported':
        return 'il-status il-status--success';
      case 'Partial':
        return 'il-status il-status--warning';
      case 'Failed':
        return 'il-status il-status--danger';
      case 'Processing':
        return 'il-status il-status--info';
      default:
        return 'il-status';
    }
  }

  onSharedTablePageChange(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActions = false;
  }
}
