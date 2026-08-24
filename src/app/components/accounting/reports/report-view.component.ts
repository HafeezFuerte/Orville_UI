import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlowbiteDatepickerDirective } from '../../../shared/directives/flowbite-datepicker.directive';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  LedgerGroup,
  REPORT_VIEWS,
  ReportSection,
  ReportTypePill,
  ReportViewModel,
  TrialBalanceRow
} from './report-view.data';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, FlowbiteDatepickerDirective, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.scss'
})
export class ReportViewComponent implements OnInit {
  report: ReportViewModel | null = null;
  fromDate = '';
  toDate = '';
  periodLabel = '';
  tableQuery = '';
  year = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterAccount = '';
  filterType: ReportTypePill | null = null;
  typeOptions: ReportTypePill[] = ['Asset', 'Equity', 'Expense', 'Liability', 'Income'];
  pageIndex = 0;
  pageSize = 5;
  tableColumns = [
    { key: 'account', label: 'Account name', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'debit', label: 'Debit', visible: true },
    { key: 'credit', label: 'Credit', visible: true },
    { key: 'balance', label: 'Balance', visible: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    const view = REPORT_VIEWS[id];
    if (!view) {
      void this.router.navigate(['/accounting/reports']);
      return;
    }
    this.report = {
      ...view,
      sections: view.sections.map((section) => ({ ...section, groups: section.groups.map((g) => ({ ...g })) })),
      tableRows: view.tableRows ? [...view.tableRows] : undefined,
      simpleRows: view.simpleRows ? [...view.simpleRows] : undefined,
      ledgerGroups: view.ledgerGroups?.map((group) => ({ ...group, rows: [...group.rows] })),
      journalBlocks: view.journalBlocks?.map((block) => ({ ...block, lines: [...block.lines] })),
      annualSections: view.annualSections?.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({ ...row, months: [...row.months] })),
        totals: [...section.totals]
      }))
    };
    this.fromDate = view.fromDate;
    this.toDate = view.toDate;
    this.periodLabel = view.period;
    this.year = view.year || '';
  }

  get layout(): string {
    return this.report?.layout || 'statement';
  }

  get visibleTableColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredTableRows(): TrialBalanceRow[] {
    const rows = this.report?.tableRows || [];
    const q = this.tableQuery.trim().toLowerCase();
    return rows.filter((row) => {
      if (this.filterType && row.type !== this.filterType) {
        return false;
      }
      if (this.filterAccount && !row.account.toLowerCase().includes(this.filterAccount.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return row.account.toLowerCase().includes(q) || row.type.toLowerCase().includes(q);
    });
  }

  get totalRecords(): number {
    return this.filteredTableRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): TrialBalanceRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredTableRows.slice(start, start + this.pageSize);
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

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  goBack(): void {
    void this.router.navigate(['/accounting/reports']);
  }

  applyFilter(): void {
    this.periodLabel = this.fromDate || this.toDate
      ? `${this.fromDate || '—'} - ${this.toDate || '—'}`
      : this.report?.period || '';
  }

  clearFilter(): void {
    if (!this.report) {
      return;
    }
    this.fromDate = this.report.fromDate;
    this.toDate = this.report.toDate;
    this.periodLabel = this.report.period;
  }

  toggleSection(section: ReportSection): void {
    if (section.collapsible) {
      section.open = !section.open;
    }
  }

  toggleLedgerGroup(group: LedgerGroup): void {
    group.open = !group.open;
  }

  typeClass(type: ReportTypePill): string {
    if (type === 'Asset') {
      return 'coa-pill coa-pill--navy';
    }
    if (type === 'Liability') {
      return 'coa-pill coa-pill--danger';
    }
    return 'coa-pill coa-pill--muted';
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyTableFilters(): void {
    this.pageIndex = 0;
  }

  clearTableFilters(): void {
    this.tableQuery = '';
    this.filterAccount = '';
    this.filterType = null;
    this.pageIndex = 0;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => (col.visible = checked));
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex++;
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages) {
      this.pageIndex = target;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
