import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  VENDOR_CONTRACT_STATUS_TABS,
  VendorContractRow,
  VendorContractStatus
} from '../vendor-contracts.data';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-vendor-contracts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './vendor-contracts-list.component.html',
  styleUrl: './vendor-contracts-list.component.scss'
})
export class VendorContractsListComponent implements OnInit {
  private router = inject(Router);
  private commontabservice = inject(Common_TabsService);
  private commonService = inject(CommonService);

  searchQuery = '';
  statusFilter: 'All' | VendorContractStatus = 'All';
  statusTabs = VENDOR_CONTRACT_STATUS_TABS;
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;

  filterVendor = '';
  filterProperty = '';
  filterStatus: VendorContractStatus | null = null;
  statusOptions: VendorContractStatus[] = ['Active', 'Draft', 'Completed', 'Offered'];

  pageIndex = 0;
  pageSize = 10;
  allRows: VendorContractRow[] = [];
  isLoading = false;
  totalRecordsCount = 0;
  totalPagesCount = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'vendor', label: 'Vendor', visible: true, useTemplate: true },
    { key: 'name', label: 'Name', visible: true, useTemplate: true },
    { key: 'properties', label: 'Properties', visible: true, useTemplate: true },
    { key: 'unitsRooms', label: 'Units / Rooms', visible: true, useTemplate: true },
    { key: 'startDate', label: 'Start Date', visible: true },
    { key: 'endDate', label: 'End Date', visible: true },
    { key: 'createDate', label: 'Create Date', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'value', label: 'Value', visible: true, useTemplate: true },
    { key: 'daysLeft', label: 'Days Left', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  ngOnInit(): void {
    this.loadContracts();
  }

  formatDateString(dateStr: string): string {
    if (!dateStr) return '-';
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

  calculateDaysLeft(endDateStr: string): string {
    if (!endDateStr) return '-';
    try {
      const end = new Date(endDateStr);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} days` : '0 days';
    } catch {
      return '-';
    }
  }

  formatProperties(item: any): string {
    const candidate = item.properties || item.property_name || item.property_names || item.property || item.property_codes || item.property_code || item.prop_name || item.building_name || item.building;
    if (candidate !== undefined && candidate !== null) {
      const str = String(candidate).trim();
      if (str !== '' && str !== 'null' && str !== 'undefined' && str !== '-') {
        return str;
      }
    }
    return '-';
  }

  formatUnitsRooms(item: any): string {
    const directVal = item.units_rooms || item.units_rooms_codes || item.units_no || item.units_rooms_count || item.unitsRooms || item.unit_room;
    if (directVal !== undefined && directVal !== null) {
      const directStr = String(directVal).trim();
      if (directStr !== '' && directStr !== 'null' && directStr !== 'undefined' && directStr !== '-') {
        return directStr;
      }
    }

    const uVal = item.units_codes || item.units || item.unit_code || item.units_name || item.unit_name || item.unit_no || '';
    const rVal = item.rooms_codes || item.rooms || item.room_code || item.rooms_name || item.room_name || item.room_no || '';

    const uStr = String(uVal).trim();
    const rStr = String(rVal).trim();

    const validUnits = (uStr && uStr !== 'null' && uStr !== 'undefined' && uStr !== '-') ? uStr : '';
    const validRooms = (rStr && rStr !== 'null' && rStr !== 'undefined' && rStr !== '-') ? rStr : '';

    if (validUnits && validRooms) {
      return `${validUnits} / ${validRooms}`;
    } else if (validUnits) {
      return validUnits;
    } else if (validRooms) {
      return validRooms;
    }

    const uCount = item.total_units ?? item.units_count ?? item.no_of_units;
    const rCount = item.total_rooms ?? item.rooms_count ?? item.no_of_rooms;
    if (uCount !== undefined || rCount !== undefined) {
      return `${uCount || 0} / ${rCount || 0}`;
    }

    return '-';
  }

  formatValue(item: any): string {
    const val = (item.value !== undefined && item.value !== null && item.value !== '') ? item.value : (item.contract_value || item.annual_rent || item.amount || item.val || item.fee_value);
    if (val !== undefined && val !== null && val !== '') {
      const num = Number(val);
      if (!isNaN(num) && num > 0) {
        return `AED ${num.toFixed(2)}`;
      }
      if (String(val).trim() !== '' && String(val).trim() !== '0') {
        return String(val);
      }
    }
    return '-';
  }

  loadContracts(): void {
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
      feature: "VENDOR_CONTRACTS",
      featureid: "VENDOR_CONTRACTS",
      search_columns: "P.name",
      filter_by: ""
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && (res.statusCode === "200" || res.statusCode == 200) && res.objResult) {
          const rawItems = res.objResult.vendor_contracts || res.objResult.contracts || res.objResult.table || [];
          if (rawItems.length > 0) {
            console.log('Vendor contract raw grid item from backend:', rawItems[0]);
          }
          this.allRows = rawItems.map((item: any) => ({
            id: String(item.code || item.id || ''),
            vendor: item.vendor_name || item.vendor || item.vendor_code || item.name || '-',
            name: item.name || item.contract_name || '-',
            properties: this.formatProperties(item),
            unitsRooms: this.formatUnitsRooms(item),
            startDate: this.formatDateString(item.start_date || item.startDate),
            endDate: this.formatDateString(item.end_date || item.endDate),
            createDate: this.formatDateString(item.create_date || item.created_date || item.created_at || item.createDate || item.start_date),
            status: (item.status || item.status_nm || 'Active') as VendorContractStatus,
            value: this.formatValue(item),
            daysLeft: item.days_left || item.daysLeft ? String(item.days_left || item.daysLeft) : this.calculateDaysLeft(item.end_date || item.endDate)
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
        console.error("Error loading vendor contracts:", err);
        this.allRows = [];
        this.totalRecordsCount = 0;
        this.totalPagesCount = 0;
      }
    });
  }

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((c) => c.visible !== false);
  }

  get filteredRows(): VendorContractRow[] {
    return this.allRows;
  }

  get totalRecords(): number {
    return this.totalRecordsCount;
  }

  get totalPages(): number {
    return Math.max(1, this.totalPagesCount || 1);
  }

  get paginatedRows(): VendorContractRow[] {
    return this.allRows;
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    if (!this.totalRecords) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
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

  setStatusFilter(status: 'All' | VendorContractStatus): void {
    this.statusFilter = status;
    this.pageIndex = 0;
    this.loadContracts();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadContracts();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadContracts();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterVendor = '';
    this.filterProperty = '';
    this.filterStatus = null;
    this.statusFilter = 'All';
    this.pageIndex = 0;
    this.loadContracts();
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((c) => (c.visible = checked));
  }

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.openActionId = this.openActionId === id ? null : id;
  }

  goToCreate(): void {
    this.router.navigate(['/vendor-contracts/create']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/vendor-contracts/create'], { queryParams: { code: id } });
  }

  goToDetail(id: string): void {
    this.router.navigate(['/vendor-contracts', id]);
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
    this.loadContracts();
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadContracts();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex++;
      this.loadContracts();
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages && target !== this.pageIndex) {
      this.pageIndex = target;
      this.loadContracts();
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionId = null;
  }
}
