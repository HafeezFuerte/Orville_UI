import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { getSpaceDetail, SPACE_ATTACHMENTS, SpaceAttachment, SpaceRow } from '../spaces.data';

interface CalendarEvent {
  time: string;
  title: string;
}

interface CalendarCell {
  day: number;
  muted?: boolean;
  selected?: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-space-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './space-detail.component.html'
})
export class SpaceDetailComponent implements OnInit {
  detail: SpaceRow = getSpaceDetail('31658');
  activeTab: 'reservations' | 'attachments' = 'reservations';
  calendarView: 'Day' | 'Week' | 'Month' | 'Year' = 'Month';
  calendarModes: Array<'Day' | 'Week' | 'Month' | 'Year'> = ['Day', 'Week', 'Month', 'Year'];
  showMore = true;
  showActionMenu = false;
  actionOptions = [
    { label: 'Edit Space', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'Add Reservation', asset: 'assets/images/action-menu/plus.svg', danger: false },
    { label: 'Delete Space', asset: 'assets/images/action-menu/archive.svg', danger: true }
  ];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarCells: CalendarCell[] = [];
  attachments = SPACE_ATTACHMENTS;
  attachmentSearch = '';
  showAttachmentColumns = false;
  attachmentPageIndex = 0;
  attachmentPageSize = 10;

  attachmentColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '110px', headerClass: 'text-start sticky left-0 z-[2] bg-white dark:bg-bodybg', cellClass: 'sticky left-0 z-[1] bg-white dark:bg-bodybg' },
    { key: 'fileType', label: 'File Type', visible: true, useTemplate: true, width: '160px', headerClass: 'text-start sticky left-[110px] z-[2] bg-white dark:bg-bodybg', cellClass: 'sticky left-[110px] z-[1] bg-white dark:bg-bodybg' },
    { key: 'docId', label: 'Doc ID', visible: true },
    { key: 'status', label: 'Document Status', visible: true, useTemplate: true },
    { key: 'issueDate', label: 'Issue Date', visible: true },
    { key: 'expiryDate', label: 'Expiry Date', visible: true },
    { key: 'files', label: 'Files', visible: true, useTemplate: true },
    { key: 'uploadedBy', label: 'Uploaded By', visible: true, useTemplate: true },
    { key: 'shareLandlord', label: 'Share Landlord', visible: true, useTemplate: true },
    { key: 'shareTenant', label: 'Share Tenant', visible: true, useTemplate: true },
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'updatedAt', label: 'Updated At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  get visibleAttachmentColumns() {
    return this.attachmentColumns.filter((col) => col.visible !== false);
  }

  get filteredAttachments(): SpaceAttachment[] {
    const q = this.attachmentSearch.trim().toLowerCase();
    if (!q) {
      return this.attachments;
    }
    return this.attachments.filter((row) =>
      [row.id, row.fileType, row.docId, row.uploadedBy, row.status].some((value) =>
        value.toLowerCase().includes(q)
      )
    );
  }

  get attachmentTotal(): number {
    return this.filteredAttachments.length;
  }

  get attachmentPages(): number {
    return Math.max(1, Math.ceil(this.attachmentTotal / this.attachmentPageSize) || 1);
  }

  get pagedAttachments(): SpaceAttachment[] {
    const start = this.attachmentPageIndex * this.attachmentPageSize;
    return this.filteredAttachments.slice(start, start + this.attachmentPageSize);
  }

  get attachmentStart(): number {
    return this.attachmentTotal ? this.attachmentPageIndex * this.attachmentPageSize + 1 : 0;
  }

  get attachmentEnd(): number {
    return Math.min((this.attachmentPageIndex + 1) * this.attachmentPageSize, this.attachmentTotal);
  }

  get attachmentPager(): (number | string)[] {
    const total = this.attachmentPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.buildCalendar();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.detail = getSpaceDetail(params.get('id'));
    });
    this.route.queryParamMap.subscribe((query) => {
      this.activeTab = query.get('tab') === 'attachments' ? 'attachments' : 'reservations';
    });
  }

  setCalendarView(mode: 'Day' | 'Week' | 'Month' | 'Year'): void {
    this.calendarView = mode;
  }

  setTab(tab: 'reservations' | 'attachments'): void {
    this.activeTab = tab;
    void this.router.navigate([], {
      queryParams: tab === 'attachments' ? { tab: 'attachments' } : {},
      queryParamsHandling: ''
    });
  }

  goBack(): void {
    void this.router.navigate(['/bookings/spaces']);
  }

  goToEdit(): void {
    this.showActionMenu = false;
    void this.router.navigate(['/bookings/spaces/new']);
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Space') {
      this.goToEdit();
      return;
    }
    if (label === 'Add Reservation') {
      void this.router.navigate(['/bookings/reservations/new']);
    }
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  toggleAttachmentColumns(event: Event): void {
    event.stopPropagation();
    this.showAttachmentColumns = !this.showAttachmentColumns;
  }

  toggleAttachmentColumn(key: string): void {
    const col = this.attachmentColumns.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllAttachmentColumns(checked: boolean): void {
    this.attachmentColumns.forEach((col) => (col.visible = checked));
  }

  onAttachmentSearch(): void {
    this.attachmentPageIndex = 0;
  }

  onAttachmentPageSizeChange(): void {
    this.attachmentPageIndex = 0;
  }

  previousAttachmentPage(): void {
    if (this.attachmentPageIndex > 0) {
      this.attachmentPageIndex--;
    }
  }

  nextAttachmentPage(): void {
    if (this.attachmentPageIndex + 1 < this.attachmentPages) {
      this.attachmentPageIndex++;
    }
  }

  goToAttachmentPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.attachmentPages) {
      this.attachmentPageIndex = target;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
    this.showAttachmentColumns = false;
  }

  private buildCalendar(): void {
    const leading = [28, 29, 30];
    const month = Array.from({ length: 31 }, (_, i) => i + 1);
    const events: Record<number, CalendarEvent[]> = {
      1: [{ time: '9:00 AM', title: 'Initial Consult' }],
      9: [{ time: '2:30 PM', title: 'Contract Review' }],
      14: [
        { time: '11:00 AM', title: 'Team Sync' },
        { time: '4:00 PM', title: 'Sarah Jenkins' }
      ]
    };
    this.calendarCells = [
      ...leading.map((day) => ({ day, muted: true, events: [] as CalendarEvent[] })),
      ...month.map((day) => ({
        day,
        selected: day === 14,
        events: events[day] || []
      })),
      { day: 1, muted: true, events: [] }
    ];
  }
}
