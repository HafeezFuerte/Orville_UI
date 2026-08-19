import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../shared/components/column-menu/column-menu.component';
import {
  REMINDER_ROWS,
  ReminderPriority,
  ReminderRow,
  ReminderStatus
} from '../reminders.data';

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
export class RemindersComponent {
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
  allRows = REMINDER_ROWS;

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

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): ReminderRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.filterParticipant && !row.participants.toLowerCase().includes(this.filterParticipant.toLowerCase())) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (this.filterPriority && row.priority !== this.filterPriority) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.id.toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        row.participants.toLowerCase().includes(q) ||
        row.priority.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
      );
    });
  }

  get totalRecords(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
  }

  get paginatedRows(): ReminderRow[] {
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

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterParticipant = '';
    this.filterStatus = null;
    this.filterPriority = null;
    this.pageIndex = 0;
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
  }
}
