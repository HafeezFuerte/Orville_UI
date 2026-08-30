import { Component, HostListener } from '@angular/core';
import { CommonModule,formatDate } from '@angular/common';
import { FormsModule,FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlowbiteDatepickerDirective } from '../../../shared/directives/flowbite-datepicker.directive';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AccountingService } from '../accounting.service'; 
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';

import {  
  CreditNoteRow
} from './credit-notes.data';

@Component({
  selector: 'app-credit-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    FlowbiteDatepickerDirective,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent,
    DeleteConfirmationComponent
  ],
  templateUrl: './credit-notes.component.html',
  styleUrl: './credit-notes.component.scss'
})
export class CreditNotesComponent {
  searchQuery = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  deleteModal:boolean=false;
  openActionId: string | null = null;
  modalOpen = false;
  editingId: any = null; 
  filterContact = '';
  filterAccount = '';
  filterCreatedBy = '';
  currentUser = this.commonservice.getCurrentUser();
  tenants :any=[];
  accounts :any=[];
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];

  draft = this.emptyDraft();
  constructor(  private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService, private fb: FormBuilder,public translate: TranslateService,
    public accountingService:AccountingService) { }
  tableColumns = [
    { key: 'code', label: 'ID', visible: true, useTemplate: true },
    { key: 'note_date', label: 'Date', visible: true },
    { key: 'tenant', label: 'Contact', visible: true, useTemplate: true },
    { key: 'account_name', label: 'Account', visible: true },
    { key: 'amount', label: 'Amount', visible: true, useTemplate: true },
    { key: 'remainingamt', label: 'Remaining Credit', visible: true, useTemplate: true },
    { key: 'details', label: 'Notes', visible: true },
    { key: 'createdby', label: 'Created By', visible: true },
    { key: 'created_date', label: 'Created', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): CreditNoteRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.filterContact && !row.contact.toLowerCase().includes(this.filterContact.toLowerCase())) {
        return false;
      }
      if (this.filterAccount && !row.account.toLowerCase().includes(this.filterAccount.toLowerCase())) {
        return false;
      }
      if (this.filterCreatedBy && !row.createdBy.toLowerCase().includes(this.filterCreatedBy.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.includes(q) ||
        row.contact.toLowerCase().includes(q) ||
        row.account.toLowerCase().includes(q) ||
        row.notes.toLowerCase().includes(q) ||
        row.createdBy.toLowerCase().includes(q)
      );
    });
  }

   

  get paginatedRows(): CreditNoteRow[] {
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

  get modalTitle(): string {
    return this.editingId ? 'Credit Note' : 'Credit Note';
  }

  get modalSub(): string {
    return this.editingId ? 'Edit an existing credit note.' : 'Issue a new credit note';
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterContact = '';
    this.filterAccount = '';
    this.filterCreatedBy = '';
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

  openCreateModal(): void {
    this.editingId = null;
    this.draft = this.emptyDraft();
    this.modalOpen = true;
    this.openActionId = null;
  }

  openEditModal(row: any): void {
    this.editingId = row.code;
    this.draft = {
      tenant: row.tenant_code,
      account: row.account_code,
      amount: this.parseAmount(row.amount),
      noteDate: formatDate((row.created_date), 'yyyy-MM-dd', 'en-US'),
      note: row.details
    };
    this.modalOpen = true;
    this.openActionId = null;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingId = null;
    this.deleteModal=false;
  }
  ngOnInit() {
    
    this.loadcreditnotes(); 
    this.loadLookup(65,0, 'tenants', 'T');
    this.loadLookup(2,1003, 'accounts', '');
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
          if(Typeid==66){
              this.toastr.success("Successfully marked as inactive");
              this.editingId='';
              this.loadcreditnotes();
          }else
          (this as any)[targetProperty] = res.objResult.table;
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  loadcreditnotes() {
    const filterList: any[] = [];
    // if (this.statusFilter && this.statusFilter !== "All") {
    //   filterList.push({ 'key': 'P.status', 'value': this.statusFilter });
    // } 
 

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
      filter_by:   '',
      filter_list: JSON.stringify(filterList),
      featureid: "CREDITNOTES"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.creditnotes || []; 
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
  saveCreditNote(): void {
    if (this.draft.tenant=="" || this.draft.tenant == null) {
      this.toastr.error("Invalid tenant selection")
      return;
    }
    if (this.draft.amount==null || this.draft.amount == 0) {
      this.toastr.error("Invalid tenant selection")
      return;
    }
    // const amountLabel = this.formatAed(Number(this.draft.amount) || 0);
    // const dateLabel = this.draft.noteDate || this.todayLabel(new Date());
    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      code: this.editingId || "", 
      tenant_code: this.draft.tenant,
      account_code: this.draft.account,
      details: this.draft.note || "",
      invoice_code:'',
      status: 267, //Pending,
      note_date:this.draft.noteDate || formatDate((new Date()), 'yyyy-MM-dd', 'en-US'),
      amount: this.draft.amount || 0, 
    };

    this.accountingService.save_credit_note(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) { 
          this.toastr.success("Successfully created")
          this.closeModal();
          this.pageIndex = 0;
          this.editingId='';
          this.loadcreditnotes();
        }
      },
      error: (err: any) => {
        console.error("Error saving broadcast:", err);
      }
    });

    // if (this.editingId) {
    //   this.allRows = this.allRows.map((row) =>
    //     row.id === this.editingId
    //       ? {
    //           ...row,
    //           date: dateLabel,
    //           contact: this.draft.tenant,
    //           account: this.draft.account,
    //           amount: amountLabel,
    //           notes: this.draft.note
    //         }
    //       : row
    //   );
    // } else {
    //   const row: CreditNoteRow = {
    //     id: String(1817900 + (Date.now() % 10000)),
    //     date: dateLabel,
    //     contact: this.draft.tenant,
    //     account: this.draft.account,
    //     amount: amountLabel,
    //     remainingCredit: amountLabel,
    //     notes: this.draft.note,
    //     createdBy: 'Manager',
    //     created: this.todayLabel()
    //   };
    //   this.allRows = [row, ...this.allRows];
    // }
  
  }

  deleteCreditNote(id: string): void { 
    this.deleteModal=!this.deleteModal;  
    this.editingId=id;
  }
  deleterecord(){
    this.deleteModal=false;
    this.loadLookup(66,0, '', this.editingId);
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

  private emptyDraft() {
    return {
      tenant: '',
      account: '',
      amount: 0,
      noteDate: '',
      note: ''
    };
  }

  private formatAed(value: number): string {
    return `${this.currentUser?.currencyCode} ${value!=null && value!=0 ?value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}`;
  }

  private parseAmount(value: string): number {
    return Number(String(value).replace(/[^\d.]/g, '')) || 0;
  }

  private todayLabel(Date:Date): string { 
    const dd = String(Date.getDate()).padStart(2, '0');
    const mm = String(Date.getMonth() + 1).padStart(2, '0');
    return `${dd}-${mm}-${Date.getFullYear()}`;
  }
}
