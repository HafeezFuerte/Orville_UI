import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
export interface WorkOrder {
  id?: string;
  code?: string;
  title?: string;
  workOrder?: string;
  property?: string;
  property_code?: string;
  address_1?: string;
  unit?: string;
  unit_code?: string;
  priority?: string;
  status?: string;
  status_nm?: string;
  class_name?: string;
  vendor?: string;
  vendor_name?: string;
  category?: string;
  maintenance_name?: string;
  responsiblePerson?: string;
  responsible_person?: string;
  responsible_user?: string;
  technician?: string;
  technician_name?: string;
  lastUpdate?: string;
  createdAt?: string;
  createdBy?: string;
}

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent],
  templateUrl: './work-order-list.component.html',
  styleUrl: './work-order-list.component.scss'
})
export class WorkOrderListComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);
  private commontabService=inject(Common_TabsService);
  private toastr =inject(ToastrService);
  currentUser = this.commonService.getCurrentUser();
  searchQuery: string = '';
  viewMode: 'list' | 'grid' | 'board' = 'list';
  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1'];
  isLoading: boolean = false;

  activeTab: string = 'All';
  tabs:any[] =[];
  //tabs = ['All', 'New', 'Open', 'In Progress', 'On Hold', 'Resolved', 'Rejected', 'Accepted', 'Tenant Rejected', 'Canceled', 'Re-opened'];
  /** Figma kanban column order (2946:97655) */
  kanbanColumns: string[] = [
    'New',
    'Open',
    'In Progress',
    'On Hold',
    'Resolved',
    'Rejected',
    'Accepted',
    'Vendor Rejected',
    'Tenant Rejected',
    'Escalated',
    'Re-opened'
  ];
  openKanbanStatusCode: string | null = null;
  metrics = {
    total: 2955,
    new: 605,
    open: 2319,
    resolved: 31,
    inprogress: 31
  };
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages=0;
//(localStorage.getItem("selectedLang")=="EN" ? 'status_nm' : 'status_nm_ar')
  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'title', label: 'Work order', visible: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true },
    { key: 'status_nm', label: 'Status', visible: true, useTemplate: true },
    { key: 'vendor_name', label: 'Vendor', visible: true, useTemplate: true },
    { key: 'maintenance_name', label: 'Category', visible: true },
    { key: 'responsiblePerson', label: 'Responsible person(s)', visible: true, useTemplate: true },
    { key: 'technician_name', label: 'Technician', visible: true, useTemplate: true },
    { key: 'modified_date', label: 'Last Update', visible: true },
    { key: 'created_date', label: 'Created At', visible: true },
    { key: 'created_by_name', label: 'Created By', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  workOrderData: WorkOrder[] = [];
  openActionCode: string | null = null;

  loadMetrics() {
    const payload = {
      typeId: 39,
      filterId: 0,
      filterText: "",
      filterText1: "",
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
    };
    this.commontabService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          let  data = res.objResult.table[0]; 
          if (data) {
            this.metrics = {
              total: data.workorders,
              open: data.open ?? this.metrics.open,
              new: data.new  ?? this.metrics.new,
              inprogress:data.inprogress  ?? this.metrics.inprogress,
              resolved: data.resolved   ?? this.metrics.resolved
            };
          }
        }
      },
      error: (err: any) => console.error("Error loading metrics:", err)
    });
  }
  showColumnDropdown: boolean = false;

  toggleRowAction(code: string | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!code) {
      return;
    }
    this.openActionCode = this.openActionCode === code ? null : code;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openActionCode = null;
    this.openKanbanStatusCode = null;
    this.showColumnDropdown = false;
  }

  priorityClass(priority?: string): string {
    const value = (priority || '').toLowerCase();
    if (value === 'high') {
      return 'ov-status--blocked';
    }
    if (value === 'medium') {
      return 'ov-status--warning';
    }
    if (value === 'low') {
      return 'ov-status--active';
    }
    return 'ov-status--soft';
  }

  kanbanPriorityClass(priority?: string): string {
    const value = (priority || '').toLowerCase();
    if (value === 'emergency' || value === 'critical' || value === 'urgent') {
      return 'wo-kanban-card__priority--emergency';
    }
    if (value === 'high') {
      return 'wo-kanban-card__priority--high';
    }
    if (value === 'medium') {
      return 'wo-kanban-card__priority--medium';
    }
    if (value === 'low') {
      return 'wo-kanban-card__priority--low';
    }
    return 'wo-kanban-card__priority--soft';
  }

  private normalizeStatus(value?: string): string {
    return (value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  }

  private rowStatusLabel(row: any): string {
    return (
      this.getArabicLookupName(row, 'status_nm') ||
      row?.status_nm ||
      row?.status ||
      ''
    );
  }

  matchKanbanColumn(row: any): string | null {
    const label = this.normalizeStatus(this.rowStatusLabel(row));
    if (!label) {
      return null;
    }
    const found = this.kanbanColumns.find((col) => this.normalizeStatus(col) === label);
    return found || null;
  }

  cardsForColumn(column: string): any[] {
    return (this.workOrderData || []).filter((row) => this.matchKanbanColumn(row) === column);
  }

  columnCount(column: string): number {
    return this.cardsForColumn(column).length;
  }

  assigneeName(row: any): string {
    return (
      row?.responsiblePerson ||
      row?.responsible_person ||
      row?.responsible_user ||
      row?.responsible_persons ||
      row?.responsible_user_name ||
      row?.technician_name ||
      row?.technician ||
      '-'
    );
  }

  assigneeInitials(row: any): string {
    const name = this.assigneeName(row);
    if (!name || name === '-') {
      return '--';
    }
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  cardLocation(row: any): string {
    const property = row?.property || '';
    const category = row?.maintenance_name || row?.category || '';
    if (property && category) {
      return `${property} · ${category}`;
    }
    return property || category || '-';
  }

  cardDate(row: any): string {
    return row?.due_date || row?.dueDate || row?.modified_date || row?.created_date || row?.lastUpdate || row?.createdAt || '-';
  }

  toggleKanbanStatus(code: string | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!code) {
      return;
    }
    this.openKanbanStatusCode = this.openKanbanStatusCode === code ? null : code;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find(c => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(event: any): void {
    const checked = event.target.checked;
    this.tableColumns.forEach(c => c.visible = checked);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible !== false);
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  ngOnInit() {
    this.loadData();
    this.loadMetrics();
    this.loadLookup(29, 'tabs', 'lookup_name');
  }
  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: filterId,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.tabs.push({"id":"All","name":"All"}); 
          this.tabs.push(...res.objResult.table); 
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  loadData() {
    this.isLoading = true;
    var filterList=[];
     
    if (this.activeTab && this.activeTab!="All") {
      filterList.push({'key':'P.status','value': this.activeTab});
    }
    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery,
      pagecount: this.pageSize,
      filter_by: this.activeTab !== 'All' ? 'status' : '',
      filter_list: JSON.stringify(filterList),
      featureid: "WORKORDERS"
    };

    this.portfolioService.getMastersByPaging(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.objResult && res.objResult.workorders) {
          this.workOrderData = res.objResult.workorders;
          if(res.objResult.rows_info)
          {
            this.totalRecords=res.objResult.rows_info[0].totalrecords; 
            this.totalPages=res.objResult.rows_info[0].noofpages;
          }
           
        }else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading work orders:", err);
      }
    });
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
    this.loadData();
  }

  onSearch() {
    this.pageNo = 0;
    this.loadData();
  }

  onTabChange(tab: any) {
    this.activeTab = tab?.id;
    this.pageNo = 0;
    this.loadData();
  }

  navigateToCreate() {
    this.router.navigate(['/facility/work-orders/create']);
  }

  handleEditAction(row: any) {
    this.router.navigate(['/facility/work-orders/edit', row.code]);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/facility/work-orders', id]);
  }

  setViewMode(mode: 'list' | 'grid' | 'board'): void {
    const prev = this.viewMode;
    this.viewMode = mode;
    if (mode === 'board' && prev !== 'board') {
      // Load all statuses so columns can group client-side
      if (this.activeTab !== 'All') {
        this.activeTab = 'All';
        this.pageNo = 0;
      }
      // Board needs a wider page of cards across statuses
      if (this.pageSize < 50) {
        this.pageSize = 50;
      }
      this.loadData();
    }
  }

  get startRecord(): number {
    return this.pageNo * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = (this.pageNo + 1) * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  get pages(): number[] {
    const pagesArray: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.pageNo - 1);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  get pageSizeOptions(): number[] {
    return [10, 20, 50, 100];
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadData();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.totalPages - 1) {
      this.pageNo++;
      this.loadData();
    }
  }

  goToPage(page: number): void {
    this.pageNo = page - 1;
    this.loadData();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNo = 0;
    this.loadData();
  }
}
