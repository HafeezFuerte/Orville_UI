import { TranslateModule } from '@ngx-translate/core';
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ScreenId } from '../../../../shared/config/screen-ids.config';
import { PagePermissionService } from '../../../../shared/services/page-permission.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import {
  REQUEST_ROWS,
  RequestPriority,
  RequestRow,
  RequestStatus
} from '../requests.data';

type StatusTab = 'All' | RequestStatus;

@Component({
  selector: 'app-facility-requests',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent, TranslateModule, HasPermissionDirective],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class FacilityRequestsComponent {
  searchQuery = '';
  statusFilter: StatusTab = 'All'; 
  statusTabs:any=[];
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterTitle = '';
  filterStatus: RequestStatus | null = null;
  filterPriority: RequestPriority | null = null;
  statusOptions: RequestStatus[] = [
    'Open',
    'New',
    'Pending',
    'Approved',
    'Resolved',
    'Closed',
    'On Hold',
    'Rejected',
    'Re-opened'
  ];
  priorityOptions: RequestPriority[] = ['Low', 'Medium', 'High'];
  allRows:any[]=[];
  currentUser = this.commonservice.getCurrentUser();  
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  // readonly metrics = {
  //   total: '1,272',
  //   totalSub: 'web.facility.requests.metricAcrossAllBuildings',
  //   open: '284',
  //   openSub: 'web.facility.requests.metricRequireTeamAction',
  //   awaiting: '96',
  //   awaitingSub: 'web.facility.requests.metricPendingManagerReview',
  //   due: '42',
  //   dueSub: 'web.facility.requests.metricNeedFollowUpToday'
  // };
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  metrics :any= [];
   
  tableColumns = [
    {
      key: 'code',
      label: 'web.common.lblID',
      visible: true,
      useTemplate: true,
      width: '90px',
      headerClass: 'text-start sticky left-0 z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-0 z-[1] bg-white dark:bg-bodybg'
    },
    {
      key: 'title',
      label: 'web.facility.tickets.lblTitle',
      visible: true,
      useTemplate: true,
      width: '220px',
      headerClass: 'text-start sticky left-[90px] z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-[90px] z-[1] bg-white dark:bg-bodybg'
    },
    { key: 'property', label: 'web.facility.tickets.colProperty', visible: true, width: '180px',useTemplate: true },
    { key: 'unitcode', label: 'web.facility.tickets.colUnit', visible: true, width: '140px',useTemplate: true },
    {
      key: 'priority',
      label: 'web.facility.tickets.colPriority',
      visible: true,
      useTemplate: true,
      width: '110px',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },
    {
      key: 'status_nm',
      label: 'web.facility.tickets.colStatus',
      visible: true,
      useTemplate: true,
      width: '130px',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },
    { key: 'department_nm', label: 'web.facility.tickets.lblDepartment', visible: true, width: '160px' },
    {
      key: 'source_nm',
      label: 'web.facility.tickets.lblSource',
      visible: true,
      useTemplate: true,
      width: '140px',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },
    { key: 'contact', label: 'web.facility.tickets.lblContact', visible: true, useTemplate: true, width: '180px' },
    { key: 'created_date', label: 'web.facility.tickets.lblCreated', visible: true, width: '110px' },
    { key: 'description', label: 'web.facility.tickets.details', visible: true, useTemplate: true, width: '240px' },
    {
      key: 'action',
      label: 'web.facility.tickets.action',
      visible: true,
      useTemplate: true,
      width: '72px',
      headerClass: 'text-end',
      cellClass: 'text-end overflow-visible'
    }
  ];

  constructor(private router:Router ,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService, public pagePermissionService: PagePermissionService) {}
  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }
  ngOnInit() {
    this.pagePermissionService.loadPagePermissions(ScreenId.Requests).subscribe();
    this.loadTickets();  
    this.loadLookup(82,41, 'statusTabs', '');
  }

  exportRequests(): void {
    const rowsSource = this.allRows || [];
    if (!rowsSource.length) {
      this.toastr.info('No request data to export');
      return;
    }
    const headers = ['ID', 'Title', 'Type', 'Property', 'Unit', 'Priority', 'Status', 'Created Date'];
    const rows = rowsSource.map((r: any) => [
      r.code || r.id || '',
      `"${String(r.title || '').replace(/"/g, '""')}"`,
      `"${String(r.type_name || r.type || '').replace(/"/g, '""')}"`,
      `"${String(r.property || '').replace(/"/g, '""')}"`,
      `"${String(r.unit || '').replace(/"/g, '""')}"`,
      `"${String(r.priority || '').replace(/"/g, '""')}"`,
      `"${String(r.status_nm || r.status || '').replace(/"/g, '""')}"`,
      r.created_date || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }
  loadTickets() {
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
      featureid: "TICKETS"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => {  
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.tickets || []; 
          if (response.objResult.rows_info) {
            this.totalRecords = response.objResult.rows_info[0].totalrecords; 
            this.totalPages = response.objResult.rows_info[0].noofpages;
          }
        } else {
          this.allRows = []; 
          this.totalRecords = 0;
          this.totalPages = 0;
          this.toastr.error(this.translate.instant('web.common.lblNoRecordsFound'));
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
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) { 
          if(Typeid==71){
            this.toastr.success(this.translate.instant('web.facility.tickets.msgMarkedInactiveSuccess')); 
            this.loadTickets();
        }else{
          this.statusTabs.push({"id":"All","name":"All"}); 
          this.statusTabs.push(...res.objResult.status);  
          if(res.objResult.ticketdashboard){
            this.metrics=res.objResult.ticketdashboard;
           
        }
        }
        }
        else
        this.toastr.error(this.translate.instant('web.common.lblNoRecordsFound'));
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  get filteredRows(): RequestRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterPriority && row.priority !== this.filterPriority) {
        return false;
      }
      if (this.filterTitle && !row.title.toLowerCase().includes(this.filterTitle.trim().toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [
        row.id,
        row.title,
        row.property,
        row.unit,
        row.priority,
        row.status,
        row.department,
        row.source,
        row.contactName,
        row.details,
        row.category
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
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
  applyFilters(): void {
    this.pageNo = 0;
    this.isDrawerOpen = false;
  }
  clearFilters(): void {
    this.filterTitle = '';
    this.filterStatus = null; 
    this.pageNo = 0;
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

  setStatusFilter(tab: StatusTab): void {
    this.statusFilter = tab;
    this.pageNo = 0;
    this.loadTickets();
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadTickets();
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
    this.loadTickets();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadTickets();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadTickets();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadTickets();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadTickets();
    }
 
  }

  toggleAllColumns(visible: boolean): void {
    this.tableColumns.forEach((col) => {
      if (col.key !== 'action') {
        col.visible = visible;
      }
    });
  }
  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col && key !== 'action') {
      col.visible = !col.visible;
    }
  }
  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }
  toggleRowAction(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showColumnDropdown = false;

    if (this.openRowActionId === id) {
      this.closeRowAction();
      return;
    }

    const target = event.currentTarget as HTMLElement | null;
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const menuWidth = 120;
    const gap = 4;
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8));
    let top = rect.bottom + gap;
    // Flip upward if near bottom of viewport
    if (top + 90 > window.innerHeight) {
      top = Math.max(8, rect.top - gap - 80);
    }

    this.rowMenuStyle = {
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`
    };
    this.openRowActionId = id;
  }

  closeRowAction(): void {
    this.openRowActionId = null;
    this.rowMenuStyle = null;
  }

  priorityClass(priority: RequestPriority): string {
    switch (priority) {
      case 'High':
        return 'req-chip--danger-soft';
      case 'Medium':
        return 'req-chip--warning-soft';
      default:
        return 'req-chip--success-soft';
    }
  }

  statusClass(status: RequestStatus): string {
    switch (status) {
      case 'Open':
      case 'New':
        return 'req-chip--primary';
      case 'Rejected':
        return 'req-chip--danger-soft';
      case 'Closed':
      case 'Resolved':
        return 'req-chip--success-soft';
      case 'Pending':
      case 'On Hold':
      case 'Approved':
      case 'Re-opened':
        return 'req-chip--warning-soft';
      default:
        return 'req-chip--soft';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-requests-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-requests-columns]')) {
      this.showColumnDropdown = false;
    }
  }
  navigateToDetail(id: string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/tickets', id]);
  }

  navigateToEdit(id:string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/tickets/create',id]);
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.openRowActionId) {
      this.closeRowAction();
    }
  }
}
