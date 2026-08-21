import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DetailPageLayoutComponent } from '../../portfolio/detail-page-layout/detail-page-layout.component';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { NotesComponent } from '../../child-tables/notes/notes.component';
import { AttachmentsComponent } from '../../child-tables/attachments/attachments.component';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { DetailTab } from '../../../shared/models/detail-tab.model';
import { ToastrService } from 'ngx-toastr';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { UnitsTableComponent } from '../../child-tables/units/units-table.component';
import {WorkordersTableComponent} from '../../child-tables/workorders/workorders.component';
import { BroadcastsTableComponent } from '../../child-tables/broadcasts/broadcasts.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
@Component({
  selector: 'app-lease-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,WorkordersTableComponent,BroadcastsTableComponent, TranslateModule,UnitsTableComponent, DetailPageLayoutComponent, SharedTableComponent, NotesComponent, AttachmentsComponent, FilterDrawerComponent],
  templateUrl: './lease-detail.component.html',
  styleUrl: './lease-detail.component.scss'
})
export class LeaseDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);
  private commontabservice =inject(Common_TabsService);
  leaseId: string = '';
  Form!: FormGroup;
  currentUser = this.commonService.getCurrentUser();
  activeTab: string = 'Overview';
  showInvoiceModal: boolean = false;
  showInspectionModal: boolean = false;
  showMoreDetails = false;
  showActionMenu = false;
  activeEntityPreview: 'tenant' | 'property' | 'unit' | 'lease' | null = null;
  previewPanelStyle: Record<string, string> | null = null;
  private previewTriggerEl: HTMLElement | null = null;

  @ViewChild(DetailPageLayoutComponent)
  detailLayout!: DetailPageLayoutComponent;

  /** Port preview to document.body so sticky table headers cannot cover it. */
  @ViewChild('leasePreviewEl')
  set leasePreviewEl(ref: ElementRef<HTMLElement> | undefined) {
    if (ref?.nativeElement) {
      this.portPreviewToBody(ref.nativeElement);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.showActionMenu = false;
    const target = event.target as HTMLElement | null;
    if (target?.closest?.('.lease-preview') || target?.closest?.('.lease-preview-anchor')) {
      return;
    }
    this.closeEntityPreview();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showActionMenu = false;
    this.closeEntityPreview();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.activeEntityPreview && this.previewTriggerEl) {
      this.updatePreviewPosition(this.previewTriggerEl);
    }
  }

  openInvoiceModal() {
    this.showInvoiceModal = true;
  }

  closeInvoiceModal() {
    this.showInvoiceModal = false;
  }

  openInspectionModal() {
    this.showInspectionModal = true;
  }

  closeInspectionModal() {
    this.showInspectionModal = false;
  }

  /** Notes/Attachments-style tab toolbar state */
  tabSearchQuery = '';
  isTabColumnDropdownOpen = false;
  isTabDrawerOpen = false;
  tabFilterId = '';

  toggleTabDrawer(open: boolean): void {
    this.isTabDrawerOpen = open;
  }

  toggleTabColumnDropdown(): void {
    this.isTabColumnDropdownOpen = !this.isTabColumnDropdownOpen;
  }

  visibleTabColumns(columns: any[]): any[] {
    return (columns || []).filter((c: any) => c.visible !== false);
  }

  allTabColumnsVisible(columns: any[]): boolean {
    const cols = columns || [];
    return cols.length > 0 && cols.every((c: any) => c.visible !== false);
  }

  toggleTabColumn(col: any): void {
    col.visible = !(col.visible !== false);
  }

  toggleAllTabColumns(columns: any[], event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    (columns || []).forEach((c: any) => (c.visible = checked));
  }

  applyTabFilters(): void {
    this.isTabDrawerOpen = false;
  }

  clearTabFilters(): void {
    this.tabFilterId = '';
    this.tabSearchQuery = '';
    this.isTabDrawerOpen = false;
  }

  // Sidebar / Left panel metadata
  leaseInfo: any = {}; 
  // Sub-grid columns (keys/bindings unchanged — presentation templates only)
  invoiceColumns = [
    { key: 'amt', label: 'Amount' + ' (' + this.currentUser?.currencyCode + ' )', visible: true, useTemplate: true },
    { key: 'adv_amt', label: 'Adv.Amount' + ' (' + this.currentUser?.currencyCode + ' )', visible: true, useTemplate: true },
    { key: 'account_name', label: 'web.leases.lblAccount', visible: true, useTemplate: true },
    { key: 'due_date', label: 'web.leases.lblEndDate', visible: true, useTemplate: true },
    { key: 'recurring_cycle', label: 'web.leases.lblRecurringCycle', visible: true, useTemplate: true },
    { key: 'payment_type', label: 'Payment Type', visible: true, useTemplate: true },
    { key: 'attachment_path', label: 'Attachment', visible: true, useTemplate: true }
  ];

  tenantColumns = [
    { key: 'code', label: 'web.common.lblID', visible: true, useTemplate: true },
    { key: 'tenant', label: 'web.common.lblName', visible: true },
    { key: 'email_address', label: 'web.common.lblEmail', visible: true },
    { key: 'phone_number', label: 'web.common.lblPhoneNumber', visible: true },
    { key: 'company_name', label: 'web.common.lblCompany', visible: true },
    { key: 'activeLease', label: 'web.leases.lblActiveLease', visible: true, useTemplate: true },
    { key: 'leasesCount', label: 'web.common.lblLeases', visible: true, useTemplate: true },
    { key: 'gender', label: 'web.leases.lblGender', visible: true },
    { key: 'status', label: 'web.common.lblStatus', visible: true, useTemplate: true }
  ];

  financialsColumns = [
    { key: 'id', label: 'web.common.lblID', visible: true, useTemplate: true },
    { key: 'status', label: 'web.common.lblStatus', visible: true, useTemplate: true },
    { key: 'to', label: 'web.contacts.lblTo', visible: true },
    { key: 'unit', label: 'web.leases.lblUnit', visible: true },
    { key: 'invoiceNumber', label: 'web.leases.lblInvoiceNumber', visible: true },
    { key: 'chequeNo', label: 'web.leases.lblChequeNo', visible: true },
    { key: 'invoiceDate', label: 'web.leases.lblInvoiceDate', visible: true },
    { key: 'invoiceType', label: 'web.leases.lblInvoiceType', visible: true },
    { key: 'account', label: 'web.leases.lblAccount', visible: true },
    { key: 'currency', label: 'web.contacts.lblCurrency', visible: true },
    { key: 'propertyName', label: 'web.contacts.lblPropertyName', visible: true },
    { key: 'propertyId', label: 'web.leases.lblPropertyID', visible: true },
    { key: 'leaseId', label: 'web.contacts.lblLeaseId', visible: true },
    { key: 'leaseStatus', label: 'web.leases.lblLeaseStatus', visible: true },
    { key: 'note', label: 'web.contacts.lblNote', visible: true },
    { key: 'workOrder', label: 'web.leases.lblWorkOrder', visible: true },
    { key: 'amount', label: 'web.common.lblAmount', visible: true, useTemplate: true },
    { key: 'grossAmount', label: 'web.contacts.lblGrossAmount', visible: true, useTemplate: true },
    { key: 'paid', label: 'web.contacts.lblPaid', visible: true },
    { key: 'paymentVia', label: 'web.leases.lblPaymentVia', visible: true },
    { key: 'moneyHeldBy', label: 'web.leases.lblMoneyHeldBy', visible: true },
    { key: 'ddRefNo', label: 'web.leases.lblDDRefNo', visible: true },
    { key: 'bankName', label: 'web.leases.lblBankName', visible: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'archived', label: 'web.contacts.lblArchived', visible: true },
    { key: 'dueDate', label: 'web.contacts.lblDueDate', visible: true },
    { key: 'paidDate', label: 'web.leases.lblPaidDate', visible: true },
    { key: 'cheques', label: 'web.leases.lblCheques', visible: true },
    { key: 'days', label: 'web.leases.lblDays', visible: true },
    { key: 'writeAmountOff', label: 'web.leases.lblWriteAmountOff', visible: true },
    { key: 'createdBy', label: 'web.leases.lblCreatedBy', visible: true }
  ];

  chequeColumns = [
    { key: 'id', label: 'web.common.lblID', visible: true },
    { key: 'invoiceId', label: 'web.leases.lblInvoiceID', visible: true },
    { key: 'chequeNo', label: 'web.leases.lblChequeNo', visible: true },
    { key: 'bankNo', label: 'web.leases.lblBankNo', visible: true },
    { key: 'bankName', label: 'web.leases.lblBankName', visible: true },
    { key: 'chequeDate', label: 'web.leases.lblChequeDate', visible: true },
    { key: 'heldBy', label: 'web.leases.lblHeldBy', visible: true },
    { key: 'amount', label: 'web.common.lblAmount', visible: true, useTemplate: true },
    { key: 'status', label: 'web.common.lblStatus', visible: true, useTemplate: true },
    { key: 'createdAt', label: 'web.contacts.lblCreatedAt', visible: true },
    { key: 'inHand', label: 'In Hand', visible: true },
    { key: 'returned', label: 'Returned', visible: true },
    { key: 'returnedDate', label: 'Returned Date', visible: true },
    { key: 'bounceDate', label: 'Bounce Date', visible: true },
    { key: 'bounceReason', label: 'Bounce Reason', visible: true },
    { key: 'withdrawalReason', label: 'Withdrawal Reason', visible: true },
    { key: 'contactName', label: 'Contact Name', visible: true },
    { key: 'landlord', label: 'web.leases.lblLandlord', visible: true },
    { key: 'unit', label: 'web.leases.lblUnit', visible: true },
    { key: 'attachment', label: 'Attachment', visible: true }
  ]; 

  inspectionsColumns = [
    { key: 'id', label: 'Inspection ID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.common.lblName', visible: true },
    { key: 'status', label: 'web.common.lblStatus', visible: true, useTemplate: true },
    { key: 'type', label: 'web.common.lblType', visible: true },
    { key: 'property', label: 'web.leases.lblProperty', visible: true },
    { key: 'unit', label: 'web.leases.lblUnit', visible: true },
    { key: 'scheduled', label: 'web.leases.lblScheduled', visible: true, useTemplate: true },
    { key: 'userId', label: 'web.leases.lblUserId', visible: true },
    { key: 'createdAt', label: 'Date/Time', visible: true }
  ];

  unitsColumns = [
    { key: 'floorNumber', label: 'web.contacts.lblFloorNumber', visible: true },
    { key: 'managementFee', label: 'web.Unit.lblManagementFee', visible: true },
    { key: 'status', label: 'web.Unit.lblStatus', visible: true, useTemplate: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'size', label: 'web.contacts.lblSize', visible: true },
    { key: 'marketRent', label: 'web.contacts.lblMarketRent', visible: true },
    { key: 'deposit', label: 'web.Unit.lblDeposit', visible: true },
    { key: 'published', label: 'web.contacts.lblPublished', visible: true },
    { key: 'forSale', label: 'web.contacts.lblForSale', visible: true }
  ];

  workOrdersColumns = [
    { key: 'id', label: 'web.common.lblID', visible: true, useTemplate: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'status', label: 'web.common.lblStatus', visible: true, useTemplate: true },
    { key: 'closingStatus', label: 'Closing Status', visible: true, useTemplate: true },
    { key: 'internalStatus', label: 'Internal Status', visible: true },
    { key: 'dueDate', label: 'Due Date', visible: true },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true },
    { key: 'property', label: 'web.leases.lblProperty', visible: true },
    { key: 'vendor', label: 'web.contacts.lblVendor', visible: true },
    { key: 'user', label: 'web.contacts.lblUser', visible: true }
  ];

  noticesColumns = [
    { key: 'id', label: 'web.common.lblID', visible: true, useTemplate: true },
    { key: 'subject', label: 'web.property.lblSubject', visible: true },
    { key: 'preview', label: 'web.property.lblPreview', visible: true, useTemplate: true },
    { key: 'status', label: 'web.common.lblStatus', visible: true, useTemplate: true },
    { key: 'broadcastType', label: 'web.property.lblBroadcastType', visible: true },
    { key: 'sendable', label: 'web.property.lblSendable', visible: true },
    { key: 'scheduled', label: 'web.property.lblScheduled', visible: true },
    { key: 'date', label: 'web.common.lblDate', visible: true },
    { key: 'createdAt', label: 'web.contacts.lblCreatedAt', visible: true },
    { key: 'updatedAt', label: 'web.contacts.lblUpdatedAt', visible: true }
  ];
 

   
  legalColumns = [
    { key: 'escalationOption', label: 'Escalation Option', visible: true },
    { key: 'property', label: 'web.leases.lblProperty', visible: true },
    { key: 'unit', label: 'web.leases.lblUnit', visible: true },
    { key: 'lease', label: 'Lease', visible: true },
    { key: 'unitBlocked', label: 'Unit Blocked', visible: true, useTemplate: true },
    { key: 'tenantBlocked', label: 'Tenant Blocked', visible: true, useTemplate: true },
    { key: 'hearingsCount', label: 'Hearings Count', visible: true },
    { key: 'attachmentsCount', label: 'Attachments Count', visible: true },
    { key: 'notesCount', label: 'Notes Count', visible: true },
    { key: 'internalStatus', label: 'Internal Status', visible: true }
  ];

  // Grid Data Lists
  invoiceSchedules:any[]=[];
  //  = [
  //   { invoiceId: '52658', amount: 2200.00, account: 'Rental Income', dueDate: '01-07-2026', status: 'Unpaid', paymentVia: 'Cash', recurringCycle: 'Fixed' },
  //   { invoiceId: '52659', amount: 2200.00, account: 'Rental Income', dueDate: '01-07-2026', status: 'Unpaid', paymentVia: 'Cash', recurringCycle: 'Fixed' }
  // ];

  tenantsData = [
    { id: '1368', name: 'Ahmad Yasmin', company: 'Orville real estate', activeLease: 'Lease - 134073 - Marina Heights Towers', leasesCount: 2, gender: 'Male', status: 'Active' }
  ];

  financialsData = [
    { id: '1017909', status: 'Unpaid - Overdue - Partially Paid', to: 'Adil Shahzad', unit: '103-PR-10', invoiceNumber: 'INV-26-00067223', chequeNo: '67223', invoiceDate: '08-07-2026', invoiceType: 'Charge', account: 'Rental Income', currency: 'AED', propertyName: 'Marina Heights Tower', propertyId: '12534', leaseId: '534', leaseStatus: 'Active', note: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', workOrder: 'Repair Water Leak', amount: 250000.00, grossAmount: 1000.00, paid: 500.00, paymentVia: 'Cash', moneyHeldBy: 'Company', ddRefNo: 'DF2512689', bankName: 'ENBD Bank', internalStatus: 'All.', archived: '-', dueDate: '10-07-2026', paidDate: '09-07-2026', cheques: '-', days: '2', writeAmountOff: '-', createdBy: 'Sheikh Aqib' }
  ];

  chequesData = [
    { id: 'CHQ-001', invoiceId: 'INV-2025-001', chequeNo: '45896321', bankNo: 'BNK-001', bankName: 'ABC Bank', chequeDate: '05-06-2026', heldBy: 'Finance Office', amount: 150000.00, status: 'Cleared', createdAt: '10-06-2026', inHand: 'Yes', returned: 'No', returnedDate: '-', bounceDate: '-', bounceReason: '-', withdrawalReason: 'Customer Request', contactName: 'John Smith', landlord: 'Orville Res. Estate', unit: 'A-101', attachment: 'cheque_scan.pdf' },
    { id: 'CHQ-002', invoiceId: 'INV-2025-001', chequeNo: '45896321', bankNo: 'BNK-001', bankName: 'NBD Bank', chequeDate: '05-06-2026', heldBy: 'Finance Office', amount: 150000.00, status: 'Pending', createdAt: '10-06-2026', inHand: 'Yes', returned: 'Yes', returnedDate: '-', bounceDate: '-', bounceReason: '-', withdrawalReason: 'Customer Request', contactName: 'John Smith', landlord: 'Orville Res. Estate', unit: 'A-101', attachment: 'cheque_scan.pdf' }
  ];

  unitsData:any[]=[];
  loading:boolean=false;

  inspectionsData = [
    { id: '31668', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215 PR 1', scheduled: 'Yes', userId: 59688, createdAt: '10-01-2026, 09:14' },
    { id: '31669', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215 PR 1', scheduled: 'No', userId: 59688, createdAt: '10-01-2026, 09:14' },
    { id: '31670', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215 PR 1', scheduled: 'Yes', userId: 59688, createdAt: '10-01-2026, 09:14' },
    { id: '31671', name: 'Move Out', status: 'Pending', type: 'Move Out', property: 'Marina Heights Tower', unit: '215 PR 1', scheduled: 'No', userId: 59688, createdAt: '10-01-2026, 09:14' },
    { id: '31672', name: 'Move Out', status: 'Completed', type: 'Move Out', property: 'Marina Heights Tower', unit: '215 PR 1', scheduled: 'Yes', userId: 59688, createdAt: '10-01-2026, 09:14' }
  ];

  workOrdersData:any=[];

  noticesData:any=[]; 

  legalData = [
    { escalationOption: 'Court Filing', property: 'Sunrise Apartments', unit: 'A-101', lease: 'LEASE-2025-001', unitBlocked: 'Yes', tenantBlocked: 'No', hearingsCount: 2, attachmentsCount: 6, notesCount: 3, internalStatus: 'Under Review' },
    { escalationOption: 'Mediation', property: 'Green Heights', unit: 'B-205', lease: 'LEASE-2024-056', unitBlocked: 'No', tenantBlocked: 'No', hearingsCount: 1, attachmentsCount: 2, notesCount: 4, internalStatus: 'Awaiting Response' },
    { escalationOption: 'Court Filing', property: 'Oak Residency', unit: 'C-312', lease: 'LEASE-2023-089', unitBlocked: 'Yes', tenantBlocked: 'Yes', hearingsCount: 4, attachmentsCount: 8, notesCount: 6, internalStatus: 'Hearing Scheduled' },
    { escalationOption: 'Insurance Claim', property: 'City Center Plaza', unit: 'D-100', lease: 'LEASE-2025-018', unitBlocked: 'No', tenantBlocked: 'No', hearingsCount: 0, attachmentsCount: 3, notesCount: 2, internalStatus: 'Evidence Collection' },
    { escalationOption: 'Settlement', property: 'River View Towers', unit: 'E-412', lease: 'LEASE-2022-145', unitBlocked: 'No', tenantBlocked: 'No', hearingsCount: 3, attachmentsCount: 6, notesCount: 5, internalStatus: 'Closed Successfully' }
  ];

  eDocumentsData = [
    { name: 'Lease Agreement.pdf', size: '2.4 MB', updated: 'Updated today' },
    { name: 'Lease Agreement.pdf', size: '2.1 MB', updated: 'Updated 21-06-2025 11:03 AM' },
    { name: 'Lease Agreement.pdf', size: '2.4 MB', updated: 'Updated 25-06-2025 10:03 AM' },
    { name: 'Lease Agreement.pdf', size: '3.4 MB', updated: 'Updated 29-06-2025 09:30 AM' }
  ];
  customFields:any[]=[];
  notesData: any[] = [];
  attachmentsData: any[] = [];

  // Tabs structure
  tabs: DetailTab[] = [];
    

  get selectedTab(): DetailTab | undefined {
    return this.tabs.find(t => t.key === this.activeTab);
  }

  /** Page title — Figma uses property name; fall back to existing lease fields only */
  get leasePageTitle(): string {
    const info = this.leaseInfo || {};
    return (info.property || info.active_lease || info.name || '').toString().trim();
  }

  /** Left hero title — prefer full lease label from API */
  get leaseCardTitle(): string {
    const info = this.leaseInfo || {};
    return (info.active_lease || info.name || info.property || '').toString().trim();
  }

  private get primaryTenant(): any {
    return this.tenantsData?.[0] || {};
  }

  private get primaryUnit(): any {
    return this.unitsData?.[0] || {};
  }

  get tenantPreview() {
    const info = this.leaseInfo || {};
    const t = this.primaryTenant;
    return {
      name: info.tenant || t.tenant || t.name || '-',
      badge: t.tenant_type_badge || info.tenant_type_badge || 'Individual',
      email: t.email_address || t.email || info.tenant_email || '-',
      phone: t.phone_number || t.phone || info.tenant_phone || '-',
      tenantType: t.tenant_type || info.tenant_type || 'Individual Tenant',
      location: info.location || info.address || info.property || '-',
      code: info.tenant_code || t.code || t.tenant_code || ''
    };
  }

  get propertyPreview() {
    const info = this.leaseInfo || {};
    const unitsCount = info.property_units_count ?? info.units_count ?? this.unitsData?.length;
    const occupancy = info.property_occupancy ?? info.occupancy;
    const activeLeases = info.property_active_leases ?? info.active_leases_count;
    return {
      name: info.property || '-',
      category: info.property_category || info.property_type || 'Residential',
      unitsCount: unitsCount != null && unitsCount !== '' ? String(unitsCount) : '-',
      occupancy: occupancy != null && occupancy !== ''
        ? (String(occupancy).includes('%') ? String(occupancy) : `${occupancy}%`)
        : '-',
      activeLeases: activeLeases != null && activeLeases !== ''
        ? `${activeLeases} Active Leases`
        : 'Active Leases',
      code: info.property_code || ''
    };
  }

  get unitPreview() {
    const info = this.leaseInfo || {};
    const u = this.primaryUnit;
    const beds = u.beds ?? u.bedrooms ?? info.beds ?? info.bedrooms;
    const baths = u.baths ?? u.bathrooms ?? info.baths ?? info.bathrooms;
    const code = info.unit_code || u.unit_code || u.code || info.unit || '';
    const rent = info.unitMarketRent || info.monthlyRent || u.market_rent || u.rent || '-';
    return {
      name: info.unit || u.name || u.unit_code || '-',
      location: info.location || info.address || info.property || '-',
      type: u.unit_type || info.unit_type || 'Apartment',
      beds: beds != null && beds !== '' ? `${beds} Bed` : '-',
      baths: baths != null && baths !== '' ? `${baths} Bath` : '-',
      rent,
      code: code || '-',
      occupancy: u.occupancy_status || info.unit_status || 'Occupied',
      activeLeases: u.active_leases_label || '1 Active Lease',
      id: info.unitcode || info.unit_id || u.id || u.code || code
    };
  }

  get leasePreview() {
    const info = this.leaseInfo || {};
    const name =
      info.renewedFrom ||
      info.previous_lease_name ||
      info.active_lease ||
      (info.id ? `Lease - ${info.id}- ${info.property || ''}`.trim() : '') ||
      '-';
    const start =
      info.previous_start_date ||
      info.startDate ||
      info.start_date ||
      info.from_date ||
      '';
    const end =
      info.previous_end_date ||
      info.endDate ||
      info.end_date ||
      info.to_date ||
      '';
    const rawStatus =
      info.previous_lease_status ||
      info.lease_status ||
      info.status_name ||
      info.status;
    const status =
      !rawStatus || /^\d+$/.test(String(rawStatus).trim())
        ? 'Completed'
        : String(rawStatus);
    const days = info.previous_days_left ?? info.leaseDaysLeft ?? info.days_left;
    return {
      name,
      status,
      property: info.property || '-',
      rent: info.previous_monthly_rent || info.monthlyRent || info.monthly_rent || '-',
      dateRange: start && end ? `${start} - ${end}` : start || end || '-',
      daysLeft:
        days != null && days !== ''
          ? String(days).toLowerCase().includes('day')
            ? String(days)
            : `${days} days left`
          : '-',
      id: info.renewed_from_id || info.previous_lease_id || info.renewedFromId || info.id || this.leaseId
    };
  }

  toggleEntityPreview(type: 'tenant' | 'property' | 'unit' | 'lease', event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showActionMenu = false;
    const trigger = event.currentTarget as HTMLElement;
    if (this.activeEntityPreview === type) {
      this.closeEntityPreview();
      return;
    }
    this.activeEntityPreview = type;
    this.previewTriggerEl = trigger;
    this.updatePreviewPosition(trigger);
    document.body.classList.add('lease-preview-open');
    // Ensure portal runs after *ngIf paints (ViewChild setter + delayed backup)
    queueMicrotask(() => this.portPreviewToBody());
    setTimeout(() => this.portPreviewToBody(), 0);
  }

  /** Move preview under <body> and keep it above page chrome / sticky thead. */
  private portPreviewToBody(el?: HTMLElement | null): void {
    const preview =
      el ||
      (document.querySelector('body > .lease-preview') as HTMLElement | null) ||
      (document.querySelector('app-lease-detail .lease-preview') as HTMLElement | null);
    if (!preview) {
      return;
    }
    if (preview.parentElement !== document.body) {
      document.body.appendChild(preview);
    }
    // Inline !important beats trapped stacking contexts / encapsulation gaps
    preview.style.setProperty('position', 'fixed', 'important');
    preview.style.setProperty('z-index', '20000', 'important');
    if (this.previewPanelStyle?.['top']) {
      preview.style.setProperty('top', this.previewPanelStyle['top'], 'important');
    }
    if (this.previewPanelStyle?.['left']) {
      preview.style.setProperty('left', this.previewPanelStyle['left'], 'important');
    }
    preview.style.setProperty('width', '320px', 'important');
    preview.style.setProperty('max-width', 'calc(100vw - 24px)', 'important');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('lease-preview-open');
    document.querySelectorAll('body > .lease-preview').forEach((node) => node.remove());
  }

  private closeEntityPreview(): void {
    this.activeEntityPreview = null;
    this.previewPanelStyle = null;
    this.previewTriggerEl = null;
    document.body.classList.remove('lease-preview-open');
  }

  private updatePreviewPosition(trigger: HTMLElement): void {
    const card = trigger.closest('.lease-info-card') as HTMLElement | null;
    const cardRect = (card || trigger).getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const popoverWidth = 320;
    const gap = 12;
    const viewportPad = 12;

    // Stay below the fixed page header (.app-header h-16 / z-49) — not under it
    const headerEl = document.querySelector('.app-header') as HTMLElement | null;
    const headerBottom = headerEl
      ? Math.ceil(headerEl.getBoundingClientRect().bottom)
      : 64;
    const minTop = headerBottom + 8;

    let left = cardRect.right + gap;
    let top = triggerRect.top - 8;

    if (left + popoverWidth > window.innerWidth - viewportPad) {
      left = Math.max(viewportPad, cardRect.left - popoverWidth - gap);
    }
    const maxTop = window.innerHeight - viewportPad - 360;
    top = Math.min(Math.max(minTop, top), Math.max(minTop, maxTop));

    this.previewPanelStyle = {
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      zIndex: '20000',
      width: '320px',
      maxWidth: 'calc(100vw - 24px)'
    };
    this.portPreviewToBody();
  }

  viewEntity(type: 'tenant' | 'property' | 'unit' | 'lease', event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.closeEntityPreview();
    switch (type) {
      case 'tenant': {
        const code = this.tenantPreview.code;
        this.router.navigate(code ? ['/contacts/tenants', code] : ['/contacts/tenants']);
        break;
      }
      case 'property': {
        const code = this.propertyPreview.code;
        this.router.navigate(code ? ['/properties', code] : ['/properties']);
        break;
      }
      case 'unit': {
        const id = this.unitPreview.id;
        this.router.navigate(id ? ['/units', id] : ['/units']);
        break;
      }
      case 'lease': {
        const id = this.leasePreview.id;
        if (id) {
          this.router.navigate(['/leases', id]);
        }
        break;
      }
    }
  }

  editEntity(type: 'tenant', event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.closeEntityPreview();
    const code = this.tenantPreview.code;
    this.router.navigate(code ? ['/contacts/tenants/edit-tenant', code] : ['/contacts/tenants']);
  }

  initializeTabs() {

    this.tabs = [
      { key: 'Overview', label: 'Overview', layout: 'content' },
      { key: 'Tenant', label: 'Tenant', layout: 'content' },
      { key: 'Financials', label: 'Financials', layout: 'content' },
      { key: 'Cheques', label: 'Cheques', layout: 'content' },
      {
        key: 'units',
        label: 'web.common.lblUnits',
        layout: 'content',
        data: this.unitsData,
        totalRecords: this.unitsData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Unit'
      },
      { key: 'Work Orders', label: 'Work Orders', layout: 'content' ,
      entity: "Lease",
      entity_id: this.leaseId,
      data: this.workOrdersData,
      totalRecords: this.workOrdersData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Workorders',
      form: this.Form
      },
      { 
        key: 'E-Documents', 
       label: 'E-Documents',
      layout: 'content',
      entity: "Lease",
      entity_id: this.leaseId,
      data: this.attachmentsData,
      totalRecords: this.attachmentsData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Attachments',
      form: this.Form,
      popupType: 'attachment' },
      {
        key: 'Notices',
        label: 'Notices',
        layout: 'content', 
        data: this.noticesData,
        totalRecords: this.noticesData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Broadcasts',
        redirect_addurl: '/broadcasts/create'
      }, 
      {
        key: 'attachments',
        label: 'web.common.lblAttachments',
        layout: 'content',
        entity: "Lease",
        entity_id: this.leaseId,
        data: this.attachmentsData,
        totalRecords: this.attachmentsData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.Form,
        popupType: 'attachment'
      },
      { key: 'Legal', label: 'Legal', layout: 'content' },
       {
        key: 'notes',
        label: 'web.common.lblNotes',
        layout: 'content',
        entity: "Lease",
        entity_id: this.leaseId,
        data: this.notesData,
        totalRecords: this.notesData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Notes',
        form: this.Form,
        popupType: 'notes'
      },
      { key: 'Inspections', label: 'Inspections', layout: 'content' } 

    ];

  }

  ngOnInit() {
    
    this.route.paramMap.subscribe(params => {
      this.leaseId = params.get('id') ?? '';
    });
    this.getLeaseDetails();
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  getLeaseDetails() {
    this.commontabservice.getMasterByType({
      typeId: 22,
      filterId: 0,
      filterText: this.leaseId,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.lease) {
            this.leaseInfo=res.objResult.lease[0]; 
            this.attachmentsData = res.objResult.documents|| [];   
            this.unitsData=res.objResult.units || [];
            this.tenantsData = res.objResult.tenants|| [];
            this.financialsData =  [];
            this.notesData = res.objResult.notes;  
            this.noticesData = res.objResult.broadcasts;
            this.inspectionsData = res.objResult.inspections;
            this.legalData = res.objResult.legal_cases;
            this.workOrdersData = res.objResult.workorders || []; 
            this.customFields= res.objResult.customFields || [];
            this.invoiceSchedules=res.objResult.payment_schedules || [];
            this.initializeTabs();
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }

  handleTabChange(tabKey: string) {
    this.activeTab = tabKey;
    this.showActionMenu = false;
    this.closeEntityPreview();
  }

  editLease() {
    this.showActionMenu = false;
    this.router.navigate(['/leases/edit-lease', this.leaseId]);
  }

  onLeaseAction(action: 'edit' | 'approval' | 'attachment' | 'note' | 'activity' | 'archive') {
    this.showActionMenu = false;
    switch (action) {
      case 'edit':
        this.editLease();
        break;
      case 'attachment':
        this.activeTab = 'attachments';
        setTimeout(() => this.detailLayout?.openModal(), 0);
        break;
      case 'note':
        this.activeTab = 'notes';
        setTimeout(() => this.detailLayout?.openModal(), 0);
        break;
      case 'approval':
      case 'activity':
      case 'archive':
      default:
        break;
    }
  }

  goBack() {
    this.router.navigate(['/leases']);
  }
}
