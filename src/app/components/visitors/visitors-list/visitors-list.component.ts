import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import { VISITOR_ROWS, VisitorRow } from '../visitors.data';

@Component({
  selector: 'app-visitors-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent, TranslateModule, OvPaginatorComponent],
  templateUrl: './visitors-list.component.html',
  styleUrl: './visitors-list.component.scss'
})
export class VisitorsListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchQuery = '';
  showColumnDropdown = false;
  pageIndex = 0;
  pageSize = 10;
  allRows = VISITOR_ROWS;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;
  view: 'all' | 'check-in' | 'check-out' = 'all';

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.view = data['visitorView'] ?? 'all';
      this.pageIndex = 0;
    });
  }

  get pageTitleKey(): string {
    if (this.view === 'check-in') {
      return 'web.visitors.titleCheckIn';
    }
    if (this.view === 'check-out') {
      return 'web.visitors.titleCheckOut';
    }
    return 'web.visitors.title';
  }

  get pageSubtitleKey(): string {
    if (this.view === 'check-in') {
      return 'web.visitors.subCheckIn';
    }
    if (this.view === 'check-out') {
      return 'web.visitors.subCheckOut';
    }
    return 'web.visitors.sub';
  }

  tableColumns = [
    { key: 'id', label: 'web.visitors.colId', visible: true, useTemplate: true, width: '70px' },
    { key: 'visitorName', label: 'web.visitors.colVisitorName', visible: true, useTemplate: true, width: '150px' },
    { key: 'email', label: 'web.visitors.colEmail', visible: true, width: '180px' },
    { key: 'phoneNumber', label: 'web.visitors.colPhoneNumber', visible: true, width: '130px' },
    { key: 'visitingDate', label: 'web.visitors.colVisitingDate', visible: true, width: '110px' },
    { key: 'visitType', label: 'web.visitors.colVisitType', visible: true, useTemplate: true, width: '100px' },
    { key: 'status', label: 'web.visitors.colStatus', visible: true, useTemplate: true, width: '130px' },
    { key: 'passCode', label: 'web.visitors.colPassCode', visible: true, width: '100px' },
    { key: 'numberOfVisitors', label: 'web.visitors.colNumberOfVisitors', visible: true, width: '110px' },
    { key: 'property', label: 'web.visitors.colProperty', visible: true, width: '160px' },
    { key: 'unit', label: 'web.visitors.colUnit', visible: true, width: '130px' },
    { key: 'contact', label: 'web.visitors.colContact', visible: true, useTemplate: true, width: '160px' },
    { key: 'created', label: 'web.visitors.colCreated', visible: true, width: '150px' },
    { key: 'action', label: 'web.visitors.colAction', visible: true, useTemplate: true, width: '70px' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((c) => c.visible !== false);
  }

  get filteredRows(): VisitorRow[] {
    let rows = [...this.allRows];
    if (this.view === 'check-in') {
      rows = rows.filter((r) => r.status === 'Not Checked-in');
    } else if (this.view === 'check-out') {
      rows = rows.filter((r) => r.status === 'Checked-in');
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.visitorName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phoneNumber.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q) ||
          r.contact.toLowerCase().includes(q)
      );
    }
    return rows;
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageIndex * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalRecords);
  }

  get paginatedRows(): VisitorRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex += 1;
    }
  }

  goPage(page: number): void {
    this.pageIndex = Math.max(0, Math.min(page - 1, this.totalPages - 1));
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(visible: boolean): void {
    this.tableColumns.forEach((c) => {
      if (c.key !== 'action') {
        c.visible = visible;
      }
    });
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  navigateToCreate(): void {
    this.router.navigate(['/visitors/create']);
  }

  toggleRowAction(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openRowActionId === id) {
      this.closeRowAction();
      return;
    }
    this.openRowActionId = id;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.rowMenuStyle = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${Math.max(8, rect.right - 140)}px`,
      zIndex: '1000'
    };
  }

  closeRowAction(): void {
    this.openRowActionId = null;
    this.rowMenuStyle = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.closeRowAction();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showColumnDropdown = false;
    this.closeRowAction();
  }
}
