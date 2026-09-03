import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { GUIDE_ROWS, GuideRow } from '../rules-guides.data';

@Component({
  selector: 'app-rules-guides',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './rules-guides.component.html',
  styleUrl: './rules-guides.component.scss'
})
export class RulesGuidesComponent {
  searchQuery = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterName = '';
  filterProperty = '';
  pageIndex = 0;
  pageSize = 10;
  allRows = GUIDE_ROWS;
  openRowActionId: string | null = null;
  openRowActionRow: GuideRow | null = null;
  rowMenuStyle: { top: string; left: string } | null = null;

  tableColumns = [
    {
      key: 'id',
      label: 'ID',
      visible: true,
      useTemplate: true,
      width: '110px',
      headerClass: 'text-start sticky left-0 z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-0 z-[1] bg-white dark:bg-bodybg'
    },
    {
      key: 'name',
      label: 'Guide Name',
      visible: true,
      useTemplate: true,
      width: '260px'
    },
    { key: 'property', label: 'Property', visible: true, width: '240px' },
    { key: 'date', label: 'Date', visible: true, width: '140px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '80px' }
  ];

  constructor(private router: Router) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): GuideRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.filterName && !row.name.toLowerCase().includes(this.filterName.toLowerCase())) {
        return false;
      }
      if (this.filterProperty && !row.property.toLowerCase().includes(this.filterProperty.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [row.id, row.name, row.property, row.date].some((value) =>
        String(value).toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
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

  get paginatedRows(): GuideRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    const current = this.displayPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const items: (number | string)[] = [1];
    if (current > 3) {
      items.push('...');
    }
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      items.push(p);
    }
    if (current < total - 2) {
      items.push('...');
    }
    items.push(total);
    return items;
  }

  goToAdd(): void {
    void this.router.navigate(['/community/rules-guides/new']);
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterProperty = '';
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

  toggleRowAction(row: GuideRow, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showColumnDropdown = false;

    if (this.openRowActionId === row.id) {
      this.closeRowMenu();
      return;
    }

    const target = event.currentTarget as HTMLElement | null;
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const menuWidth = 168;
    const menuHeight = 130;
    const gap = 4;
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8));
    let top = rect.bottom + gap;
    if (top + menuHeight > window.innerHeight) {
      top = Math.max(8, rect.top - gap - menuHeight);
    }

    this.rowMenuStyle = {
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`
    };
    this.openRowActionId = row.id;
    this.openRowActionRow = row;
  }

  onRowView(row: GuideRow | null): void {
    if (!row) return;
    this.closeRowMenu();
    void this.router.navigate(['/community/rules-guides', row.id]);
  }

  onRowEdit(): void {
    this.closeRowMenu();
    void this.router.navigate(['/community/rules-guides/new']);
  }

  onRowDelete(): void {
    this.closeRowMenu();
  }

  closeRowMenu(): void {
    this.openRowActionId = null;
    this.openRowActionRow = null;
    this.rowMenuStyle = null;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.closeRowMenu();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.closeRowMenu();
  }
}
