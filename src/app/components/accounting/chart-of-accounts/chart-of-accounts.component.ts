import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
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
  ACCOUNT_TYPE_TABS,
  AccountType,
  CHART_ACCOUNT_ROWS,
  ChartAccountRow
} from './chart-of-accounts.data';

@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  imports: [CommonModule,DeleteConfirmationComponent, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, FilterDrawerComponent, ColumnMenuComponent],
  templateUrl: './chart-of-accounts.component.html',
  styleUrl: './chart-of-accounts.component.scss'
})
export class ChartOfAccountsComponent {
  searchQuery = '';
  typeFilter: 'All' | any = 'All';
  typeTabs :any=[];
  isDrawerOpen = false;
  showColumnDropdown = false;
  openActionId: string | null = null;

  filterName = '';
  filterType: AccountType | null = null;
  filterSubAccount: 'Yes' | 'No' | null = null;
  typeOptions: AccountType[] = ACCOUNT_TYPE_TABS.filter((tab): tab is AccountType => tab !== 'All');
  subAccountOptions: Array<'Yes' | 'No'> = ['Yes', 'No'];
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
    { key: 'account_no', label: 'Account Number', visible: true },
    { key: 'account_name', label: 'Name', visible: true },
    { key: 'description', label: 'Description', visible: true },
    { key: 'account_type_nm', label: 'Type', visible: true, useTemplate: true },
    { key: 'account_sub_type_nm', label: 'Sub Type', visible: true },
    { key: 'subAccount', label: 'Sub Account', visible: true, useTemplate: true },
    { key: 'createdby', label: 'Created By', visible: true },
    { key: 'created_date', label: 'Created', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  constructor(private router: Router,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService,
    public accountingService:AccountingService) {}
  

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  get filteredRows(): ChartAccountRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.typeFilter !== 'All' && row.type !== this.typeFilter) {
        return false;
      }
      if (this.filterType && row.type !== this.filterType) {
        return false;
      }
      if (this.filterSubAccount && row.subAccount !== this.filterSubAccount) {
        return false;
      }
      if (this.filterName && !row.name.toLowerCase().includes(this.filterName.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.includes(q) ||
        row.accountNumber.includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
        row.createdBy.toLowerCase().includes(q)
      );
    });
  }
 

  get paginatedRows(): ChartAccountRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
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

  setTypeFilter(type: 'All' | any): void {
    this.typeFilter = type;
    this.pageNo = 0;
    this.loadCOA();
  }

  onSearch(): void {
    this.pageNo = 0;
  }

  applyFilters(): void {
    this.pageNo = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterType = null;
    this.filterSubAccount = null;
    this.typeFilter = 'All';
    this.pageNo = 0;
    this.loadCOA();
  }

  ngOnInit() {
    
    this.loadCOA();  
    this.loadLookup(2,44, 'typeTabs', '');
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
          this.typeTabs.push({"id":"All","name":"All"}); 
          this.typeTabs.push(...res.objResult.table); 
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  loadCOA() {
    const filterList: any[] = [];
    if (this.typeFilter && this.typeFilter !== "All") {
      filterList.push({ 'key': 'P.account_type', 'value': this.typeFilter });
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
      filter_by: this.typeFilter !== 'All' ? 'account_type' : '',
      filter_list: JSON.stringify(filterList),
      featureid: "COA"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.coa || []; 
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

  typeClass(type: AccountType): string {
    if (type === 'Asset') {
      return 'coa-pill coa-pill--navy';
    }
    if (type === 'Liability') {
      return 'coa-pill coa-pill--danger';
    }
    return 'coa-pill coa-pill--muted';
  }

  subAccountClass(value: 'Yes' | 'No'): string {
    return value === 'Yes' ? 'coa-pill coa-pill--navy' : 'coa-pill coa-pill--muted';
  }

  openAccount(id: string): void {
    this.openActionId = null;
    void this.router.navigate(['/accounting/chart-of-accounts/edit-account',id]);
  }

  deleteAccount(id: string): void {
    this.allRows = this.allRows.filter((row) => row.id !== id);
    this.openActionId = null;
    if (this.pageIndex >= this.totalPages) {
      this.pageIndex = Math.max(0, this.totalPages - 1);
    }
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
    this.loadCOA();
  }
  handleChildNotification(ev:any){
    if(ev.action_name=="edit")
      window.location.href='/edit-property/'+ev.code;
    else if (ev.action_name=="delete")
    {
      //this.deleteUnit(ev.code);
    }
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadCOA();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadCOA();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadCOA();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadCOA();
    }
 
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionId = null;
  }
}
