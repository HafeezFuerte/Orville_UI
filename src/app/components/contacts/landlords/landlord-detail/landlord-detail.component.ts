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

  tabsList: any[] = [];

  initializeTabs() {
    this.tabsList = [
      {
        key: 'Notes',
        label: 'Notes',
        entity: 'landlord',
        entity_id: this.landlordId,
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
        entity: 'landlord',
        entity_id: this.landlordId,
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
    this.initializeTabs();
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
          const result = res.objResult;
          let landlordObj: any = null;
          if (result.table && result.table[0]) {
            landlordObj = result.table[0];
          } else if (result.landlord_dtls && result.landlord_dtls[0]) {
            landlordObj = result.landlord_dtls[0];
          } else if (result.landlords && result.landlords[0]) {
            landlordObj = result.landlords[0];
          } else {
            const arrayKey = Object.keys(result).find(key => Array.isArray(result[key]) && result[key].length > 0 && key !== 'leases' && key !== 'note' && key !== 'documents' && key !== 'emergency_dtls' && key !== 'units');
            if (arrayKey) {
              landlordObj = result[arrayKey][0];
            }
          }
          this.landlordData = landlordObj;
          if (res.objResult.leases) this.transactionData = res.objResult.leases; // Map if needed
          if (res.objResult.note) this.noteData = res.objResult.note;
          if (res.objResult.documents) this.attachmentData = res.objResult.documents;
          if (res.objResult.emergency_dtls) this.emergencyContactData = res.objResult.emergency_dtls;
          if (res.objResult.units) this.unitData = res.objResult.units;
          
          if (this.landlordData) {
            const data = this.landlordData;
            this.landlord.id = data.id || this.landlord.id;
            this.landlord.name = data.landlord || data.company_name || (data.first_name ? (data.first_name + ' ' + (data.last_name || '')) : '') || this.landlord.name;
            this.landlord.email = data.email_address || data.email || this.landlord.email;
            this.landlord.username = data.username || this.landlord.username;
            this.landlord.personal.id = String(data.id || this.landlord.personal.id);
            this.landlord.personal.name = data.landlord || (data.first_name ? (data.first_name + ' ' + (data.last_name || '')) : '') || this.landlord.personal.name;
            this.landlord.personal.email = data.email_address || data.email || this.landlord.personal.email;
            this.landlord.personal.phone = data.phone_number || data.mobile_no || this.landlord.personal.phone;
            this.landlord.personal.nationality = data.nationality || this.landlord.personal.nationality;
            this.landlord.personal.address1 = data.address1 || this.landlord.personal.address1;
            this.landlord.personal.address2 = data.address2 || this.landlord.personal.address2;
            this.landlord.personal.country = data.country || data.country_id || this.landlord.personal.country;
            this.landlord.personal.state = data.state || data.stateid || this.landlord.personal.state;
            this.landlord.personal.city = data.city || this.landlord.personal.city;
            this.landlord.personal.tag = data.trade_license || this.landlord.personal.tag;

            // Map Wallet Settings
            this.landlord.wallet.openingBalance = data.opening_balance || this.landlord.wallet.openingBalance;
            this.landlord.wallet.openingBalanceDate = data.opening_balance_date || this.landlord.wallet.openingBalanceDate;
            this.landlord.wallet.negativeBalanceAllowed = data.negative_balances !== undefined ? data.negative_balances : this.landlord.wallet.negativeBalanceAllowed;
            this.landlord.wallet.holdWalletMoney = data.auto_hold_amount_in_wallet !== undefined ? data.auto_hold_amount_in_wallet : this.landlord.wallet.holdWalletMoney;
            this.landlord.wallet.includeSecurityDeposit = data.security_deposit_leases !== undefined ? data.security_deposit_leases : this.landlord.wallet.includeSecurityDeposit;
            this.landlord.wallet.includeSecurityDepositNonLeasee = data.security_deposit_non_leases !== undefined ? data.security_deposit_non_leases : this.landlord.wallet.includeSecurityDepositNonLeasee;
            this.landlord.wallet.includeContributionWalletDeposit = data.landlord_contribution !== undefined ? data.landlord_contribution : this.landlord.wallet.includeContributionWalletDeposit;

            // Map Bank Details
            if (data.bankdtls) {
              this.landlord.bank.name = data.bankdtls.bank_name || this.landlord.bank.name;
              this.landlord.bank.address = data.bankdtls.bank_address || this.landlord.bank.address;
              this.landlord.bank.accountName = data.bankdtls.account_name || this.landlord.bank.accountName;
              this.landlord.bank.swift = data.bankdtls.code_swift || this.landlord.bank.swift;
              this.landlord.bank.iban = data.bankdtls.iban || this.landlord.bank.iban;
              this.landlord.bank.accountNo = data.bankdtls.account_no || this.landlord.bank.accountNo;
              this.landlord.bank.sortCode = data.bankdtls.sort_code || this.landlord.bank.sortCode;
            } else {
              this.landlord.bank.name = data.bank_name || this.landlord.bank.name;
              this.landlord.bank.address = data.bank_address || this.landlord.bank.address;
              this.landlord.bank.swift = data.code_swift || data.swift || this.landlord.bank.swift;
              this.landlord.bank.iban = data.iban || this.landlord.bank.iban;
              this.landlord.bank.accountNo = data.account_no || this.landlord.bank.accountNo;
              this.landlord.bank.sortCode = data.sort_code || this.landlord.bank.sortCode;
            }

            // Map Signature Settings
            this.landlord.signature.autoSign = data.is_auto_sign_leases !== undefined ? data.is_auto_sign_leases : this.landlord.signature.autoSign;
            this.landlord.signature.signatureAttached = !!data.signature_path;
          }

          console.log('Landlord Details Loaded:', this.landlordData);
          this.initializeTabs();
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

  // Landlord action dropdown options (Figma landlord-detail Action menu)
  actionOptions: {
    label: string;
    icon: string;
    asset?: string;
    danger?: boolean;
    dangerIcon?: boolean;
  }[] = [
    { label: 'Edit Landlord', icon: 'ri-pencil-line', asset: 'assets/images/action-menu/pencil.svg' },
    { label: 'Inflow', icon: 'ri-download-line' },
    { label: 'Outflow', icon: 'ri-upload-line' },
    { label: 'Landlord Contribution', icon: 'ri-pie-chart-line' },
    { label: 'Landlord Distribution', icon: 'ri-git-branch-line' },
    { label: 'Add Notes', icon: 'ri-file-text-line', asset: 'assets/images/action-menu/file-invoice.svg' },
    { label: 'Add Attachment', icon: 'ri-attachment-2', asset: 'assets/images/action-menu/paperclip.svg' },
    { label: 'Add User', icon: 'ri-user-add-line' },
    { label: 'Add Emergency Contact', icon: 'ri-phone-line' },
    { label: 'Add Broadcast', icon: 'ri-broadcast-line' },
    { label: 'Request for Approval', icon: 'ri-checkbox-line' },
    { label: 'Send Email', icon: 'ri-mail-line' },
    { label: 'View Activity', icon: 'ri-time-line', asset: 'assets/images/action-menu/clock.svg' },
    { label: 'Block Landlord', icon: 'ri-forbid-line', dangerIcon: true },
    { label: 'Archive', icon: 'ri-delete-bin-line', asset: 'assets/images/action-menu/archive.svg', danger: true }
  ];

  get hasDangerAction(): boolean {
    return this.actionOptions.some((o: any) => o.danger);
  }

  onLandlordAction(label: string): void {
    this.showActionDropdown = false;
    if (label === 'Edit Landlord') {
      window.location.href = '/contacts/landlords/edit-landlord/' + this.landlordId;
      return;
    }
    if (label === 'Inflow') this.showInflowModal = true;
    else if (label === 'Outflow') this.showOutflowModal = true;
    else if (label === 'Landlord Contribution') this.showContributionModal = true;
    else if (label === 'Landlord Distribution') this.showDistributionModal = true;
    else if (label === 'Add Notes') this.showAddNoteModal = true;
    else if (label === 'Add Attachment') this.showAddAttachmentModal = true;
    else if (label === 'Add User') this.showAddUserModal = true;
    else if (label === 'Add Emergency Contact') this.showAddEmergencyContactModal = true;
  }

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

  get allSubscriptionsSelected(): boolean {
    return this.subscriptions.length > 0 && this.subscriptions.every(s => s.subscribed);
  }

  toggleAllSubscriptions(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.subscriptions.forEach(s => (s.subscribed = checked));
  }

  // Landlord profile configurations & details
  landlord = {
    id: 0,
    name: 'Loading...',
    email: '',
    username: '',
    verified: false,
    personal: {
      id: '',
      name: '',
      email: '',
      phone: '',
      dob: '',
      maritalStatus: '',
      nationality: '',
      address1: '',
      address2: '',
      country: '',
      state: '',
      city: '',
      tag: '',
      profileVerified: false
    },
    wallet: {
      openingBalance: '0.0',
      openingBalanceDate: 'N/A',
      negativeBalanceAllowed: false,
      holdWalletMoney: false,
      includeSecurityDeposit: false,
      includeSecurityDepositNonLeasee: false,
      includeContributionWalletDeposit: false,
      moneyHeldBy: 'N/A'
    },
    bank: {
      name: '',
      address: '',
      accountName: '',
      swift: '-',
      iban: '',
      accountNo: '',
      sortCode: ''
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
