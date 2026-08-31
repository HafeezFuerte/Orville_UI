import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { AuthPayload } from '../../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import {
  EXPENSE_KPIS,
  EXPENSE_ROWS,
  EXPENSE_STATUS_TABS,
  ExpenseRow,
  ExpenseStatus
} from '../expenses.data';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {
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
  filterAccount = '';filterName = '';
  filterStatus: ExpenseStatus | null = null;
  statusOptions: ExpenseStatus[] = EXPENSE_STATUS_TABS.filter((tab): tab is ExpenseStatus => tab !== 'All');
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
    { key: 'invoice_no', label: 'Bill Number', visible: true },
    { key: 'unit_code', label: 'Unit / Common Area', visible: true },
    { key: 'lease', label: 'Lease Details', visible: true }, 
    { key: 'account_name', label: 'Account', visible: true }, 
    { key: 'total_amount', label: 'Total Amount', visible: true },
    { key: 'due_date', label: 'Due Date', visible: true },
    { key: 'invoice_date', label: 'Issue Date', visible: true },
    { key: 'paidDate', label: 'Paid Date', visible: true },
    { key: 'createdby', label: 'Created By', visible: true },
    { key: 'invoice_status', label: 'Status', visible: true, useTemplate: true },
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
    this.loadexpenses();
  }
  loadexpenses() {
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
      featureid: "EXPENSES"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.expenses || []; 
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
  get filteredRows(): ExpenseRow[] {
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
  get paginatedRows(): ExpenseRow[] {
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
    this.loadexpenses();
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
  viewExpense(id: string): void {
    this.openActionId = null;
    void this.router.navigate(['/accounting/expenses', id]);
  }
  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => (col.visible = checked));
  }

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.openActionId = this.openActionId === id ? null : id;
  }

  statusClass(status: ExpenseStatus): string {
    const map: Record<string, string> = {
      Paid: 'inv-badge inv-badge--paid',
      Unpaid: 'inv-badge inv-badge--rejected',
      Overdue: 'inv-badge inv-badge--rejected',
      Draft: 'inv-badge inv-badge--draft',
      Hold: 'inv-badge inv-badge--pending',
      Void: 'inv-badge inv-badge--draft',
      'Write Off': 'inv-badge inv-badge--draft',
      Bounced: 'inv-badge inv-badge--rejected'
    };
    return map[status] || 'inv-badge inv-badge--draft';
  }

  ngOnInit() {
    
    this.loadexpenses(); 
    this.loadLookup(61, 'tabs', 'lookup_name');
  }
  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.commontabservice.getMasterByType({
      typeId: 61,
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
    this.openActionId = null;
  }
}
