import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import {
  INVOICE_KPIS, 
  INVOICE_STATUS_TABS,
  InvoiceRow,
  InvoiceStatus
} from './invoices.data';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent {
  constructor(private router: Router,
    private commonService: CommonService,
    private commontabservice : Common_TabsService,
    private toastr:ToastrService) {}
    isLoading:boolean=false;
  searchQuery = '';
  statusFilter:any= 'All';
  statusTabs:any[]=[];
  kpis:any[] =[];// INVOICE_KPIS;
  currentUser: AuthPayload | null = this.commonService.getCurrentUser();
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  filterTo = '';
  filterAccount = '';
  filterStatus: InvoiceStatus | null = null;
  statusOptions: InvoiceStatus[] = INVOICE_STATUS_TABS.filter((tab): tab is InvoiceStatus => tab !== 'All');
  metrics = {
    revenue: 'AED 4.3 M',
    totalLeases: 24183,
    activeLeases: 18420,
    draftLeases: 3240,
    expiringLeases: 420
  };
  pageIndex = 0; 
  allRows:any= [];

  tableColumns = [
    { key: 'code', label: 'ID', visible: true, useTemplate: true },
    { key: 'invoice_status', label: 'Status', visible: true, useTemplate: true },
    { key: 'Tenant', label: 'To', visible: true, useTemplate: true },
    { key: 'unit_code', label: 'Unit / Common Area', visible: true , useTemplate: true},
    { key: 'invoice_no', label: 'Invoice Number', visible: true, useTemplate: true }, 
    { key: 'invoice_date', label: 'Invoice Date', visible: true },
    { key: 'invoice_type', label: 'Invoice Type', visible: true },
    { key: 'account_name', label: 'Account', visible: true },
    { key: 'currency_symbol', label: 'Currency', visible: true, useTemplate: true },
    { key: 'property_name', label: 'Property Name', visible: true, useTemplate: true },
    { key: 'property_code', label: 'Property ID', visible: true },
    { key: 'lease_id', label: 'Lease ID', visible: true, useTemplate: true },
    { key: 'lease_status', label: 'Lease Status', visible: true, useTemplate: true }, 
    { key: 'total_amount', label: 'Amount', visible: true },
    { key: 'total_amount', label: 'Gross Amount', visible: true },
    { key: 'paid_amount', label: 'Paid', visible: true },
    { key: 'payment_type_name', label: 'Payment Via', visible: true },   
    { key: 'createdby', label: 'Created By', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    if(event.pageIndex>this.pageNo){
      this.pageNo = this.pageNo + 1;
      }
      else{
        this.pageNo = this.pageNo - 1;
      }
      if(this.pageNo<0)
      this.pageNo=0;
      this.pageSize = event.pageSize; 
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize; 
    this.loadinvoices();
  }
  loadinvoices() {
    const filterList: any[] = [];
    if (this.statusFilter && this.statusFilter !== "All") {
      filterList.push({ 'key': 'P.status', 'value': this.statusFilter });
    } 
 

    const payload = {
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
      source: "web",
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || "",
      pagecount: this.pageSize,
      filter_by: this.statusFilter !== 'All' ? 'status' : '',
      filter_list: JSON.stringify(filterList),
      featureid: "INVOICES"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.invoices || []; 
          if (response.objResult.rows_info) {
            this.totalRecords = response.objResult.rows_info[0].totalrecords; 
            this.totalPages = response.objResult.rows_info[0].noofpages;
          }
        } else {
          this.allRows = []; 
          this.totalRecords = 0;
          this.totalPages = 0;
          this.toastr.error("No record[s] found");
        }
      },
      error: (err: any) => {
        console.error('Error loading leases:', err);
        this.allRows = []; 
        this.totalRecords = 0;
        this.totalPages = 0;
      }
    });
  }
  get filteredRows(): InvoiceRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row:any) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterTo && !row.to.toLowerCase().includes(this.filterTo.toLowerCase())) {
        return false;
      }
      if (this.filterAccount && !row.account.toLowerCase().includes(this.filterAccount.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.includes(q) ||
        row.to.toLowerCase().includes(q) ||
        row.invoiceNumber.toLowerCase().includes(q) ||
        row.unitCommonArea.toLowerCase().includes(q) ||
        row.account.toLowerCase().includes(q)
      );
    });
  }

  // get totalRecords(): number {
  //   return this.filteredRows.length;
  // }

  // get totalPages(): number {
  //   return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  // }

  get paginatedRows(): InvoiceRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
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

  setStatusFilter(status: string ): void {
    this.statusFilter = status;
    this.pageIndex = 0;
    this.loadinvoices();
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterTo = '';
    this.filterAccount = '';
    this.filterStatus = null;
    this.statusFilter = 'All';
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

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.openActionId = this.openActionId === id ? null : id;
  }

  viewInvoice(id: string): void {
    this.openActionId = null;
    void this.router.navigate(['/accounting/invoices', id]);
  }

  statusClass(status: InvoiceStatus): string {
    const map: Record<string, string> = {
      Paid: 'inv-badge inv-badge--paid',
      Unpaid: 'inv-badge inv-badge--rejected',
      Overdue: 'inv-badge inv-badge--rejected',
      Draft: 'inv-badge inv-badge--draft',
      Hold: 'inv-badge inv-badge--pending',
      Void: 'inv-badge inv-badge--draft',
      'Write Off': 'inv-badge inv-badge--draft',
      Bounced: 'inv-badge inv-badge--rejected',
      'Pending Approvals': 'inv-badge inv-badge--pending'
    };
    return map[status] || 'inv-badge inv-badge--draft';
  }
  loadMetrics() { 
    this.commontabservice.getMasterByType({
      typeId: 43,
      filterid:0,
       filterText: '',
      filterText1: '' 
    }).subscribe({
      next: res => {
        if(res['statusCode'] == 200){
        let data = res.objResult.table[0]; 
        if (data) {
          this.metrics = {
            totalLeases: data.total_leases !== undefined ? data.total_leases : this.metrics.totalLeases,
            revenue: data.revene !== undefined ? this.currentUser?.currencyCode + ' ' + this.transform(data.revene) : this.metrics.revenue,
            activeLeases: data.active_leases !== undefined ? data.active_leases : this.metrics.activeLeases,
            draftLeases: data.draft !== undefined ? data.draft : this.metrics.draftLeases,
            expiringLeases: data.expiring_leases !== undefined ? data.expiring_leases : this.metrics.expiringLeases
          };
        }
      }
      },
      error: console.error
    });
 
  }
  
  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadinvoices();
    }
  }
  onPageSizeChange(): void {
    this.pageNo = 0;
    this.loadinvoices();
  }
  nextPage(): void {
    if (this.displayPage < (this.totalPages || 1)) {
      this.pageNo++;
      this.loadinvoices();
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < (this.totalPages || 1) && target !== this.pageNo) {
      this.pageNo = target;
      this.loadinvoices();
    }
  }
  transform(value: number, decimals: number = 2): string {
    if (value === null || isNaN(value)) return value.toString();
    if (value < 1000) return value.toString();

    // Suffixes mapped by their mathematical tier (powers of 1000)
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.floor(Math.log10(Math.abs(value)) / 3);

    // If the tier exceeds our array, default to the highest available suffix
    const selectedTier = Math.min(tier, suffixes.length - 1);
    
    const suffix = suffixes[selectedTier];
    const scale = Math.pow(10, selectedTier * 3);
    const scaled = value / scale;

    // Formats numbers cleanly (e.g., removes redundant .00 trailing zeros)
    return scaled.toFixed(decimals).replace(/\.00$/, '') + suffix;
  }
  ngOnInit() {
    
    this.loadinvoices(); 
    this.loadLookup(54, 'tabs', 'lookup_name');
  }
  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.commontabservice.getMasterByType({
      typeId: 54,
      filterId: filterId,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.statusTabs.push({"id":"All","name":"All"}); 
          this.statusTabs.push(...res.objResult.table1); 
          this.kpis=res.objResult.table;
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  // onPageSizeChange(): void {
  //   this.pageIndex = 0;
  // }

  // previousPage(): void {
  //   if (this.pageIndex > 0) {
  //     this.pageIndex--;
  //   }
  // }

  // nextPage(): void {
  //   if (this.displayPage < this.totalPages) {
  //     this.pageIndex++;
  //   }
  // }

  // goToPage(page: number): void {
  //   const target = page - 1;
  //   if (target >= 0 && target < this.totalPages) {
  //     this.pageIndex = target;
  //   }
  // }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionId = null;
  }
}
