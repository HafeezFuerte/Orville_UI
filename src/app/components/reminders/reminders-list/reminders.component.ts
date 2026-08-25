import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import { ReminderPriority, ReminderRow, ReminderStatus } from '../reminders.data';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';

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
    ColumnMenuComponent
  ],
  templateUrl: './reminders.component.html'
})
export class RemindersComponent implements OnInit {
  private commontabservice = inject(Common_TabsService);
  private commonService = inject(CommonService);

  searchQuery = '';
  isDrawerOpen = false;
  showAddModal = false;
  showColumnDropdown = false;
  filterParticipant = '';
  filterStatus: ReminderStatus | null = null;
  filterPriority: ReminderPriority | null = null;
  statusOptions: ReminderStatus[] = ['Pending', 'Completed'];
  priorityOptions: ReminderPriority[] = ['Low', 'Medium', 'High'];
  repeatOptions = ['Day', 'Week', 'Month', 'Year'];
  pageIndex = 0;
  pageSize = 10;
  allRows: ReminderRow[] = [];
  isLoading = false;
  totalRecordsCount = 0;
  totalPagesCount = 0;

  userQuery = '';
  formUsers: string[] = ['Angela Moore'];
  form = {
    title: '',
    todo: '',
    date: '',
    priority: null as ReminderPriority | null,
    status: null as ReminderStatus | null,
    recurring: true,
    paused: false,
    repeatEvery: null as string | null,
    interval: '',
    until: ''
  };

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'title', label: 'Title', visible: true, useTemplate: true },
    { key: 'participants', label: 'Participants', visible: true },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'lastUpdated', label: 'Last Updated', visible: true },
    { key: 'createdOn', label: 'Created On', visible: true }
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
      clientId: currentUser?.clientId || "74BB6922",
      clientID: currentUser?.clientId || "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: this.pageIndex,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      feature: "REMINDERS",
      featureid: "REMINDERS",
      search_columns: "P.id",
      filter_by: ""
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.statusCode === "200" && res.objResult) {
          const rawItems = res.objResult.reminders || res.objResult.table || [];
          this.allRows = rawItems.map((item: any) => ({
            id: String(item.code || item.id || ''),
            title: item.title || '',
            participants: item.users || item.participants || '',
            priority: (item.priority || 'Medium') as ReminderPriority,
            status: (item.status_name || item.status || 'Pending') as ReminderStatus,
            lastUpdated: item.modified_date || item.lastUpdated || '',
            createdOn: item.created_date || item.createdOn || ''
          }));

          if (res.objResult.rows_info && res.objResult.rows_info[0]) {
            this.totalRecordsCount = res.objResult.rows_info[0].totalrecords;
            this.totalPagesCount = res.objResult.rows_info[0].noofpages;
          } else {
            this.totalRecordsCount = this.allRows.length;
            this.totalPagesCount = Math.max(1, Math.ceil(this.totalRecordsCount / this.pageSize));
          }
        } else {
          this.allRows = [];
          this.totalRecordsCount = 0;
          this.totalPagesCount = 0;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("Error loading reminders:", err);
        this.allRows = [];
        this.totalRecordsCount = 0;
        this.totalPagesCount = 0;
      }
    });
  }

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): ReminderRow[] {
    return this.allRows;
  }

  get totalRecords(): number {
    return this.totalRecordsCount;
  }

  get totalPages(): number {
    return Math.max(1, this.totalPagesCount || 1);
  }

  get paginatedRows(): ReminderRow[] {
    return this.allRows;
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

  onSearch(): void {
    this.pageIndex = 0;
    this.loadReminders();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadReminders();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterParticipant = '';
    this.filterStatus = null;
    this.filterPriority = null;
    this.pageIndex = 0;
    this.loadReminders();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  addUser(): void {
    const name = this.userQuery.trim();
    if (!name || this.formUsers.includes(name)) {
      return;
    }
    this.formUsers = [...this.formUsers, name];
    this.userQuery = '';
  }

  removeUser(name: string): void {
    this.formUsers = this.formUsers.filter((item) => item !== name);
  }

  saveReminder(): void {
    this.showAddModal = false;
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

  onPageSizeChange(): void {
    this.pageIndex = 0;
    this.loadReminders();
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadReminders();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex++;
      this.loadReminders();
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages && target !== this.pageIndex) {
      this.pageIndex = target;
      this.loadReminders();
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
