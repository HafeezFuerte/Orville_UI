import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { SpaceAvailability, SpaceAttachment, SpaceRow } from '../spaces.data';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  detail: SpaceRow = {
    id: '',
    name: '',
    location: '',
    availability: 'Always',
    slotDuration: '',
    dateRange: '',
    rangeStatus: 'Active',
    enablePayment: 'Disabled',
    phone: '',
    email: '',
    property: '',
    unit: '',
    createdAt: '',
    description: '',
    bookingClosesIn: '',
    slotPrice: '',
    rules: '',
    updatedAt: '',
    schedule: []
  };

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
  attachments: SpaceAttachment[] = [];
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

  ngOnInit(): void {
    this.buildCalendar();
    this.route.paramMap.subscribe((params) => {
      const code = params.get('id') || '';
      if (code) {
        this.loadDetail(code);
      }
    });
    this.route.queryParamMap.subscribe((query) => {
      this.activeTab = query.get('tab') === 'attachments' ? 'attachments' : 'reservations';
    });
  }

  loadDetail(code: string): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 30,
      filterId: 0,
      filterText: code,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && res.statusCode === "200" && res.objResult) {
          const rawDetail = res.objResult.space?.[0] || res.objResult.table?.[0] || {};
          const rawDocs = res.objResult.documents || res.objResult.table2 || [];

          this.detail = {
            id: String(rawDetail.code || rawDetail.id || code),
            name: rawDetail.space_name || rawDetail.name || '',
            location: rawDetail.space_location || rawDetail.location || '',
            availability: (rawDetail.availability || 'Always') as SpaceAvailability,
            slotDuration: rawDetail.slot_duration || rawDetail.slotDuration || '',
            dateRange: rawDetail.date_range || rawDetail.dateRange || '',
            rangeStatus: rawDetail.range_status || rawDetail.rangeStatus || 'Active',
            enablePayment: rawDetail.enable_payment === 'Yes' || rawDetail.enable_payment === true || rawDetail.enablePayment === 'Enabled' ? 'Enabled' : 'Disabled',
            phone: rawDetail.phone_number || rawDetail.phone || '',
            email: rawDetail.email || '',
            property: rawDetail.property_name || rawDetail.property || '',
            unit: rawDetail.unit_name || rawDetail.unit || '',
            createdAt: rawDetail.created_at || rawDetail.createdAt || '',
            description: rawDetail.description || '',
            bookingClosesIn: rawDetail.booking_closes_in || rawDetail.bookingClosesIn || '',
            slotPrice: rawDetail.slot_price || rawDetail.slotPrice || '',
            rules: rawDetail.rules || '',
            updatedAt: rawDetail.updated_at || rawDetail.updatedAt || '',
            schedule: rawDetail.schedule || []
          };

          this.attachments = rawDocs.map((doc: any) => ({
            id: String(doc.code || doc.id || ''),
            fileType: doc.type || doc.fileType || '',
            docId: doc.doc_id || doc.docId || '',
            status: doc.status || '',
            issueDate: doc.issue_date || doc.issueDate || '',
            expiryDate: doc.expiry_date || doc.expiryDate || '',
            files: doc.files || '',
            uploadedBy: doc.uploaded_by || doc.uploadedBy || '',
            shareLandlord: doc.share_landlord === 'Yes' || doc.shareLandlord === true,
            shareTenant: doc.share_tenant === 'Yes' || doc.shareTenant === true,
            createdAt: doc.created_at || doc.createdAt || '',
            updatedAt: doc.updated_at || doc.updatedAt || ''
          }));
        }
      },
      error: (err: any) => {
        console.error("Error loading space detail:", err);
      }
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
