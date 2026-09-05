import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { SpaceAvailability, SpaceRow } from '../spaces.data';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    NgSelectModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './spaces.component.html'
})
export class SpacesComponent implements OnInit {
  constructor(
    private router: Router,
    private commontabservice: Common_TabsService,
    private commonService: CommonService
  ) {}

  searchQuery = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterName = '';
  filterAvailability: SpaceAvailability | null = null;
  availabilityOptions: SpaceAvailability[] = ['Weekdays', 'Weekends', 'Always', 'Closed', 'Custom Days'];
  pageIndex = 0;
  pageSize = 10;
  allRows: SpaceRow[] = [];
  isLoading = false;
  totalRecordsCount = 0;
  totalPagesCount = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '90px', headerClass: 'text-start' },
    { key: 'name', label: 'Space Name', visible: true, useTemplate: true, width: '190px', headerClass: 'text-start' },
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

  ngOnInit(): void {
    this.loadSpaces();
  }

  formatDateString(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return dateStr;
    }
  }

  loadSpaces(): void {
    this.isLoading = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      clientID: currentUser?.clientId || "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: this.pageIndex,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      feature: "SPACES",
      featureid: "SPACES",
      search_columns: "P.space_name",
      filter_by: ""
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.statusCode === "200" && res.objResult) {
          const rawItems = res.objResult.spaces || res.objResult.table || [];
          this.allRows = rawItems.map((item: any) => ({
            id: String(item.code || item.id || ''),
            name: item.space_name || item.name || '',
            location: item.space_location || item.location || '',
            availability: (item.availability || 'Always') as SpaceAvailability,
            slotDuration: item.slots_duration_nm || item.slot_duration || item.slotDuration || '',
            dateRange: (item.start_date && item.end_date)
              ? `${this.formatDateString(item.start_date)} - ${this.formatDateString(item.end_date)}`
              : (item.date_range || item.dateRange || ''),
            enablePayment: (item.enabled_payment === true || item.enable_payment === true || item.enablePayment === 'Yes' || item.enablePayment === 'Enabled' || item.enablePayment === true) ? 'Enabled' : 'Disabled',
            phone: item.phone_no || item.phone_number || item.phone || '',
            email: item.email_address || item.email || '',
            property: item.property_name || item.property || '',
            unit: item.unit_no || item.unit_name || item.unit || '',
            createdAt: item.created_at || item.createdAt || ''
          }));

          if (res.objResult.rows_info && res.objResult.rows_info[0]) {
            this.totalRecordsCount = res.objResult.rows_info[0].totalrecords;
            this.totalPagesCount = res.objResult.rows_info[0].noofpages;
          } else {
            this.totalRecordsCount = this.allRows.length;
            this.totalPagesCount = Math.max(1, Math.ceil(this.totalRecordsCount / this.pageSize));
          }
        } else {
          this.allRows = [];
          this.totalRecordsCount = 0;
          this.totalPagesCount = 0;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("Error loading spaces:", err);
        this.allRows = [];
        this.totalRecordsCount = 0;
        this.totalPagesCount = 0;
      }
    });
  }

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): SpaceRow[] {
    return this.allRows;
  }

  get totalRecords(): number {
    return this.totalRecordsCount;
  }

  get totalPages(): number {
    return Math.max(1, this.totalPagesCount || 1);
  }

  get paginatedRows(): SpaceRow[] {
    return this.allRows;
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
    void this.router.navigate(['/bookings/spaces/create']);
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadSpaces();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadSpaces();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterAvailability = null;
    this.pageIndex = 0;
    this.loadSpaces();
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
    this.loadSpaces();
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadSpaces();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex++;
      this.loadSpaces();
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages && target !== this.pageIndex) {
      this.pageIndex = target;
      this.loadSpaces();
    }
  }

  openActionId: string | null = null;

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.openActionId = this.openActionId === id ? null : id;
  }

  goToDetail(id: string): void {
    this.openActionId = null;
    void this.router.navigate(['/bookings/spaces', id]);
  }

  goToEdit(id: string): void {
    this.openActionId = null;
    void this.router.navigate(['/bookings/spaces/create'], { queryParams: { code: id } });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionId = null;
  }
}
