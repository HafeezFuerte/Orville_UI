import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component';
import { EmailSubscriptionsDrawerComponent } from '../../../../shared/components/email-subscriptions-drawer/email-subscriptions-drawer.component';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule, AttachmentsComponent, NotesComponent, EmailSubscriptionsDrawerComponent],
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss'
})
export class TenantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @ViewChild(AttachmentsComponent) attachmentsTable!: AttachmentsComponent;
  @ViewChild(NotesComponent) notesTable!: NotesComponent;
  
  tenantId: any = null;
  tenantData: any = null;
  notesForm!: FormGroup;
  attachmentsForm!: FormGroup;

  tabsList: any[] = [];

  initializeTabs() {
    this.tabsList = [
      {
        key: 'Notes',
        label: 'Notes',
        entity: 'tenant',
        entity_id: this.tenantId,
        data: this.noteData || [],
        totalRecords: (this.noteData || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Notes',
        form: this.notesForm,
        popupType: 'notes'
      },
      {
        key: 'Attachments',
        label: 'Attachments',
        entity: 'tenant',
        entity_id: this.tenantId,
        data: this.attachmentData || [],
        totalRecords: (this.attachmentData || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.attachmentsForm,
        popupType: 'attachment'
      }
    ];
  }

  get selectedTab(): any {
    return this.tabsList.find(t => t.key === this.activeTab);
  }

  ngOnInit() {
    this.notesForm = this.fb.group({
      subject: ['', Validators.required],
      description: ['', Validators.required],
      channel_type: [''],
      note_date: [''],
      code: ['']
    });
    this.attachmentsForm = this.fb.group({
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      issueDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      issuingAuthority: [''],
      shareWithTenant: [''],
      shareWithLandlord: [''],
      propertyAttachment: [''],
      code: ['']
    });
    this.initializeTabs();
    this.route.params.subscribe(params => {
      this.tenantId = params['id'];
      if (this.tenantId) {
        this.getTenantDetails();
      }
    });
  }

  getTenantDetails() {
    const payload = {
      typeId: 27,
      filterId: 0,
      filterText: this.tenantId,
      filterText1: "",
      userId: Number(localStorage.getItem('userId')) || 1,
      clientId: "74BB6922",
      companyId: Number(localStorage.getItem('companyId')) || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const result = res.objResult;
          let tenantObj: any = null;
          if (result.table && result.table[0]) {
            tenantObj = result.table[0];
          } else if (result.tenant_dtls && result.tenant_dtls[0]) {
            tenantObj = result.tenant_dtls[0];
          } else if (result.tenants && result.tenants[0]) {
            tenantObj = result.tenants[0];
          } else {
            const arrayKey = Object.keys(result).find(key => Array.isArray(result[key]) && result[key].length > 0 && key !== 'leases' && key !== 'note' && key !== 'notes' && key !== 'documents' && key !== 'emergency_dtls');
            if (arrayKey) {
              tenantObj = result[arrayKey][0];
            }
          }
          this.tenantData = tenantObj;

          if (result.leases) this.leaseData = result.leases;
          if (result.notes) this.noteData = result.notes;
          else if (result.note) this.noteData = result.note;
          if (result.documents) this.attachmentData = result.documents;
          if (result.emergency_dtls) this.emergencyContactData = result.emergency_dtls;
          if (result.users) this.userData = result.users;
          
          console.log('Tenant Details Loaded:', this.tenantData);
          this.initializeTabs();
        }
      },
      error: (err) => {
        console.error('Error fetching tenant details:', err);
      }
    });
  }

  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];

  activeTab = 'Statement';
  tabs = ['Statement', 'Leases', 'Attachments', 'Notes', 'Users', 'Emergency Contact'];

  autoSchedule = false;

  showActionDropdown = false;
  showSubscriptionsModal = false;
  showAddLeaseModal = false;
  showAddAttachmentModal = false;
  showAddUserModal = false;
  showAddEmergencyContactModal = false;
  showAddBroadcastModal = false;
  showSendEmailModal = false;
  showAddNoteModal = false;

  actionOptions = [
    { label: 'Edit Tenant', icon: 'ri-pencil-line', asset: 'assets/images/action-menu/pencil.svg' },
    { label: 'Add Lease', icon: 'ri-file-text-line', asset: 'assets/images/action-menu/file-invoice.svg' },
    { label: 'Add Attachment', icon: 'ri-attachment-2', asset: 'assets/images/action-menu/paperclip.svg' },
    { label: 'Add Notes', icon: 'ri-file-text-line', asset: 'assets/images/action-menu/file-invoice.svg' },
    { label: 'Add User', icon: 'ri-user-add-line' },
    { label: 'Add Emergency Contact', icon: 'ri-phone-line' },
    { label: 'Add Broadcast', icon: 'ri-broadcast-line' },
    { label: 'Send Email', icon: 'ri-mail-line' },
    { label: 'View activity', icon: 'ri-time-line', asset: 'assets/images/action-menu/clock.svg' },
    { label: 'Unblock Tenant', icon: 'ri-forbid-line' },
    { label: 'Archive Tenant', icon: 'ri-delete-bin-line', asset: 'assets/images/action-menu/archive.svg', danger: true }
  ];

  get hasDangerAction(): boolean {
    return this.actionOptions.some((o: any) => o.danger);
  }

  onTenantAction(label: string): void {
    this.showActionDropdown = false;
    if (label === 'Edit Tenant') {
      this.router.navigate(['/contacts/tenants/edit-tenant', this.tenantId]);
      return;
    }
    if (label === 'Add Lease') {
      this.router.navigate(['/leases/create'], { queryParams: { tenantCode: this.tenantId } });
      return;
    }
    else if (label === 'Add Attachment') {
      this.activeTab = 'Attachments';
      this.initializeTabs();
      setTimeout(() => this.attachmentsTable?.openModal(), 0);
    }
    else if (label === 'Add Notes') {
      this.activeTab = 'Notes';
      this.initializeTabs();
      setTimeout(() => this.notesTable?.openModal(), 0);
    }
    else if (label === 'Add User') {
      this.activeTab = 'Users';
      this.showAddUserModal = true;
    }
    else if (label === 'Add Emergency Contact') {
      this.activeTab = 'Emergency Contact';
      this.showAddEmergencyContactModal = true;
    }
    else if (label === 'Add Broadcast') this.showAddBroadcastModal = true;
    else if (label === 'Send Email') this.showSendEmailModal = true;
  }

  // Email subscriptions — Figma 1467:58437 (mostly unsubscribed; Welcome subscribed)
  subscriptions = [
    { name: 'Document Expiry Email', subscribed: false },
    { name: 'Lease Ending Reminder Email', subscribed: false },
    { name: 'Tenant Snaglist Report', subscribed: false },
    { name: 'Delayed Rent Reminder email', subscribed: false },
    { name: 'Invoice Cleared via Cheque', subscribed: false },
    { name: 'Confirmed Reservation', subscribed: false },
    { name: 'Happy Birthday email', subscribed: false },
    { name: 'Invoice Cleared', subscribed: false },
    { name: 'Welcome to Orville app email', subscribed: true },
    { name: 'Tenant E-sign lease email', subscribed: false },
    { name: 'Bounced cheque email', subscribed: false },
    { name: 'New invoice added', subscribed: false },
    { name: 'Download HappyTenant Plus App Reminder', subscribed: false },
    { name: 'Tenant Work Order Reminder email', subscribed: false },
    { name: 'Tenant Request Update', subscribed: false },
    { name: 'Welcome to Tenant agreement', subscribed: false },
    { name: 'New Broadcast Email', subscribed: false },
    { name: 'Payment Completed', subscribed: false },
    { name: 'Late Payment Notice', subscribed: false },
    { name: 'Lease Start', subscribed: false },
    { name: 'Lease Renewal', subscribed: false },
    { name: 'Hold Payment', subscribed: false },
    { name: 'Partial Payment Received', subscribed: false },
    { name: 'Write Off Invoice', subscribed: false },
    { name: 'Bounced cheque replacement reminder', subscribed: false },
    { name: 'Cheque Due Reminder Email', subscribed: false },
    { name: 'Contract Ending', subscribed: false },
    { name: 'Facility Request Approved and New Work Order', subscribed: false },
    { name: 'New Ticket email', subscribed: false },
    { name: 'Ticket Approval email', subscribed: false },
    { name: 'Quotation Status', subscribed: false },
    { name: 'Lease Completed', subscribed: false },
    { name: 'Lease Send for Sign in Bulk email', subscribed: false },
    { name: 'New Request for Approval', subscribed: false },
    { name: 'Contract Auto Renewal', subscribed: false },
    { name: 'Contract Send For Signature', subscribed: false },
    { name: 'SPA Lease Send for Signature email', subscribed: false },
    { name: 'Send Lease for Landlord Signature email', subscribed: false },
    { name: 'Welcome to HappyTenant Plus App', subscribed: false },
    { name: 'Late Fee Notice', subscribed: false }
  ];

  get subscriptionSubscribedCount(): number {
    return this.subscriptions.filter((s) => s.subscribed).length;
  }

  get allSubscriptionsSelected(): boolean {
    return this.subscriptions.length > 0 && this.subscriptions.every(s => s.subscribed);
  }

  toggleAllSubscriptions(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.subscriptions.forEach(s => (s.subscribed = checked));
  }

  // --- TAB 1: STATEMENT ACTIVITY ---
  statementColumns = [
    { key: 'invoiceId', label: 'web.contacts.lblInvoiceID', visible: true, useTemplate: true },
    { key: 'transactionId', label: 'web.contacts.lblTransactionId', visible: true },
    { key: 'property', label: 'web.contacts.lblProperty', visible: true },
    { key: 'unit', label: 'web.contacts.lblUnit', visible: true },
    { key: 'bankName', label: 'web.contacts.lblBankName', visible: true },
    { key: 'Cheque No', label: 'web.contacts.lblChequeNo', visible: true },

    { key: 'category', label: 'web.contacts.lblCategory', visible: true },
    { key: 'paidDate', label: 'web.contacts.lblPaidDate', visible: true },
    { key: 'dueDate', label: 'web.contacts.lblDueDate', visible: true },

    { key: 'mode', label: 'web.contacts.lblMode', visible: true },
    { key: 'debit', label: 'web.contacts.lblAmount', visible: true },
    { key: 'credit', label: 'web.contacts.lblPaid', visible: true },
    { key: 'balance', label: 'web.contacts.lblBalance', visible: true }

  ];

  statementData: any[] = [];

  // --- TAB 2: LEASES ---
  leaseColumns = [
    { key: 'lease_code', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'active_lease', label: 'web.contacts.lblLeaseName', visible: true },
    { key: 'tenant', label: 'web.contacts.lblTenant', visible: true },
    { key: 'email_address', label: 'web.contacts.lblEmail', visible: true },
    { key: 'phone_number', label: 'web.contacts.lblPhoneNumber', visible: true },
    { key: 'company_name', label: 'web.contacts.lblCompany', visible: true }
  ];

  leaseData: any[] = [];

  // --- TAB 3: ATTACHMENTS ---
  attachmentColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'fileType', label: 'web.contacts.lblFileType', visible: true },
    { key: 'docId', label: 'web.contacts.lblDocId', visible: true },
    { key: 'status', label: 'web.contacts.lblDocumentStatus', visible: true, useTemplate: true },
    { key: 'issueDate', label: 'web.contacts.lblIssueDate', visible: true },
    { key: 'expiryDate', label: 'web.contacts.lblExpiryDate', visible: true },
    { key: 'files', label: 'web.contacts.lblFiles', visible: true, useTemplate: true },
    { key: 'UploadedBy', label: 'web.contacts.lblUploadedBy', visible: true, useTemplate: true },

    { key: 'share landlord', label: 'web.contacts.lblShareLandlord', visible: true, useTemplate: true },
    { key: 'share tenants', label: 'web.contacts.lblShareTenants', visible: true, useTemplate: true },
    { key: 'createdAt', label: 'web.contacts.lblCreatedAt', visible: true },
    { key: 'updatedAt', label: 'web.contacts.lblUpdatedAt', visible: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  attachmentData: any[] = [];

  // --- TAB 4: NOTES ---
  noteColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true },
    { key: 'subject', label: 'web.contacts.lblSubject', visible: true },
    { key: 'content', label: 'web.contacts.lblContent', visible: true },
    { key: 'via', label: 'web.contacts.lblVia', visible: true, useTemplate: true },
    { key: 'noteDate', label: 'web.contacts.lblNoteDate', visible: true },
    { key: 'created_by', label: 'web.contacts.lblCreatedBy', visible: true },
    { key: 'Files', label: 'web.contacts.lblFiles', visible: true },
    { key: 'created_at', label: 'web.contacts.lblCreatedAt', visible: true },
    { key: 'updated_at', label: 'web.contacts.lblUpdatedAt', visible: true },
    { key: 'Action', label: 'web.contacts.lblAction', visible: true }
  ];

  noteData: any[] = [];

  // --- TAB 5: USERS ---
  userColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true },
    { key: 'userName', label: 'web.contacts.lblUserName', visible: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true },
    { key: 'phone', label: 'web.contacts.lblPhoneNumber', visible: true },
    { key: 'role', label: 'web.contacts.lblRole', visible: true },
    { key: 'type', label: 'web.contacts.lblType', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'Timezone', label: 'web.contacts.lblTimezone', visible: true },
    { key: 'Country', label: 'web.contacts.lblCountry', visible: true },
    { key: 'Default', label: 'web.contacts.lblDefault', visible: true },
    { key: 'Created', label: 'web.contacts.lblCreated', visible: true },
    { key: 'Actions', label: 'web.contacts.lblActions', visible: true, useTemplate: true }
  ];

  userData: any[] = [];

  // --- TAB 6: EMERGENCY CONTACT ---
  emergencyContactColumns = [
    { key: 'user_code', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'column1', label: 'web.contacts.lblName', visible: true },
    { key: 'username', label: 'web.contacts.lblUserName', visible: true },
    { key: 'phone', label: 'web.contacts.lblPhoneNumber', visible: true },
    { key: 'email_address', label: 'web.contacts.lblEmail', visible: true },
    { key: 'role_name', label: 'web.contacts.lblRole', visible: true },
    { key: 'time_zone', label: 'web.contacts.lblTimezone', visible: true },
    { key: 'is_active', label: 'web.contacts.lblStatus', visible: true, useTemplate: true }
  ];

  emergencyContactData: any[] = [];

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
