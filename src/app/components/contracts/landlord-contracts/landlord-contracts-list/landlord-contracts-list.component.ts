import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  LANDLORD_CONTRACT_STATUS_TABS,
  LandlordContractRow,
  LandlordContractStatus
} from '../landlord-contracts.data';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-landlord-contracts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './landlord-contracts-list.component.html',
  styleUrl: './landlord-contracts-list.component.scss'
})
export class LandlordContractsListComponent implements OnInit {
  private router = inject(Router);
  private commontabservice = inject(Common_TabsService);
  private commonService = inject(CommonService);

  searchQuery = '';
  statusFilter: 'All' | LandlordContractStatus = 'All';
  statusTabs = LANDLORD_CONTRACT_STATUS_TABS;
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;

  filterLandlord = '';
  filterProperty = '';
  filterStatus: LandlordContractStatus | null = null;
  statusOptions: LandlordContractStatus[] = ['Active', 'Draft', 'Completed', 'Offered'];

  pageNo = 0;
  pageSize = 10;
  allRows: LandlordContractRow[] = [];
  isLoading = false;
  totalRecordsCount = 0;
  totalPagesCount = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'landlord', label: 'Landlord', visible: true, useTemplate: true },
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
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      feature: "LANDLORD_CONTRACTS",
      featureid: "LANDLORD_CONTRACTS",
      search_columns: "P.name",
      filter_by: ""
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.statusCode === "200" && res.objResult) {
          const rawItems = res.objResult.landlord_contracts || res.objResult.contracts || res.objResult.table || [];
          if (rawItems.length > 0) {
            console.log('Landlord contract raw grid item from backend:', rawItems[0]);
          }
          this.allRows = rawItems.map((item: any) => ({
            id: String(item.code || item.id || ''),
            landlord: item.landlord_name || item.landlord || item.name || '-',
            name: item.name || item.contract_name || '-',
            properties: item.properties || item.property_name || item.property || item.property_codes || item.property_code || '-',
            unitsRooms: item.units_rooms || item.units_no || item.units || item.rooms || item.units_codes || item.rooms_codes || item.unit_code || '-',
            startDate: this.formatDateString(item.start_date || item.startDate),
            endDate: this.formatDateString(item.end_date || item.endDate),
            createDate: this.formatDateString(item.create_date || item.created_date || item.created_at || item.createDate || item.start_date),
            status: (item.status || item.status_nm || 'Active') as LandlordContractStatus,
            value: (item.value !== undefined && item.value !== null && item.value !== '') ? String(item.value) : (item.contract_value ? String(item.contract_value) : '-'),
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
        console.error("Error loading landlord contracts:", err);
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

  get filteredRows(): LandlordContractRow[] {
    return this.allRows;
  }

  get totalRecords(): number {
    return this.totalRecordsCount;
  }

  get totalPages(): number {
    return Math.max(1, this.totalPagesCount || 1);
  }

  get paginatedRows(): LandlordContractRow[] {
    return this.allRows;
  }

  get displayPage(): number {
    return this.pageNo + 1;
  }

  get startRecord(): number {
    if (!this.totalRecords) {
      return 0;
    }
    return this.pageNo * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalRecords);
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  setStatusFilter(status: 'All' | LandlordContractStatus): void {
    this.statusFilter = status;
    this.pageNo = 0;
    this.loadContracts();
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadContracts();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterLandlord = '';
    this.filterProperty = '';
    this.filterStatus = null;
    this.statusFilter = 'All';
    this.pageNo = 0;
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
    this.router.navigate(['/landlord-contracts/create']);
  }

  goToDetail(id: string): void {
    this.router.navigate(['/landlord-contracts', id]);
  }

  onPageSizeChange(): void {
    this.pageNo = 0;
    this.loadContracts();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadContracts();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadContracts();
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages && target !== this.pageNo) {
      this.pageNo = target;
      this.loadContracts();
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionId = null;
  }
}
