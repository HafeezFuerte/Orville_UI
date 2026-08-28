import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  DEFAULT_SPACE_SCHEDULE,
  SPACE_ATTACHMENTS,
  SPACE_RESERVATIONS,
  SpaceAttachment,
  SpaceAvailability,
  SpaceReservation,
  SpaceRow,
  getSpaceDetail,
} from '../spaces.data';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-space-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './space-detail.component.html',
  styleUrls: ['./space-detail.component.scss'],
})
export class SpaceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);
  private toastr = inject(ToastrService);

  detail: SpaceRow = getSpaceDetail(null);
  startDate = '2026-07-14';
  endDate = '2026-07-22';
  reservationCount = SPACE_RESERVATIONS.length;

  activeTab: 'reservations' | 'attachments' = 'reservations';
  showMore = true;
  showActionMenu = false;
  showRowMenuId: string | null = null;

  actionOptions = [
    { label: 'Edit Space', icon: 'ti ti-pencil', danger: false },
    { label: 'Add Reservation', icon: 'ti ti-plus', danger: false },
    { label: 'Delete Space', icon: 'ti ti-trash', danger: true },
  ];

  reservations: SpaceReservation[] = [...SPACE_RESERVATIONS];
  reservationSearch = '';
  reservationPageIndex = 0;
  reservationPageSize = 10;

  reservationColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '90px' },
    { key: 'reserver', label: 'Reserver', visible: true },
    { key: 'bookingDate', label: 'Booking Date', visible: true, width: '130px' },
    { key: 'time', label: 'Time', visible: true, width: '130px' },
    { key: 'status', label: 'Status', visible: true, useTemplate: true, width: '110px' },
    { key: 'approval', label: 'Approval', visible: true, useTemplate: true, width: '120px' },
    { key: 'email', label: 'Email', visible: true },
    { key: 'lease', label: 'Lease', visible: true, useTemplate: true, width: '100px' },
    { key: 'actions', label: 'Actions', visible: true, useTemplate: true, width: '70px' },
  ];

  attachments: SpaceAttachment[] = [...SPACE_ATTACHMENTS];
  attachmentSearch = '';
  showAttachmentColumns = false;
  attachmentPageIndex = 0;
  attachmentPageSize = 10;

  attachmentColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '110px' },
    { key: 'fileType', label: 'File Type', visible: true },
    { key: 'docId', label: 'Doc ID', visible: true },
    { key: 'status', label: 'Document Status', visible: true, useTemplate: true },
    { key: 'issueDate', label: 'Issue Date', visible: true },
    { key: 'expiryDate', label: 'Expiry Date', visible: true },
    { key: 'files', label: 'Files', visible: true, useTemplate: true },
    { key: 'uploadedBy', label: 'Uploaded By', visible: true },
    { key: 'shareLandlord', label: 'Share Landlord', visible: true, useTemplate: true },
    { key: 'shareTenant', label: 'Share Tenant', visible: true, useTemplate: true },
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'updatedAt', label: 'Updated At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true },
  ];

  get dash(): string {
    return '—';
  }

  get visibleAttachmentColumns() {
    return this.attachmentColumns.filter((col) => col.visible !== false);
  }

  get filteredReservations(): SpaceReservation[] {
    const q = this.reservationSearch.trim().toLowerCase();
    if (!q) {
      return this.reservations;
    }
    return this.reservations.filter((row) =>
      [row.id, row.reserver, row.email, row.bookingDate, row.approval, row.lease].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }

  get reservationTotal(): number {
    return this.filteredReservations.length;
  }

  get reservationPages(): number {
    return Math.max(1, Math.ceil(this.reservationTotal / this.reservationPageSize) || 1);
  }

  get pagedReservations(): SpaceReservation[] {
    const start = this.reservationPageIndex * this.reservationPageSize;
    return this.filteredReservations.slice(start, start + this.reservationPageSize);
  }

  get reservationStart(): number {
    return this.reservationTotal ? this.reservationPageIndex * this.reservationPageSize + 1 : 0;
  }

  get reservationEnd(): number {
    return Math.min((this.reservationPageIndex + 1) * this.reservationPageSize, this.reservationTotal);
  }

  get reservationPager(): (number | string)[] {
    const total = this.reservationPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
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
    const fallback = getSpaceDetail(code);
    this.detail = {
      ...fallback,
      id: code || fallback.id,
      schedule: fallback.schedule?.length ? fallback.schedule : [...DEFAULT_SPACE_SCHEDULE],
    };

    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService
      .getMasterByType({
        typeId: 30,
        filterId: 0,
        filterText: code,
        filterText1: '',
        userId: currentUser?.userId || 1,
        clientId: currentUser?.clientId || '74BB6922',
        companyId: currentUser?.companyId || 1,
      })
      .subscribe({
        next: (res: any) => {
          if (res && res.statusCode === '200' && res.objResult) {
            const rawDetail = res.objResult.space?.[0] || res.objResult.table?.[0];
            const rawDocs = res.objResult.documents || res.objResult.table2 || [];
            const rawReservations =
              res.objResult.reservations || res.objResult.table3 || res.objResult.bookings || [];

            if (rawDetail) {
              this.detail = {
                id: String(rawDetail.code || rawDetail.id || code),
                name: rawDetail.space_name || rawDetail.name || this.detail.name,
                location: rawDetail.space_location || rawDetail.location || this.detail.location,
                availability: (rawDetail.availability || this.detail.availability) as SpaceAvailability,
                slotDuration: rawDetail.slot_duration || rawDetail.slotDuration || this.detail.slotDuration,
                dateRange: rawDetail.date_range || rawDetail.dateRange || this.detail.dateRange,
                rangeStatus: rawDetail.range_status || rawDetail.rangeStatus || this.detail.rangeStatus,
                enablePayment:
                  rawDetail.enable_payment === 'Yes' ||
                    rawDetail.enable_payment === true ||
                    rawDetail.enablePayment === 'Enabled'
                    ? 'Enabled'
                    : 'Disabled',
                phone: rawDetail.phone_number || rawDetail.phone || this.detail.phone,
                email: rawDetail.email || this.detail.email,
                property: rawDetail.property_name || rawDetail.property || this.detail.property,
                unit: rawDetail.unit_name || rawDetail.unit || this.detail.unit,
                createdAt: rawDetail.created_at || rawDetail.createdAt || this.detail.createdAt,
                description: rawDetail.description || this.detail.description,
                bookingClosesIn:
                  rawDetail.booking_closes_in || rawDetail.bookingClosesIn || this.detail.bookingClosesIn,
                slotPrice: rawDetail.slot_price || rawDetail.slotPrice || this.detail.slotPrice,
                rules: rawDetail.rules || this.detail.rules,
                updatedAt: rawDetail.updated_at || rawDetail.updatedAt || this.detail.updatedAt,
                schedule:
                  rawDetail.schedule?.length > 0
                    ? rawDetail.schedule
                    : this.detail.schedule?.length
                      ? this.detail.schedule
                      : [...DEFAULT_SPACE_SCHEDULE],
              };

              if (rawDetail.start_date || rawDetail.startDate) {
                this.startDate = rawDetail.start_date || rawDetail.startDate;
              }
              if (rawDetail.end_date || rawDetail.endDate) {
                this.endDate = rawDetail.end_date || rawDetail.endDate;
              }
            }

            if (rawDocs.length) {
              this.attachments = rawDocs.map((doc: any) => ({
                id: String(doc.code || doc.id || ''),
                fileType: doc.type || doc.fileType || '',
                docId: doc.doc_id || doc.docId || '',
                status: doc.status || 'Active',
                issueDate: doc.issue_date || doc.issueDate || '',
                expiryDate: doc.expiry_date || doc.expiryDate || '',
                files: doc.files || '1 file',
                uploadedBy: doc.uploaded_by || doc.uploadedBy || '',
                shareLandlord:
                  doc.share_landlord === 'Yes' || doc.shareLandlord === true || doc.shareLandlord === 'Yes'
                    ? 'Yes'
                    : 'No',
                shareTenant:
                  doc.share_tenant === 'Yes' || doc.shareTenant === true || doc.shareTenant === 'Yes'
                    ? 'Yes'
                    : 'No',
                createdAt: doc.created_at || doc.createdAt || '',
                updatedAt: doc.updated_at || doc.updatedAt || '',
              }));
            }

            if (rawReservations.length) {
              this.reservations = rawReservations.map((item: any) => ({
                id: String(item.code || item.id || ''),
                reserver: item.reserver || item.name || item.title || '',
                bookingDate: item.booking_date || item.bookingDate || item.date || '',
                time: item.time || item.slot || '',
                status: item.status || '',
                approval: item.approval || item.approval_status || '',
                email: item.email || '',
                lease: item.lease || item.lease_id || '',
              }));
              this.reservationCount = this.reservations.length;
            } else {
              this.reservationCount = this.reservations.length;
            }
          }
        },
        error: () => {
          // keep mock/fallback detail
        },
      });
  }

  setTab(tab: 'reservations' | 'attachments'): void {
    this.activeTab = tab;
    this.showRowMenuId = null;
    void this.router.navigate([], {
      queryParams: tab === 'attachments' ? { tab: 'attachments' } : {},
      queryParamsHandling: '',
    });
  }

  goBack(): void {
    void this.router.navigate(['/bookings/spaces']);
  }

  goToEdit(): void {
    this.showActionMenu = false;
    void this.router.navigate(['/bookings/spaces/create'], { queryParams: { code: this.detail.id } });
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Space') {
      this.goToEdit();
      return;
    }
    if (label === 'Add Reservation') {
      void this.router.navigate(['/bookings/reservations/new']);
      return;
    }
    if (label === 'Delete Space') {
      this.toastr.info('Delete is presentation only.', 'Space Details');
    }
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  toggleRowMenu(id: string, event: Event): void {
    event.stopPropagation();
    this.showRowMenuId = this.showRowMenuId === id ? null : id;
  }

  viewReservation(row: SpaceReservation): void {
    this.showRowMenuId = null;
    void this.router.navigate(['/bookings/reservations', row.id]);
  }

  editReservation(row: SpaceReservation): void {
    this.showRowMenuId = null;
    void this.router.navigate(['/bookings/reservations/new'], {
      queryParams: { id: row.id },
    });
  }

  deleteReservation(row: SpaceReservation): void {
    this.showRowMenuId = null;
    this.reservations = this.reservations.filter((item) => item.id !== row.id);
    this.reservationCount = this.reservations.length;
    this.toastr.success('Reservation removed (presentation only).', 'Space Details');
  }

  onReservationSearch(): void {
    this.reservationPageIndex = 0;
  }

  onReservationPageSizeChange(): void {
    this.reservationPageIndex = 0;
  }

  previousReservationPage(): void {
    if (this.reservationPageIndex > 0) {
      this.reservationPageIndex--;
    }
  }

  nextReservationPage(): void {
    if (this.reservationPageIndex + 1 < this.reservationPages) {
      this.reservationPageIndex++;
    }
  }

  goToReservationPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.reservationPages) {
      this.reservationPageIndex = target;
    }
  }

  toggleAttachmentColumns(event: Event): void {
    event.stopPropagation();
    this.showAttachmentColumns = !this.showAttachmentColumns;
  }

  toggleAttachmentColumn(key: string): void {
    const col = this.attachmentColumns.find((item) => item.key === key);
    if (col && col.key !== 'action') {
      col.visible = !col.visible;
    }
  }

  toggleAllAttachmentColumns(checked: boolean): void {
    this.attachmentColumns.forEach((col) => {
      if (col.key !== 'action') {
        col.visible = checked;
      }
    });
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
    this.showRowMenuId = null;
  }
}
