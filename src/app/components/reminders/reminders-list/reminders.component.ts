import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  REMINDER_ROWS,
  ReminderPriority,
  ReminderRow,
  ReminderStatus,
  parseReminderDate,
} from '../reminders.data';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';
type StatusTab = 'all' | ReminderStatus;
type ViewMode = 'list' | 'calendar';

export interface CalendarDay {
  date: Date;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  reminders: ReminderRow[];
}

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent,
    DeleteConfirmationComponent
  ],
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements OnInit {
  private commontabservice = inject(Common_TabsService);
  private commonService = inject(CommonService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  viewMode: ViewMode = 'list';
  statusTab: StatusTab = 'all';
  searchQuery = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  showRowMenuId: string | null = null;
  filterParticipant = '';
  filterStatus: ReminderStatus | null = null;
  filterPriority: ReminderPriority | null = null;
  statusOptions: ReminderStatus[] = ['Pending', 'Completed'];
  priorityOptions: ReminderPriority[] = ['Low', 'Medium', 'High'];
  
  isLoading = false;
  useApiPaging = false;
  deleteModal=false;
  e_code:string='';
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];
  currentUser = this.commonService.getCurrentUser();  
  totalRecordsCount = 0;
  totalPagesCount = 0;

  calendarCursor = new Date(2026, 7, 1);
  readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  readonly statusTabs: { id: StatusTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Completed', label: 'Completed' },
  ];

  tableColumns = [
    { key: 'code', label: 'ID', visible: true, useTemplate: true, width: '80px' },
    { key: 'title', label: 'Title', visible: true, useTemplate: true },
    // { key: 'to_do', label: 'Todo', visible: true,useTemplate: true  },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true, width: '110px' },
    { key: 'status_name', label: 'Status', visible: true, useTemplate: true, width: '120px' },
    { key: 'reminder_date', label: 'Due Date', visible: true, width: '170px' },
    { key: 'recurring', label: 'Recurring', visible: true, useTemplate: true, width: '100px' },
    { key: 'assignee', label: 'Assignee', visible: true, useTemplate: true },
    { key: 'Users', label: 'Users', visible: true, useTemplate: true, width: '100px' },
    { key: 'created_date', label: 'Created', visible: false },
    { key: 'modified_date', label: 'Last Updated', visible: false },
    { key: 'actions', label: '', visible: true, useTemplate: true, width: '56px' },
  ];

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
    this.isLoading = true; 
    const filterList: any[] = [];
    if (this.statusTab && this.statusTab !== "all") {
      filterList.push({ 'key': 'P.status', 'value': this.statusTab =="Pending" ? 296 : 297 });
    } 
    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || '74BB6922',
      clientID: this.currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      featureid: 'REMINDERS',
      filter_by: this.statusTab !== 'all' ? 'status' : '',
      filter_list: JSON.stringify(filterList), 
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.statusCode === '200' && res.objResult) {
          const rawItems = res.objResult.reminders || res.objResult.table || [];
          if (rawItems.length) {
            this.useApiPaging = true;
            this.allRows =rawItems;
            if (res.objResult.rows_info && res.objResult.rows_info[0]) {
              this.totalRecordsCount = res.objResult.rows_info[0].totalrecords;
              this.totalPagesCount = res.objResult.rows_info[0].noofpages;
            } else {
              this.totalRecordsCount = this.allRows.length;
              this.totalPagesCount = Math.max(1, Math.ceil(this.totalRecordsCount / this.pageSize));
            }
            return;
          }
        }
        this.useMockData();
      },
      error: () => {
        this.isLoading = false;
        this.useMockData();
      },
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
        if (res.statusCode == 200 && res.objResult && res.objResult.table) { 
          if(Typeid==71){
            this.toastr.success("Successfully marked as completed");
            this.e_code='';
            this.loadReminders();
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
  private useMockData(): void {
    this.useApiPaging = false;
    this.allRows = [...REMINDER_ROWS];
    this.totalRecordsCount = this.filteredRows.length;
    this.totalPagesCount = Math.max(1, Math.ceil(this.totalRecordsCount / this.pageSize));
  }
 

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): ReminderRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.statusTab !== 'all' && row.status !== this.statusTab) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterPriority && row.priority !== this.filterPriority) {
        return false;
      }
      if (this.filterParticipant) {
        const p = this.filterParticipant.trim().toLowerCase();
        if (!row.participants.toLowerCase().includes(p)) {
          return false;
        }
      }
      if (!q) {
        return true;
      }
      return (
        row.title.toLowerCase().includes(q) ||
        row.todo.toLowerCase().includes(q) ||
        row.participants.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q)
      );
    });
  }
  deleteguideline(id: string): void { 
    this.deleteModal=!this.deleteModal;  
    this.e_code=id;
  }
  deleterecord(){
    this.deleteModal=false;
    this.loadLookup(71,4, '', this.e_code);
  }
  closeModal(){
    this.deleteModal=false;
  }
   

  get paginatedRows(): ReminderRow[] {
    if (this.useApiPaging) {
      return this.filteredRows;
    }
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageIndex * this.pageSize + 1 : 0;
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

  get calendarLabel(): string {
    return this.calendarCursor.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  get calendarMonthValue(): string {
    const y = this.calendarCursor.getFullYear();
    const m = String(this.calendarCursor.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  get calendarDays(): CalendarDay[] {
    const year = this.calendarCursor.getFullYear();
    const month = this.calendarCursor.getMonth();
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const today = new Date();
    const cells: CalendarDay[] = [];

    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevDays - i);
      cells.push(this.buildDay(d, false, today));
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      cells.push(this.buildDay(d, true, today));
    }
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const nextDay = cells.length - (startPad + daysInMonth) + 1;
      const d = new Date(year, month + 1, nextDay);
      cells.push(this.buildDay(d, false, today));
      if (cells.length >= 42) {
        break;
      }
    }
    return cells;
  }

  private buildDay(date: Date, inMonth: boolean, today: Date): CalendarDay {
    const reminders = this.allRows.filter((row) => {
      const due = parseReminderDate(row.reminder_date || row.created_date);
      if (!due) {
        return false;
      }
      return (
        due.getFullYear() === date.getFullYear() &&
        due.getMonth() === date.getMonth() &&
        due.getDate() === date.getDate()
      );
    });
    return {
      date,
      day: date.getDate(),
      inMonth,
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
      reminders,
    };
  }

  setView(mode: ViewMode): void {
    this.viewMode = mode;
    this.showRowMenuId = null;
  }

  setStatusTab(tab: StatusTab): void {
    this.statusTab = tab;
    this.pageNo = 0;
    this.loadReminders();
  }

  onSearch(): void {
    this.pageIndex = 0;
    if (this.useApiPaging) {
      this.loadReminders();
    }
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
    if (this.useApiPaging) {
      this.loadReminders();
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterParticipant = '';
    this.filterStatus = null;
    this.filterPriority = null;
    this.statusTab = 'all';
    this.pageIndex = 0;
    if (this.useApiPaging) {
      this.loadReminders();
    }
  }

  toggleComplete(row: ReminderRow, event?: Event): void {
    event?.stopPropagation();
    this.showRowMenuId = null;
    const next: ReminderStatus = row.status === 'Completed' ? 'Pending' : 'Completed';
    this.allRows = this.allRows.map((item) =>
      item.id === row.id ? { ...item, status: next } : item
    );
    this.toastr.success(
      next === 'Completed' ? 'Reminder marked complete.' : 'Reminder marked pending.',
      'Reminders'
    );
  }

  isCompleted(row: ReminderRow): boolean {
    return row.status === 'Completed';
  }

  openAdd(): void {
    void this.router.navigate(['/reminders/new']);
  }

  openDetail(row: any): void {
    this.showRowMenuId = null;
    void this.router.navigate(['/reminders', row.code]);
  }

  editReminder(row: any): void {
    this.showRowMenuId = null;
    void this.router.navigate(['/reminders/edit',row.code]) 
  }

  markascomplete(row: any): void {
    this.loadLookup(71,5, '', row.code);
  }

  statusActionLabel(row: ReminderRow): string {
    return row.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed';
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col && col.key !== 'actions') {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => {
      if (col.key !== 'actions') {
        col.visible = checked;
      }
    });
  }

  toggleRowMenu(id: string, event: Event): void {
    event.stopPropagation();
    this.showRowMenuId = this.showRowMenuId === id ? null : id;
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
    this.loadReminders();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadReminders();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadReminders();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadReminders();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadReminders();
    }
 
  }
  prevMonth(): void {
    this.calendarCursor = new Date(
      this.calendarCursor.getFullYear(),
      this.calendarCursor.getMonth() - 1,
      1
    );
  }

  nextMonth(): void {
    this.calendarCursor = new Date(
      this.calendarCursor.getFullYear(),
      this.calendarCursor.getMonth() + 1,
      1
    );
  }

  onMonthInput(value: string): void {
    if (!value) {
      return;
    }
    const [y, m] = value.split('-').map(Number);
    if (y && m) {
      this.calendarCursor = new Date(y, m - 1, 1);
    }
  }
  viewDtls(ev:any){
    if (!ev) {
      return;
    } 
    this.router.navigate(['/reminders',ev.code]);
  }

  openDay(day: CalendarDay): void {
    if (!day.inMonth) {
      return;
    } 
    // void this.router.navigate(['/reminders/edit'], {
    //   queryParams: {
    //     date: `${String(day.day).padStart(2, '0')}-${this.calendarCursor.toLocaleString('en-US', { month: 'short' })}-${this.calendarCursor.getFullYear()}`,
    //   },
    // });
  }

  exportList(): void {
    this.toastr.info('Export is presentation only.', 'Reminders');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.showRowMenuId = null;
  }
}
