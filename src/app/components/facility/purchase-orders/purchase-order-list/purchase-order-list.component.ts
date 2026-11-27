import { TranslateModule } from '@ngx-translate/core';
import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  PURCHASE_ORDER_ROWS,
  PurchaseOrderRow
} from '../purchase-orders.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { OvPaginatorComponent } from '../../../../shared/components/ov-paginator/ov-paginator.component';
import { ScreenId } from '../../../../shared/config/screen-ids.config';
import { PagePermissionService } from '../../../../shared/services/page-permission.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, OvPaginatorComponent,SharedTableComponent, ColumnMenuComponent, TranslateModule, HasPermissionDirective],
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.scss'
})
export class PurchaseOrderListComponent {
  private router = inject(Router);
  private commonservice = inject(CommonService);
  private commontabservice = inject(Common_TabsService);
  private toastr=inject(ToastrService)
  public pagePermissionService = inject(PagePermissionService);
  currentUser = this.commonservice.getCurrentUser(); 
  searchQuery = '';
  showColumnDropdown = false;
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows :any=[];
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  tableColumns = [
    { key: 'code', label: 'ID', visible: true, useTemplate: true, width: '80px' },
    { key: 'po_no', label: 'PO Number', visible: true, width: '110px',useTemplate: true },
    { key: 'title', label: 'Title', visible: true,  width: '200px' },
    { key: 'status', label: 'Status', visible: true, useTemplate: true, width: '100px' }, 
    { key: 'total_amount', label: 'Total Amount (' + this.currentUser?.currencyCode + ' )', visible: true, useTemplate: true, width: '130px' },
    { key: 'po_date', label: 'PO Date', visible: true, width: '110px' },
    { key: 'due_date', label: 'Due Date', visible: true, width: '110px' },
    { key: 'vendor', label: 'Vendor', visible: true, useTemplate: true, width: '160px' },
    { key: 'property', label: 'Property', visible: true, width: '160px' ,useTemplate: true,},
    { key: 'unit_code', label: 'Unit', visible: true, width: '140px',useTemplate: true, }, 
    { key: 'created_by', label: 'Added By', visible: true, width: '120px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];

  ngOnInit() {
    this.pagePermissionService.loadPagePermissions(ScreenId.PurchaseOrders).subscribe();
    this.loadpurchaseorders();   
  }
  get visibleColumns() {
    return this.tableColumns.filter((c) => c.visible !== false);
  }

  get filteredRows(): PurchaseOrderRow[] {
    let rows = [...this.allRows];
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.poNumber.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.vendor.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q) ||
          r.addedBy.toLowerCase().includes(q)
      );
    }
    return rows;
  }
  loadpurchaseorders() {
    const filterList: any[] = [];
    
     
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
      filter_by:  '',
      filter_list: JSON.stringify(filterList),
      featureid: "PURCHASE_ORDER"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.purchase_order || []; 
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

  get paginatedRows(): any[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  

  applyLocalSearch(): void {
    if (!this.allRows || this.allRows.length === 0) return;
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      this.allRows = this.allRows.filter((r: any) =>
        (r.title && String(r.title).toLowerCase().includes(q)) ||
        (r.code && String(r.code).toLowerCase().includes(q)) ||
        (r.quotation_no && String(r.quotation_no).toLowerCase().includes(q)) ||
        (r.selected_vendors && String(r.selected_vendors).toLowerCase().includes(q))
      );
    }
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadpurchaseorders();
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
    this.loadpurchaseorders();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadpurchaseorders();
  }
  onPaginatorChange(event: any): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadpurchaseorders();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadpurchaseorders();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadpurchaseorders();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadpurchaseorders();
    }
 
  }
     

  goPage(page: number): void {
    this.pageNo = Math.max(0, Math.min(page - 1, this.totalPages - 1));
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

  navigateToCreate(): void {
    this.closeRowAction();
    this.router.navigate(['/facility/purchase-orders/create']);
  }

  navigateToDetail(id: string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/purchase-orders', id]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-po-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-po-columns]')) {
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
