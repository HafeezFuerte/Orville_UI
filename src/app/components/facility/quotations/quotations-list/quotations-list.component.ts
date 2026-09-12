import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { QUOTATION_ROWS, QuotationRow, QuotationStatus } from '../quotations.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
import { DeleteConfirmationComponent } from '../../../../shared/components/delete-confirmation/delete-confirmation.component';
type StatusTab = 'All' | QuotationStatus;

@Component({
  selector: 'app-quotations-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent
  ],
  templateUrl: './quotations-list.component.html',
  styleUrl: './quotations-list.component.scss'
})
export class QuotationsListComponent { 

  searchQuery = '';
  statusFilter: StatusTab = 'All';
  statusTabs:any=[];
  isDrawerOpen = false;
  showColumnDropdown = false;
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];
  currentUser = this.commonservice.getCurrentUser(); 
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  filterTitle = '';
  filterStatus: QuotationStatus | null = null;
  filterVendor = '';

  tableColumns = [
    { key: 'code', label: 'Quotation ID', visible: true, useTemplate: true, width: '120px' },
    { key: 'workorder_id', label: 'Work Order ID', visible: true, useTemplate: true, width: '130px' },
    { key: 'title', label: 'Quotation Title', visible: true, useTemplate: true, width: '220px' },
    { key: 'quotation_no', label: 'Quotation Number', visible: true, width: '150px' },
    { key: 'selected_vendors', label: 'Vendor', visible: true, useTemplate: true, width: '200px' },
    { key: 'category_name', label: 'Quotation Category Name', visible: true, width: '180px' },
    { key: 'status_nm', label: 'Quotation Status', visible: true, useTemplate: true, width: '140px' },
    { key: 'total_amt', label: 'Quotation Amount', visible: true, width: '140px' },
    { key: 'created_date', label: 'Quotation Date', visible: true, width: '130px' },
    { key: 'estimation_date', label: 'Quotation Validity', visible: true, width: '140px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];
  constructor(private router:Router ,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService) {}

  ngOnInit() {
    
    this.loadQuotations();  
    this.loadLookup(78,41, 'statusTabs', '');
  }
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) { 
          if(Typeid==71){
            this.toastr.success("Successfully marked as inactive"); 
            this.loadQuotations();
        }else{
          this.statusTabs.push({"id":"All","name":"All"}); 
          this.statusTabs.push(...res.objResult.table);  
        }
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
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
  get visibleColumns() {
    return this.tableColumns.filter((c) => c.visible !== false);
  }

  get filteredRows(): QuotationRow[] {
    let rows = [...this.allRows];
    if (this.statusFilter !== 'All') {
      rows = rows.filter((r) => r.status === this.statusFilter);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.number.toLowerCase().includes(q) ||
          r.vendor.toLowerCase().includes(q) ||
          r.workOrderId.toLowerCase().includes(q)
      );
    }
    if (this.filterTitle.trim()) {
      const t = this.filterTitle.trim().toLowerCase();
      rows = rows.filter((r) => r.title.toLowerCase().includes(t));
    }
    if (this.filterStatus) {
      rows = rows.filter((r) => r.status === this.filterStatus);
    }
    if (this.filterVendor.trim()) {
      const v = this.filterVendor.trim().toLowerCase();
      rows = rows.filter((r) => r.vendor.toLowerCase().includes(v));
    }
    return rows;
  }
  loadQuotations() {
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
      featureid: "QUOTATIONS"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.quotations || []; 
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
   
  get displayPage(): number {
    return this.pageNo + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageNo * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalRecords);
  }

  get paginatedRows(): QuotationRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  setStatusFilter(tab: StatusTab): void {
    this.statusFilter = tab;
    this.pageNo = 0;
    this.loadQuotations();
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  onSharedTablePageChange(event: any): void {
    
    if(event.pageIndex>this.pageNo){
    this.pageNo = this.pageNo + 1;
    }
    else{
      this.pageNo = this.pageNo - 1;
    }
    if(this.pageNo<0)
    this.pageNo=0;
    this.pageSize = event.pageSize; 
    this.loadQuotations();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadQuotations();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadQuotations();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadQuotations();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadQuotations();
    }
 
  }


  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col && key !== 'action') {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(visible: boolean): void {
    this.tableColumns.forEach((col) => {
      if (col.key !== 'action') {
        col.visible = visible;
      }
    });
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.filterTitle = '';
    this.filterStatus = null;
    this.filterVendor = '';
    this.pageIndex = 0;
  }

  statusClass(status: QuotationStatus): string {
    switch (status) {
      case 'Pending':
        return 'qt-chip qt-chip--warning';
      case 'Approved':
        return 'qt-chip qt-chip--success';
      case 'Rejected':
        return 'qt-chip qt-chip--danger';
      case 'Expired':
        return 'qt-chip qt-chip--soft';
      default:
        return 'qt-chip qt-chip--soft';
    }
  }

  toggleRowAction(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openRowActionId === id) {
      this.closeRowAction();
      return;
    }
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.rowMenuStyle = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${Math.max(8, rect.right - 160)}px`,
      zIndex: '1200'
    };
    this.openRowActionId = id;
  }

  closeRowAction(): void {
    this.openRowActionId = null;
    this.rowMenuStyle = null;
  }

  navigateToDetail(id: string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/quotations', id]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/facility/quotations/create']);
  }
  navigateToedit(rowcode:string): void {
    this.router.navigate(['/facility/quotations/edit',rowcode]);
  }

  navigateToRequest(): void {
    this.router.navigate(['/facility/quotations/request']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-qt-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-qt-columns]')) {
      this.showColumnDropdown = false;
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.openRowActionId) {
      this.closeRowAction();
    }
  }
}
