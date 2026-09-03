import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  CHEQUE_KPIS,
  CHEQUE_ROWS,
  CHEQUE_STATUS_TABS,
  ChequeRow,
  ChequeStatus
} from './cheques.data';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AccountingService } from '../accounting.service'; 
@Component({
  selector: 'app-cheques',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './cheques.component.html',
  styleUrl: './cheques.component.scss'
})
export class ChequesComponent {
  searchQuery = '';
  statusFilter: 'All' | any = 'All';
  statusTabs : any=[];
  kpis:any=[];
  showColumnDropdown = false;
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];
  currentUser = this.commonservice.getCurrentUser();

  tableColumns = [
    { key: 'code', label: 'ID', visible: true, useTemplate: true },
    { key: 'invoice_no', label: 'Invoice ID', visible: true },
    { key: 'cheque_no', label: 'Cheque No', visible: true }, 
    { key: 'bank_name', label: 'Bank Name', visible: true },
    { key: 'cheque_date', label: 'Cheque Date', visible: true },
    { key: 'held_by_name', label: 'Held By', visible: true },
    { key: 'amt', label: 'Amount Cents', visible: true },
    { key: 'cheque_status', label: 'Status', visible: true, useTemplate: true },
    { key: 'created_date', label: 'Created At', visible: true },
    { key: 'cheque_in_hand', label: 'In Hand', visible: true, useTemplate: true },
    { key: 'returned', label: 'Returned', visible: true, useTemplate: true },
    { key: 'returned_date', label: 'Returned Date', visible: true },
    { key: 'bounce_date', label: 'Bounce Date', visible: true },
    { key: 'bounce_reason', label: 'Bounce Reason', visible: true },
    { key: 'withdrawal_reason', label: 'Withdrawal Reason', visible: true },
    { key: 'Tenant', label: 'Tenant', visible: true, useTemplate: true  }, 
    { key: 'unit_code', label: 'Unit', visible: true, useTemplate: true  },
    { key: 'attachment_path', label: 'Attachment', visible: true , useTemplate: true }
  ];
  constructor(private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService,
    public accountingService:AccountingService) {}
  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): ChequeRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row:any) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.toLowerCase().includes(q) ||
        row.invoiceId.toLowerCase().includes(q) ||
        row.chequeNo.toLowerCase().includes(q) ||
        row.bankName.toLowerCase().includes(q) ||
        row.contactName.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
      );
    });
  }

  ngOnInit() {
    
    this.loadCheques();  
    this.loadLookup(2,41, 'statusTabs', '');
  }
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: 68,
      filterId: filterId,
      filterText: filterText,
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
  loadCheques() {
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
      filter_by: this.statusFilter !== 'All' ? 'account_type' : '',
      filter_list: JSON.stringify(filterList),
      featureid: "CHEQUES"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.cheques || []; 
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
 
  get paginatedRows(): ChequeRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
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

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  setStatusFilter(status: 'All' | ChequeStatus): void {
    this.statusFilter = status;
    this.pageNo = 0;
    this.loadCheques();
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadCheques();
  }

  statusClass(status: ChequeStatus): string {
    if (status === 'Cleared' || status === 'Deposited' || status === 'Redeposited') {
      return 'chq-pill chq-pill--navy';
    }
    if (status === 'Pending') {
      return 'chq-pill chq-pill--warn';
    }
    if (status === 'Bounced') {
      return 'chq-pill chq-pill--danger';
    }
    return 'chq-pill chq-pill--muted';
  }

  yesNoClass(value: 'Yes' | 'No'): string {
    return value === 'Yes' ? 'chq-pill chq-pill--navy' : 'chq-pill chq-pill--muted';
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
    this.loadCheques();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadCheques();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadCheques();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadCheques();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadCheques();
    }
 
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
