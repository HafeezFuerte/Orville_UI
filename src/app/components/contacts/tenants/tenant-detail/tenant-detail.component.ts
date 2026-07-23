import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule],
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss'
})
export class TenantDetailComponent {
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

  statementData = [
    { invoiceId: 'INV-26-00063069', transactionId: '-', property: 'Sunrise Apartments', tags: '-', unit: '306-PR-2', bankName: 'ABC Bank', category: 'Income', paidDate: '12-07-2026', summary: 'Monthly rent payment', propertyId: '982736', leaseId: '2234', mode: 'Bank Transfer', dueDate: '15-07-2026', debit: 'AED 3,000.00', credit: 'AED 0.00', balance: 'AED 3,000.00', chequeNo: '4365239', type: 'Rent' },
    { invoiceId: 'INV-26-00063069', transactionId: '3482833', property: 'Green Heights', tags: '-', unit: '305-PR-2', bankName: 'ENBD Bank', category: 'Income', paidDate: '12-07-2026', summary: 'Service charge payment', propertyId: '982737', leaseId: '2235', mode: 'Cash', dueDate: '15-07-2026', debit: 'AED 3,000.00', credit: 'AED 3,000.00', balance: 'AED 0.00', chequeNo: '4325339', type: 'Rent' }
  ];

  // --- TAB 2: LEASES ---
  leaseColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'leaseName', label: 'web.contacts.lblLeaseName', visible: true },
    { key: 'tenant', label: 'web.contacts.lblTenant', visible: true },
    { key: 'legalCase', label: 'web.contacts.lblLegalCase', visible: true },
    { key: 'unit', label: 'web.contacts.lblUnit', visible: true },
    { key: 'property', label: 'web.contacts.lblProperty', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'rent', label: 'web.contacts.lblrent(AED)', visible: true },
    { key: 'startDate', label: 'web.contacts.lblIssueDate', visible: true },
   
    { key: 'endDate', label: 'web.contacts.lblExpiryDate', visible: true },
    { key: 'renewed', label: 'web.contacts.lblRenewed?', visible: true },
    { key: 'multiUnit', label: 'web.contacts.lblMultiUnit?', visible: true },
    { key: 'created', label: 'web.contacts.lblCreatedAt', visible: true },
     { key: 'remarks', label: 'web.contacts.lblRemarks', visible: true },
    { key: 'createdBy', label: 'web.contacts.lblCreatedBy', visible: true },
    { key: 'InternalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  leaseData = [
    { id: '31658', leaseName: 'Lease - 31658 - Marina Heights Towers', tenant: 'James T. Hirsi', legalCase: 'No', unit: 'Apartment 203-PR-4', property: 'Marina Heights Towers', status: 'Active', rent: 'AED 2,500.00', startDate: '01-01-2026', internalStatus: 'All', createdBy: 'Admin', remarks: '-', endDate: '31-12-2026', renewed: 'No', multiUnit: 'No', created: '12-07-2024' },
    { id: '31658', leaseName: 'Lease - 31658 - Marina Heights Towers', tenant: 'Mya Thanit', legalCase: 'No', unit: 'Apartment 203-PR-4', property: 'Marina Heights Towers', status: 'Active', rent: 'AED 2,500.00', startDate: '01-01-2026', internalStatus: 'All', createdBy: 'Admin', remarks: '-', endDate: '31-12-2026', renewed: 'No', multiUnit: 'No', created: '12-07-2024' }
  ];

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

  attachmentData = [
    { id: 'ATT-1001', fileType: 'Passport Copy', docId: 'DOC-1001', status: 'Active', issueDate: '12-07-2024', expiryDate: '12-07-2026', files: 'passport.pdf', uploadedBy: 'Admin', createdAt: '12-07-2024', updatedAt: '12-07-2024' },
    { id: 'ATT-1001', fileType: 'Trade License', docId: 'DOC-1002', status: 'Verified', issueDate: '12-07-2024', expiryDate: '12-07-2026', files: 'license.pdf', uploadedBy: 'Admin', createdAt: '12-07-2024', updatedAt: '12-07-2024' }
  ];

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

  noteData = [
    { id: '31658', subject: 'Move-in condition', content: 'Tenant reported minor paint marks near the living room window. Schedule touch-up.....', via: 'Portal', noteDate: '12-01-2026', created_by: 'Admin User', files: 'movein_condition.pdf', created_at: '12-01-2026', updated_at: '12-01-2026' },
    { id: '31658', subject: 'Rent reminder', content: 'Friendly reminder sent to tenant regarding upcoming rent payment due on the first wo...', via: 'Email', noteDate: '12-01-2026', created_by: 'Property Manager', files: 'rent_reminder.pdf', created_at: '12-01-2026', updated_at: '12-01-2026' }
  ];

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

  userData = [
    { id: '31658', name: 'Ahmad Yasmin', userName: 'Ahmadyasmin', email: 'ahmadyasmin@mail.com', phone: '0528613568', role: 'Tenant', type: 'Tenant ID: 65584', status: 'Active' },
    { id: '31658', name: 'Ahmad Yasmin', userName: 'Ahmadyasmin', email: 'ahmadyasmin@mail.com', phone: '0528613568', role: 'Tenant', type: 'Tenant ID: 65584', status: 'Active' }
  ];

  // --- TAB 6: EMERGENCY CONTACT ---
  emergencyContactColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true },
    { key: 'relation', label: 'web.contacts.lblRelation', visible: true },
    { key: 'phone', label: 'web.contacts.lblPhoneNumber', visible: true },
    { key: 'workPhone', label: 'web.contacts.lblWorkPhone', visible: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'includeInEmail', label: 'web.contacts.lblIncludeInEmail', visible: true, useTemplate: true },
    { key: 'Contactable Name', label: 'web.contacts.lblContactableName', visible: true, useTemplate: true },
    { key: 'Created_at', label: 'web.contacts.lblCreated', visible: true, useTemplate: true },
    { key: 'Actions', label: 'web.contacts.lblActions', visible: true, useTemplate: true }
  ];

  emergencyContactData = [
    { id: '31658', name: 'Zaid Rehman', relation: 'Brother', phone: '0528613568', workPhone: '05698 253 25', email: 'zaidrahman@gmail.com', includeInEmail: 'Yes' }
  ];

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
