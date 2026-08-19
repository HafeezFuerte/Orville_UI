import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { SPACE_ROWS, SpaceAvailability, SpaceRow } from '../spaces.data';

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './spaces.component.html'
})
export class SpacesComponent {
  searchQuery = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterName = '';
  filterAvailability: SpaceAvailability | null = null;
  availabilityOptions: SpaceAvailability[] = ['Weekdays', 'Weekends', 'Always', 'Closed', 'Custom Days'];
  pageIndex = 0;
  pageSize = 10;
  allRows = SPACE_ROWS;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '90px', headerClass: 'text-start sticky left-0 z-[2] bg-white dark:bg-bodybg', cellClass: 'sticky left-0 z-[1] bg-white dark:bg-bodybg' },
    { key: 'name', label: 'Space Name', visible: true, useTemplate: true, width: '190px', headerClass: 'text-start sticky left-[90px] z-[2] bg-white dark:bg-bodybg', cellClass: 'sticky left-[90px] z-[1] bg-white dark:bg-bodybg' },
    { key: 'location', label: 'Space Location', visible: true, useTemplate: true, width: '220px' },
    { key: 'availability', label: 'Availability Option', visible: true, useTemplate: true },
    { key: 'slotDuration', label: 'Slot Duration', visible: true },
    { key: 'dateRange', label: 'Date Range', visible: true, useTemplate: true },
    { key: 'enablePayment', label: 'Enable Payment', visible: true, useTemplate: true },
    { key: 'phone', label: 'Phone Number', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'createdAt', label: 'Create At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  constructor(private router: Router) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): SpaceRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.filterName && !row.name.toLowerCase().includes(this.filterName.toLowerCase())) {
        return false;
      }
      if (this.filterAvailability && row.availability !== this.filterAvailability) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [row.id, row.name, row.location, row.property, row.unit, row.email].some((value) =>
        value.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): SpaceRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
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

  goToAdd(): void {
    void this.router.navigate(['/bookings/spaces/new']);
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterAvailability = null;
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
