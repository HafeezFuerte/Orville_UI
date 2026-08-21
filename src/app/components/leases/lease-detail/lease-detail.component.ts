import { Component, OnInit, inject } from '@angular/core';
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
@Component({
  selector: 'app-lease-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,WorkordersTableComponent,BroadcastsTableComponent, TranslateModule,UnitsTableComponent, DetailPageLayoutComponent, SharedTableComponent, NotesComponent, AttachmentsComponent],
  templateUrl: './lease-detail.component.html',
  styleUrl: './lease-detail.component.scss'
})
export class LeaseDetailComponent implements OnInit {
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

  // Sidebar / Left panel metadata
  leaseInfo: any = {}; 
  // Sub-grid columns
  invoiceColumns = [ 
    { key: 'amt', label: 'Amount' +' ('+ this.currentUser?.currencyCode + ' )', visible: true, useTemplate: true },
    { key: 'adv_amt', label: 'Adv.Amount'+' ('+ this.currentUser?.currencyCode + ' )', visible: true, useTemplate: true },
    { key: 'account_name', label: 'web.leases.lblAccount', visible: true,useTemplate: true },
    { key: 'due_date', label: 'web.leases.lblEndDate', visible: true,useTemplate: true },
    { key: 'recurring_cycle', label: 'web.leases.lblRecurringCycle', visible: true, useTemplate: true },
    { key: 'payment_type', label: 'Payment Type', visible: true,useTemplate: true },
    { key: 'attachment_path', label: 'Attachment', visible: true,useTemplate: true }
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
    { key: 'createdAt', label: 'web.leases.lblCreated', visible: true }
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
    { key: 'escalationOption', label: 'web.leases.lblEscalationOption', visible: true },
    { key: 'property', label: 'web.leases.lblProperty', visible: true },
    { key: 'unit', label: 'web.leases.lblUnit', visible: true },
    { key: 'lease', label: 'web.common.lblLeases', visible: true },
    { key: 'unitBlocked', label: 'web.leases.lblUnitBlocked', visible: true, useTemplate: true },
    { key: 'tenantBlocked', label: 'web.leases.lblTenantBlocked', visible: true, useTemplate: true },
    { key: 'hearingsCount', label: 'web.leases.lblHearingsCount', visible: true },
    { key: 'attachmentsCount', label: 'web.leases.lblAttachmentsCount', visible: true },
    { key: 'notesCount', label: 'web.leases.lblNotesCount', visible: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true }
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
  }

  editLease() {
    this.router.navigate(['/leases/edit-lease', this.leaseId]);
  }

  goBack() {
    this.router.navigate(['/leases']);
  }
}
