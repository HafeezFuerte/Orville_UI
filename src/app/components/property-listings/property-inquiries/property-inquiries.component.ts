import { Component, HostListener } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  PROPERTY_INQUIRY_ROWS,
  PropertyInquiryRow,
  PropertyInquiryType
} from '../property-listings.data';

@Component({
  selector: 'app-property-inquiries',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './property-inquiries.component.html',
  styleUrl: './property-inquiries.component.scss'
})
export class PropertyInquiriesComponent {
  isDrawerOpen = false;
  showColumnDropdown = false;
  pageIndex = 0;
  pageSize = 10;
  allRows: PropertyInquiryRow[] = PROPERTY_INQUIRY_ROWS;

  filterInquiryType: '' | PropertyInquiryType = '';
  filterUnit = '';

  tableColumns = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'fullName', label: 'Full Name', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'phone', label: 'Phone', visible: true },
    { key: 'inquiryType', label: 'Inquiry Type', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'message', label: 'Message', visible: true, useTemplate: true },
    { key: 'submittedAt', label: 'Submitted At', visible: true }
  ];

  constructor(
    private readonly location: Location,
    private readonly router: Router
  ) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): PropertyInquiryRow[] {
    return this.allRows.filter((row) => {
      if (this.filterInquiryType && row.inquiryType !== this.filterInquiryType) {
        return false;
      }
      if (this.filterUnit && !row.unit.toLowerCase().includes(this.filterUnit.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get paginatedRows(): PropertyInquiryRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    void this.router.navigate(['/property-listings']);
  }

  toggleColumnDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  @HostListener('document:click')
  closeColumnDropdown(): void {
    this.showColumnDropdown = false;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col) {
      col.visible = col.visible === false;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => {
      col.visible = checked;
    });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.filterInquiryType = '';
    this.filterUnit = '';
    this.pageIndex = 0;
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  inquiryTypeClass(type: PropertyInquiryType): string {
    switch (type) {
      case 'For Rent':
        return 'ov-status ov-status--soft';
      case 'For Sale':
        return 'ov-status ov-status--info';
      case 'Viewing':
        return 'ov-status ov-status--warning';
      default:
        return 'ov-status ov-status--muted';
    }
  }
}
