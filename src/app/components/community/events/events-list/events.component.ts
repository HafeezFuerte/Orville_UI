import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { EVENT_ROWS, EventRow, EventStatus } from '../events.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
import { DeleteConfirmationComponent } from '../../../../shared/components/delete-confirmation/delete-confirmation.component';
type StatusTab = 'All' | EventStatus;

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent,DeleteConfirmationComponent
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  searchQuery = '';
  statusFilter: any = 'All';
  statusTabs: any=[];
  isDrawerOpen = false;
  deleteModal:boolean=false;
  showColumnDropdown = false;
  filterName = '';
  filterStatus: EventStatus | null = null;
  statusOptions: EventStatus[] = ['Draft', 'Published', 'Cancelled'];
  event_code="";
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];
  currentUser = this.commonservice.getCurrentUser(); 
  openRowActionId: string | null = null;
  openRowActionRow: any = null;
  rowMenuStyle: { top: string; left: string } | null = null;

  tableColumns = [
    {
      key: 'code',
      label: 'ID',
      visible: true,
      useTemplate: true,
      width: '90px',
      headerClass: 'text-start sticky left-0 z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-0 z-[1] bg-white dark:bg-bodybg'
    },
    {
      key: 'event_name',
      label: 'Event Name',
      visible: true,
      useTemplate: true,
      width: '200px',
      headerClass: 'text-start sticky left-[90px] z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-[90px] z-[1] bg-white dark:bg-bodybg'
    },
    { key: 'location', label: 'Location', visible: true, width: '240px' },
    { key: 'status_name', label: 'Status', visible: true, useTemplate: true },
    { key: 'event_date', label: 'Date', visible: true },
    { key: 'max_attendences', label: 'Max Attendance', visible: true, useTemplate: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '80px' }
  ];

  constructor(private router:Router ,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): EventRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusFilter !== 'All' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterName && !row.name.toLowerCase().includes(this.filterName.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [row.id, row.name, row.location, row.status, row.date].some((value) =>
        String(value).toLowerCase().includes(q)
      );
    });
  }
  ngOnInit() {
    
    this.loadEvents();  
    this.loadLookup(69,41, 'statusTabs', '');
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
            this.event_code='';
            this.loadEvents();
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
  deleteEvent(id: string): void {
    this.closeRowMenu();
    this.deleteModal=!this.deleteModal;  
    this.event_code=id;
  }
  deleterecord(){
    this.deleteModal=false;
    this.loadLookup(71,1, '', this.event_code);
  }
  closeModal(){
    this.deleteModal=false;
  }
  loadEvents() {
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
      featureid: "EVENTS"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.events || []; 
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

  countFor(tab: StatusTab): number {
    if (tab === 'All') {
      return this.allRows.length;
    }
    return this.allRows.filter((row) => row.status === tab).length;
  }

  setStatusFilter(tab: StatusTab): void {
    this.statusFilter = tab;
    this.pageNo = 0;
    this.loadEvents();
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

  get paginatedRows(): EventRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
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

  goToAdd(): void {
    void this.router.navigate(['/community/events/new']);
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterStatus = null;
    this.statusFilter = 'All';
    this.pageIndex = 0;
    this.loadEvents();
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
    this.loadEvents();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadEvents();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadEvents();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadEvents();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadEvents();
    }
 
  }
  toggleRowAction(row: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showColumnDropdown = false;

    if (this.openRowActionId === row.id) {
      this.closeRowMenu();
      return;
    }

    const target = event.currentTarget as HTMLElement | null;
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const menuWidth = 148;
    const menuHeight = 120;
    const gap = 4;
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8));
    let top = rect.bottom + gap;
    if (top + menuHeight > window.innerHeight) {
      top = Math.max(8, rect.top - gap - menuHeight);
    }

    this.rowMenuStyle = {
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`
    };
    this.openRowActionId = row.id;
    this.openRowActionRow = row;
  }

  closeRowMenu(): void {
    this.openRowActionId = null;
    this.openRowActionRow = null;
    this.rowMenuStyle = null;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.closeRowMenu();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.closeRowMenu();
  }
}
