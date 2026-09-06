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

  pageIndex = 0;
  pageSize = 10;
  allRows: ReminderRow[] = [...REMINDER_ROWS];
  isLoading = false;
  useApiPaging = false;
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
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '80px' },
    { key: 'title', label: 'Title', visible: true, useTemplate: true },
    { key: 'todo', label: 'Todo', visible: true },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true, width: '110px' },
    { key: 'status', label: 'Status', visible: true, useTemplate: true, width: '120px' },
    { key: 'dueDate', label: 'Due Date', visible: true, width: '170px' },
    { key: 'recurring', label: 'Recurring', visible: true, useTemplate: true, width: '100px' },
    { key: 'assignee', label: 'Assignee', visible: true, useTemplate: true },
    { key: 'users', label: 'Users', visible: true, useTemplate: true, width: '100px' },
    { key: 'createdOn', label: 'Created', visible: false },
    { key: 'lastUpdated', label: 'Last Updated', visible: false },
    { key: 'actions', label: '', visible: true, useTemplate: true, width: '56px' },
  ];

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
    this.isLoading = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      clientID: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      page_no: this.pageIndex,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      feature: 'REMINDERS',
      featureid: 'REMINDERS',
      search_columns: 'P.id',
      filter_by: '',
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.statusCode === '200' && res.objResult) {
          const rawItems = res.objResult.reminders || res.objResult.table || [];
          if (rawItems.length) {
            this.useApiPaging = true;
            this.allRows = rawItems.map((item: any) => this.mapApiRow(item));
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

  private useMockData(): void {
    this.useApiPaging = false;
    this.allRows = [...REMINDER_ROWS];
    this.totalRecordsCount = this.filteredRows.length;
    this.totalPagesCount = Math.max(1, Math.ceil(this.totalRecordsCount / this.pageSize));
  }

  private mapApiRow(item: any): ReminderRow {
    return {
      id: String(item.code || item.id || ''),
      title: item.title || '',
      todo: item.todo || item.description || item.notes || '',
      participants: item.users || item.participants || item.assignee || '',
      assigneeEmail: item.email || item.assignee_email || '',
      usersCount: Number(item.users_count || item.user_count || 1),
      priority: (item.priority || 'Medium') as ReminderPriority,
      status: (item.status_name || item.status || 'Pending') as ReminderStatus,
      lastUpdated: item.modified_date || item.lastUpdated || '',
      createdOn: item.created_date || item.createdOn || '',
      date: item.reminder_date || item.due_date || item.date || '',
      dueDate: item.due_date || item.reminder_date || item.date || '',
      paused: !!item.paused,
      recurring: !!(item.recurring || item.is_recurring),
      record: item.record || item.reference || '',
    };
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

  get totalRecords(): number {
    return this.useApiPaging ? this.totalRecordsCount : this.filteredRows.length;
  }

  get totalPages(): number {
    if (this.useApiPaging) {
      return Math.max(1, this.totalPagesCount || 1);
    }
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize) || 1);
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
    const reminders = this.filteredRows.filter((row) => {
      const due = parseReminderDate(row.dueDate || row.date);
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
    this.pageIndex = 0;
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

  openDetail(row: ReminderRow): void {
    this.showRowMenuId = null;
    void this.router.navigate(['/reminders', row.id]);
  }

  editReminder(row: ReminderRow): void {
    this.showRowMenuId = null;
    void this.router.navigate(['/reminders/new'], {
      queryParams: { code: row.id, id: row.id },
    });
  }

  deleteReminder(row: ReminderRow): void {
    this.showRowMenuId = null;
    this.allRows = this.allRows.filter((item) => item.id !== row.id);
    this.toastr.success('Reminder deleted (presentation only).', 'Reminders');
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

  onPageSizeChange(): void {
    this.pageIndex = 0;
    if (this.useApiPaging) {
      this.loadReminders();
    }
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      if (this.useApiPaging) {
        this.loadReminders();
      }
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex++;
      if (this.useApiPaging) {
        this.loadReminders();
      }
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages && target !== this.pageIndex) {
      this.pageIndex = target;
      if (this.useApiPaging) {
        this.loadReminders();
      }
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

  openDay(day: CalendarDay): void {
    if (!day.inMonth) {
      return;
    }
    void this.router.navigate(['/reminders/new'], {
      queryParams: {
        date: `${String(day.day).padStart(2, '0')}-${this.calendarCursor.toLocaleString('en-US', { month: 'short' })}-${this.calendarCursor.getFullYear()}`,
      },
    });
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
