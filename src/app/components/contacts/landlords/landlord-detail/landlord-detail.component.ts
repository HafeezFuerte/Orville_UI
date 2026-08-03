import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component';

@Component({
  selector: 'app-landlord-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule, AttachmentsComponent, NotesComponent],
  templateUrl: './landlord-detail.component.html',
  styleUrl: './landlord-detail.component.scss'
})
export class LandlordDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesService);
  
  landlordId: any = null;
  landlordData: any = null;
  notesForm: any = {};
  attachmentsForm: any = {};

  get selectedTab(): any {
    if (this.activeTab === 'Notes') {
      return {
        key: 'notes',
        entity: 'landlord',
        entity_id: this.landlordId,
        data: this.noteData || [],
        form: this.notesForm
      };
    }
    if (this.activeTab === 'Attachments') {
      return {
        key: 'attachments',
        entity: 'landlord',
        entity_id: this.landlordId,
        data: this.attachmentData || [],
        form: this.attachmentsForm
      };
    }
    return null;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.landlordId = params['id'];
      if (this.landlordId) {
        this.getLandlordDetails();
      }
    });
  }

  getLandlordDetails() {
    const payload = {
      typeId: 28,
      filterId: 0,
      filterText: this.landlordId,
      filterText1: "",
      userId: Number(localStorage.getItem('userId')) || 1,
      clientId: "74BB6922",
      companyId: Number(localStorage.getItem('companyId')) || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          if (res.objResult.landlord_dtls && res.objResult.landlord_dtls.length > 0) {
            this.landlordData = res.objResult.landlord_dtls[0];
          } else if (res.objResult.landlords && res.objResult.landlords.length > 0) {
            this.landlordData = res.objResult.landlords[0];
          } else if (Array.isArray(res.objResult) && res.objResult.length > 0) {
            this.landlordData = res.objResult[0];
          }
          if (res.objResult.leases) this.transactionData = res.objResult.leases; // Map if needed
          if (res.objResult.note) this.noteData = res.objResult.note;
          if (res.objResult.documents) this.attachmentData = res.objResult.documents;
          if (res.objResult.emergency_dtls) this.emergencyContactData = res.objResult.emergency_dtls;
          if (res.objResult.units) this.unitData = res.objResult.units;
          
          console.log('Landlord Details Loaded:', this.landlordData);
        }
      },
      error: (err) => {
        console.error('Error fetching landlord details:', err);
      }
    });
  }
  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];

  activeTab = 'Wallet';
  tabs = ['Wallet', 'Units', 'Due Payment', 'Agreement', 'Chat', 'Attachments', 'Notes', 'User', 'Emergency Contact'];

  showPersonalDetails = true;
  showSubscriptionsModal = false;
  showActionDropdown = false;

  showInflowModal = false;
  showOutflowModal = false;
  showContributionModal = false;
  showDistributionModal = false;
  showAddNoteModal = false;
  showAddAttachmentModal = false;
  showAddUserModal = false;
  showAddEmergencyContactModal = false;

  // Landlord action dropdown options
  actionOptions = [
    { label: 'Edit Landlord', icon: 'ri-edit-line' },
    { label: 'Inflow', icon: 'ri-arrow-right-down-line' },
    { label: 'Outflow', icon: 'ri-arrow-left-up-line' },
    { label: 'Landlord Contribution', icon: 'ri-coins-line' },
    { label: 'Landlord Distribution', icon: 'ri-hand-coin-line' },
    { label: 'Add Notes', icon: 'ri-sticky-note-line' },
    { label: 'Add Attachment', icon: 'ri-attachment-line' },
    { label: 'Add User', icon: 'ri-user-add-line' },
    { label: 'Add Emergency Contact', icon: 'ri-phone-line' },
    { label: 'Add Broadcast', icon: 'ri-broadcast-line' },
    { label: 'Request for Approval', icon: 'ri-checkbox-circle-line' },
    { label: 'Send Email', icon: 'ri-mail-send-line' },
    { label: 'View Activity', icon: 'ri-history-line' },
    { label: 'Block Landlord', icon: 'ri-prohibit-line' },
    { label: 'Archive', icon: 'ri-archive-line' }
  ];

  // Email subscriptions list
  subscriptions = [
    { name: 'Cheque Due Reminder Email', subscribed: true },
    { name: 'Contract Auto Renewal', subscribed: true },
    { name: 'Contract Ending', subscribed: true },
    { name: 'Contract Send For Signature', subscribed: true },
    { name: 'Download HappyTenant Plus App Reminder', subscribed: true },
    { name: 'Facility Request Approved and New Work Order', subscribed: true },
    { name: 'Happy Birthday email', subscribed: true },
    { name: 'Hold Payment', subscribed: true },
    { name: 'Invoice Cleared', subscribed: false }
  ];

  // Landlord profile configurations & details
  landlord = {
    id: 31658,
    name: 'Orville Real Estate',
    email: 'rental@orvillerealestate.com',
    username: 'orville_real',
    verified: false,
    personal: {
      id: '31568',
      name: 'Orville Real Estate',
      email: 'rental@orvillerealestate.com',
      phone: '43332903',
      dob: '12-09-1995',
      maritalStatus: 'Single',
      nationality: 'India',
      address1: 'Dubai Marina, Tower A, Dubai',
      address2: 'Dubai Marina, Tower A, Dubai',
      country: 'United Arab Emirates',
      state: 'Dubai',
      city: 'Dubai',
      tag: 'Orville',
      profileVerified: false
    },
    wallet: {
      openingBalance: '0.0',
      openingBalanceDate: 'N/A',
      negativeBalanceAllowed: true,
      holdWalletMoney: true,
      includeSecurityDeposit: false,
      includeSecurityDepositNonLeasee: false,
      includeContributionWalletDeposit: true,
      moneyHeldBy: 'N/A'
    },
    bank: {
      name: 'ENBD Bank',
      address: 'Deira, Dubai',
      accountName: 'Orville Real Estate',
      swift: '-',
      iban: 'ENB0351496556322',
      accountNo: '125322878556984',
      sortCode: '66841'
    },
    signature: {
      autoSign: false,
      signatureAttached: false,
      authority: '-'
    }
  };

  // --- TAB 1: WALLET (Transaction Ledger) ---
  transactionColumns = [
    { key: 'InvoiceID', label: 'web.contacts.lblInvoiceID', visible: true },
    { key: 'Account', label: 'web.contacts.lblAccount', visible: true },
    { key: 'Property', label: 'web.contacts.lblProperty', visible: true },
    { key: 'Unit', label: 'web.contacts.lblUnit', visible: true },
    { key: 'heldBy', label: 'web.contacts.lblHeldBy', visible: true },
    { key: 'paidDate', label: 'web.contacts.lblPaidDate', visible: true },
    { key: 'tax', label: 'web.contacts.lblTax', visible: true },
    { key: 'grossCent', label: 'web.contacts.lblGrossCent', visible: true },
    { key: 'paid', label: 'web.contacts.lblPaid', visible: true },
    { key: 'runningBalance', label: 'web.contacts.lblRunningBalance', visible: true },
    { key: 'paymentVia', label: 'web.contacts.lblPaymentVia', visible: true, useTemplate: true }
  ];

  transactionData: any[] = [];

  // --- TAB 2: UNITS ---
  unitColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'Name', label: 'web.contacts.lblName', visible: true },
    { key: 'Category', label: 'web.contacts.lblCategory', visible: true },
    { key: 'Property', label: 'web.contacts.lblProperty', visible: true },
    { key: 'Landlord', label: 'web.contacts.lblLandlord', visible: true },
    { key: 'Tags', label: 'web.contacts.lblTags', visible: true },
    { key: 'unitType', label: 'web.contacts.lblUnitType', visible: true },
    { key: 'floorNumber', label: 'web.contacts.lblFloorNumber', visible: true },
    { key: 'managementFee', label: 'web.contacts.lblManagementFee', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'size', label: 'web.contacts.lblSize', visible: true },
    { key: 'marketRent', label: 'web.contacts.lblMarketRent', visible: true },
    { key: 'deposited', label: 'web.contacts.lblDeposited', visible: true },
    { key: 'published', label: 'web.contacts.lblPublished', visible: true, useTemplate: true },
    { key: 'forSale', label: 'web.contacts.lblForSale', visible: true, useTemplate: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  unitData: any[] = [];

  // --- TAB 3: DUE PAYMENT ---
  duePaymentColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'to', label: 'web.contacts.lblTo', visible: true },
    { key: 'unitCommonArea', label: 'web.contacts.lblUnitCommonArea', visible: true },
    { key: 'invoiceNumber', label: 'web.contacts.lblInvoiceNumber', visible: true },
    { key: 'chequeNo', label: 'web.contacts.lblChequeNo', visible: true },
    { key: 'invoiceDate', label: 'web.contacts.lblInvoiceDate', visible: true },
    { key: 'invoiceType', label: 'web.contacts.lblInvoiceType', visible: true },
    { key: 'account', label: 'web.contacts.lblAccount', visible: true },
    { key: 'currency', label: 'web.contacts.lblCurrency', visible: true },
    { key: 'propertyName', label: 'web.contacts.lblPropertyName', visible: true },
    { key: 'propertyId', label: 'web.contacts.lblPropertyId', visible: true },
    { key: 'leaseId', label: 'web.contacts.lblLeaseId', visible: true },
    { key: 'leaseStatus', label: 'web.contacts.lblLeaseStatus', visible: true },
    { key: 'note', label: 'web.contacts.lblNote', visible: true },
    { key: 'workOrder', label: 'web.contacts.lblWorkOrder', visible: true },
    { key: 'amount', label: 'web.contacts.lblAmount', visible: true },
    { key: 'grossAmount', label: 'web.contacts.lblGrossAmount', visible: true },
    { key: 'paid', label: 'web.contacts.lblPaid', visible: true },
    { key: 'paymentVia', label: 'web.contacts.lblPaymentVia', visible: true },
    { key: 'moneyHeldBy', label: 'web.contacts.lblMoneyHeldBy', visible: true },
    { key: 'ddRefNo', label: 'web.contacts.lblDdRefNo', visible: true },
    { key: 'bankName', label: 'web.contacts.lblBankName', visible: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'archived', label: 'web.contacts.lblArchived', visible: true },
    { key: 'dueDate', label: 'web.contacts.lblDueDate', visible: true },
    { key: 'paidDate', label: 'web.contacts.lblPaidDate', visible: true },
    { key: 'cheque', label: 'web.contacts.lblCheques', visible: true },
    { key: 'days', label: 'web.contacts.lblDays', visible: true },
    { key: 'writeAmountOff', label: 'web.contacts.lblWriteAmountOff', visible: true },
    { key: 'createdBy', label: 'web.contacts.lblCreatedBy', visible: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  duePaymentData: any[] = [];

  // --- TAB 4: AGREEMENTS ---
  agreements: any[] = [];

  // --- TAB 5: CHAT ---
  chatContacts: any[] = [];
  selectedContact = this.chatContacts[0];

  chatMessages: any[] = [];
  newMessageText = '';

  sendChatMessage() {
    if (this.newMessageText.trim()) {
      this.chatMessages.push({
        sender: 'You',
        text: this.newMessageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: true
      });
      this.newMessageText = '';
    }
  }

  // --- TAB 6: ATTACHMENTS ---
  attachmentColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'fileType', label: 'web.contacts.lblFileType', visible: true },
    { key: 'docId', label: 'web.contacts.lblDocId', visible: true },
    { key: 'status', label: 'web.contacts.lblDocumentStatus', visible: true, useTemplate: true },
    { key: 'issueDate', label: 'web.contacts.lblIssueDate', visible: true },
    { key: 'expiryDate', label: 'web.contacts.lblExpiryDate', visible: true },
    { key: 'files', label: 'web.contacts.lblFiles', visible: true, useTemplate: true },
    { key: 'share landlord', label: 'web.contacts.lblShareLandlord', visible: true, useTemplate: true },
    { key: 'share tenants', label: 'web.contacts.lblShareTenants', visible: true, useTemplate: true },
    { key: 'uploadedBy', label: 'web.contacts.lblUploadedBy', visible: true },
    { key: 'createdAt', label: 'web.contacts.lblCreatedAt', visible: true },
    { key: 'updatedAt', label: 'web.contacts.lblUpdatedAt', visible: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  attachmentData: any[] = [];

  // --- TAB 7: NOTES ---
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

  // --- TAB 8: USER ---
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
    { key: 'Actions', label: 'web.contacts.lblActions', visible: true, useTemplate: true },

  ];

  userData: any[] = [];

  // --- TAB 9: EMERGENCY CONTACT ---
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
    { key: 'Actions', label: 'web.contacts.lblActions', visible: true, useTemplate: true },

  ];

  emergencyContactData: any[] = [];

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
