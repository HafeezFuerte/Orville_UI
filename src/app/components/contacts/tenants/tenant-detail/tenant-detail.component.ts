import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../../portfolio/services/properties.service';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule],
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss'
})
export class TenantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesService);
  
  tenantId: any = null;
  tenantData: any = null;

  ngOnInit() {
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
      clientId: localStorage.getItem('clientId') || "74BB6922",
      companyId: Number(localStorage.getItem('companyId')) || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          if (res.objResult.tenant_dtls && res.objResult.tenant_dtls.length > 0) {
            this.tenantData = res.objResult.tenant_dtls[0];
          }
          if (res.objResult.leases) this.leaseData = res.objResult.leases;
          if (res.objResult.note) this.noteData = res.objResult.note;
          if (res.objResult.documents) this.attachmentData = res.objResult.documents;
          if (res.objResult.emergency_dtls) this.emergencyContactData = res.objResult.emergency_dtls;
          
          console.log('Tenant Details Loaded:', this.tenantData);
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
    { label: 'Edit Tenant', icon: 'ri-edit-line' },
    { label: 'Add Lease', icon: 'ri-file-add-line' },
    { label: 'Add Attachment', icon: 'ri-attachment-line' },
    { label: 'Add User', icon: 'ri-user-add-line' },
    { label: 'Add Emergency Contact', icon: 'ri-phone-line' },
    { label: 'Add Broadcast', icon: 'ri-broadcast-line' },
    { label: 'Send Email', icon: 'ri-mail-send-line' },
    { label: 'View activity', icon: 'ri-history-line' },
    { label: 'Unlock Tenant', icon: 'ri-lock-unlock-line' },
    { label: 'Archive Tenant', icon: 'ri-archive-line' }
  ];

  subscriptions = [
    { name: 'Document Expiry Email', subscribed: true },
    { name: 'Lease Expiry Reminder Email', subscribed: true },
    { name: 'Tenant Session Report', subscribed: true },
    { name: 'Delayed Rent Reminder email', subscribed: true },
    { name: 'Invoice Cleared via Cheque', subscribed: true },
    { name: 'Confirmed Reservation', subscribed: true },
    { name: 'Happy Birthday email', subscribed: true },
    { name: 'Invoice Cleared', subscribed: true },
    { name: 'Welcome to Tenant agreement', subscribed: false }
  ];

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
    { key: 'Timezone', label: 'web.contacts.lblTimezone', visible: true, useTemplate: true },
    { key: 'Country', label: 'web.contacts.lblCountry', visible: true, useTemplate: true },
    { key: 'Default', label: 'web.contacts.lblDefault', visible: true, useTemplate: true },
    { key: 'Created', label: 'web.contacts.lblCreated', visible: true, useTemplate: true },
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
