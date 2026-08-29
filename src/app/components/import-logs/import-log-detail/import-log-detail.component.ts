import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import {
  ImportDetailLine,
  ImportLogRow,
  ImportProcessStatus,
  getImportDetailLines,
  getImportLog,
} from '../import-logs.data';

@Component({
  selector: 'app-import-log-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent],
  templateUrl: './import-log-detail.component.html',
  styleUrls: ['./import-log-detail.component.scss'],
})
export class ImportLogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  detail: ImportLogRow = getImportLog('68');
  lines: ImportDetailLine[] = [];
  searchQuery = '';
  pageNo = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100, 200];

  tableColumns = [
    { key: 'srNo', label: 'Sr. No.', visible: true, width: '90px' },
    { key: 'excelRowId', label: 'Excel Row Id', visible: true, width: '130px' },
    { key: 'info', label: 'Info', visible: true, useTemplate: true },
    { key: 'recordId', label: 'Record Id', visible: true, width: '120px', useTemplate: true },
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredLines(): ImportDetailLine[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.lines;
    }
    return this.lines.filter((row) =>
      [
        String(row.srNo),
        String(row.excelRowId),
        row.infoType,
        row.infoValue,
        row.recordId,
      ].some((v) => v.toLowerCase().includes(q))
    );
  }

  get totalRecords(): number {
    return this.filteredLines.length;
  }

  get pagedLines(): ImportDetailLine[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredLines.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') || '68';
      this.detail = getImportLog(id);
      this.lines = getImportDetailLines(id);
      this.pageNo = 0;
      this.searchQuery = '';
    });
  }

  goBack(): void {
    void this.router.navigate(['/imports']);
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  statusClass(status: ImportProcessStatus): string {
    switch (status) {
      case 'Fully Imported':
        return 'ild-status ild-status--success';
      case 'Partial':
        return 'ild-status ild-status--warning';
      case 'Failed':
        return 'ild-status ild-status--danger';
      case 'Processing':
        return 'ild-status ild-status--info';
      default:
        return 'ild-status';
    }
  }

  infoTone(type: ImportDetailLine['infoType']): string {
    switch (type) {
      case 'Property':
        return 'property';
      case 'Landlord':
        return 'landlord';
      case 'Unit':
        return 'unit';
      case 'Tenant':
        return 'tenant';
      case 'Vendor':
        return 'vendor';
      default:
        return 'other';
    }
  }

  onSharedTablePageChange(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
