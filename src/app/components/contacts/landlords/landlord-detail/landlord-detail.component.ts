import { Component, OnInit, OnDestroy, inject, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { EmailSubscriptionsDrawerComponent } from '../../../../shared/components/email-subscriptions-drawer/email-subscriptions-drawer.component';

@Component({
  selector: 'app-landlord-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule, AttachmentsComponent, NotesComponent, EmailSubscriptionsDrawerComponent],
  templateUrl: './landlord-detail.component.html',
  styleUrl: './landlord-detail.component.scss'
})
export class LandlordDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesService);
  private portfolioService = inject(PortfolioService);
  private router = inject(Router);

  @ViewChild(AttachmentsComponent) attachmentsTable!: AttachmentsComponent;
  @ViewChild(NotesComponent) notesTable!: NotesComponent;
  
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

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

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.showActionDropdown) this.showActionDropdown = false;
  }

  ngOnInit() {
    this.initializeTabs();
    this.route.params.subscribe(params => {
      this.landlordId = params['id'];
      this.initChatContacts();
      if (this.landlordId) {
        this.getLandlordDetails();
      }
    });
  }

  ngOnDestroy(): void {}

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
          this.loadLocations();
        }
      },
      error: (err) => {
        console.error('Error fetching landlord details:', err);
      }
    });
  }

  loadLocations() {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: 1000,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.countries = res.objResult.table;
          this.resolveLocationNames();
        }
      }
    });
  }

  resolveLocationNames() {
    if (!this.landlordData) return;
    
    // Resolve nationality
    const natId = Number(this.landlordData.nationality);
    if (natId) {
      const country = this.countries.find(c => Number(c.id) === natId);
      if (country) {
        this.landlord.personal.nationality = country.country_name || country.name || String(natId);
      }
    }

    // Resolve country
    const countryId = Number(this.landlordData.country_id || this.landlordData.country);
    if (countryId) {
      const country = this.countries.find(c => Number(c.id) === countryId);
      if (country) {
        this.landlord.personal.country = country.country_name || country.name || String(countryId);
      }

      // Load states for this country
      this.portfolioService.getMasterByType({
        typeId: 1001,
        filterId: 0,
        filterText: countryId.toString(),
        filterText1: ''
      }).subscribe({
        next: (resState: any) => {
          if (resState.statusCode == 200 && resState.objResult && resState.objResult.table) {
            this.states = resState.objResult.table;
            const stateId = Number(this.landlordData.stateid || this.landlordData.state || this.landlordData.state_id);
            if (stateId) {
              const state = this.states.find(s => Number(s.id) === stateId);
              if (state) {
                this.landlord.personal.state = state.state_name || state.name || String(stateId);
              }

              // Load cities for this state
              this.portfolioService.getMasterByType({
                typeId: 1002,
                filterId: 0,
                filterText: stateId.toString(),
                filterText1: ''
              }).subscribe({
                next: (resCity: any) => {
                  if (resCity.statusCode == 200 && resCity.objResult && resCity.objResult.table) {
                    this.cities = resCity.objResult.table;
                    const cityId = Number(this.landlordData.city || this.landlordData.city_id);
                    if (cityId) {
                      const city = this.cities.find(ci => Number(ci.id) === cityId);
                      if (city) {
                        this.landlord.personal.city = city.city_name || city.name || String(cityId);
                      }
                    }
                  }
                }
              });
            }
          }
        }
      });
    }
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
    { label: 'Edit Landlord',         icon: 'ri-pencil-line',      asset: 'assets/images/action-menu/pencil.svg' },
    { label: 'Inflow',                 icon: 'ri-download-line',    asset: 'assets/images/action-menu/inflow.svg' },
    { label: 'Outflow',                icon: 'ri-upload-line',      asset: 'assets/images/action-menu/outflow.svg' },
    { label: 'Landlord Contribution',  icon: 'ri-pie-chart-line',   asset: 'assets/images/action-menu/contribution.svg' },
    { label: 'Landlord Distribution',  icon: 'ri-git-branch-line',  asset: 'assets/images/action-menu/distribution.svg' },
    { label: 'Add Notes',              icon: 'ri-file-text-line',   asset: 'assets/images/action-menu/file-invoice.svg' },
    { label: 'Add Attachment',         icon: 'ri-attachment-2',     asset: 'assets/images/action-menu/paperclip.svg' },
    { label: 'Add User',               icon: 'ri-user-add-line',    asset: 'assets/images/action-menu/add-user.svg' },
    { label: 'Add Emergency Contact',  icon: 'ri-phone-line',       asset: 'assets/images/action-menu/phone.svg' },
    { label: 'Add Broadcast',          icon: 'ri-broadcast-line',   asset: 'assets/images/action-menu/broadcast.svg' },
    { label: 'Request for Approval',   icon: 'ri-checkbox-line',    asset: 'assets/images/action-menu/approval.svg' },
    { label: 'Send Email',             icon: 'ri-mail-line',        asset: 'assets/images/action-menu/mail.svg' },
    { label: 'View Activity',          icon: 'ri-time-line',        asset: 'assets/images/action-menu/clock.svg' },
    { label: 'Block Landlord',         icon: 'ri-forbid-line',      asset: 'assets/images/action-menu/block.svg', dangerIcon: true },
    { label: 'Archive',                icon: 'ri-delete-bin-line',  asset: 'assets/images/action-menu/archive.svg', danger: true }
  ];

  get hasDangerAction(): boolean {
    return this.actionOptions.some((o: any) => o.danger);
  }

  onLandlordAction(label: string): void {
    this.showActionDropdown = false;
    if (label === 'Edit Landlord') {
      this.router.navigate(['/contacts/landlords/edit-landlord', this.landlordId]);
      return;
    }
    if (label === 'Inflow') this.showInflowModal = true;
    else if (label === 'Outflow') this.showOutflowModal = true;
    else if (label === 'Landlord Contribution') this.showContributionModal = true;
    else if (label === 'Landlord Distribution') this.showDistributionModal = true;
    else if (label === 'Add Notes') {
      this.activeTab = 'Notes';
      this.initializeTabs();
      setTimeout(() => this.notesTable?.openModal(), 0);
    }
    else if (label === 'Add Attachment') {
      this.activeTab = 'Attachments';
      this.initializeTabs();
      setTimeout(() => this.attachmentsTable?.openModal(), 0);
    }
    else if (label === 'Add User') {
      this.activeTab = 'User';
      this.showAddUserModal = true;
    }
    else if (label === 'Add Emergency Contact') {
      this.activeTab = 'Emergency Contact';
      this.showAddEmergencyContactModal = true;
    }
  }

  // Email subscriptions list — Figma 1727:155289 (mostly unsubscribed; a few subscribed)
  subscriptions = [
    { name: 'Cheque Due Reminder Email', subscribed: false },
    { name: 'Contract Auto Renewal', subscribed: false },
    { name: 'Contract Ending', subscribed: false },
    { name: 'Contract Send For Signature', subscribed: false },
    { name: 'Download HappyTenant Plus App Reminder', subscribed: false },
    { name: 'Facility Request Approved and New Work Order', subscribed: false },
    { name: 'Happy Birthday email', subscribed: false },
    { name: 'Hold Payment', subscribed: false },
    { name: 'Invoice Cleared', subscribed: true },
    { name: 'Landlord Invoice Payment Received email', subscribed: false },
    { name: 'Landlord Lease Completed', subscribed: false },
    { name: 'Landlord Request Update', subscribed: false },
    { name: 'Landlord Snaglist Report', subscribed: false },
    { name: 'Late Fee Notice', subscribed: false },
    { name: 'Late Payment Notice', subscribed: false },
    { name: 'Lease Completed', subscribed: true },
    { name: 'Lease Ending Reminder Email', subscribed: false },
    { name: 'Lease Renewal', subscribed: false },
    { name: 'Lease Send for Sign in Bulk email', subscribed: true },
    { name: 'Lease Start', subscribed: false },
    { name: 'New Broadcast Email', subscribed: false },
    { name: 'New Request for Approval', subscribed: false },
    { name: 'New Ticket email', subscribed: false },
    { name: 'Payment Completed', subscribed: false },
    { name: 'Quotation Status', subscribed: false },
    { name: 'SPA Lease Send for Signature email', subscribed: false },
    { name: 'Send Lease for Landlord Signature email', subscribed: false },
    { name: 'Ticket Approval email', subscribed: false },
    { name: 'Welcome to HappyLandlord app email', subscribed: false },
    { name: 'Write Off Invoice', subscribed: false },
    { name: 'Partial Payment Received', subscribed: false },
    { name: 'Bounced cheque replacement reminder', subscribed: false }
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
  selectedContact: any = null;
  chatSearchQuery = '';
  chatMessagesMap: { [contactId: number]: any[] } = {};
  newMessageText = '';

  loadPersistedChatMessages(): void {
    try {
      const key = this.landlordId ? `chat_messages_landlord_${this.landlordId}` : 'chat_messages_landlord_default';
      const stored = localStorage.getItem(key);
      if (stored) {
        this.chatMessagesMap = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading chat messages from storage:', e);
    }
  }

  savePersistedChatMessages(): void {
    try {
      const key = this.landlordId ? `chat_messages_landlord_${this.landlordId}` : 'chat_messages_landlord_default';
      localStorage.setItem(key, JSON.stringify(this.chatMessagesMap));
    } catch (e) {
      console.error('Error persisting chat messages to storage:', e);
    }
  }

  initChatContacts(): void {
    const landlordName = this.landlordData?.landlord || this.landlordData?.name || (this.landlord?.name && this.landlord.name !== 'Loading...' ? this.landlord.name : 'Zaid Rahman');
    
    const contactsList: any[] = [
      { id: 1, name: landlordName, role: 'Primary Landlord', active: true }
    ];

    if (this.emergencyContactData && this.emergencyContactData.length > 0) {
      this.emergencyContactData.forEach((ec: any, index: number) => {
        contactsList.push({
          id: 10 + index,
          name: ec.name || ec.contact_name || `Emergency Contact ${index + 1}`,
          role: ec.relation ? `Emergency (${ec.relation})` : 'Emergency Contact',
          active: true
        });
      });
    }

    contactsList.push(
      { id: 2, name: 'Property Manager', role: 'Support Team', active: true },
      { id: 3, name: 'Accounts Officer', role: 'Billing & Finance', active: false }
    );

    this.chatContacts = contactsList;

    if (!this.selectedContact || !this.selectedContact.name) {
      this.selectedContact = this.chatContacts[0];
    }

    this.loadPersistedChatMessages();
  }

  get currentChatMessages(): any[] {
    if (!this.selectedContact) return [];
    const contactId = this.selectedContact.id;
    if (!this.chatMessagesMap[contactId]) {
      this.chatMessagesMap[contactId] = [];
    }
    return this.chatMessagesMap[contactId];
  }

  get filteredChatContacts(): any[] {
    const q = this.chatSearchQuery.trim().toLowerCase();
    if (!q) return this.chatContacts;
    return this.chatContacts.filter(c =>
      c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
  }

  selectContact(contact: any): void {
    this.selectedContact = contact;
  }

  sendChatMessage() {
    if (this.newMessageText && this.newMessageText.trim()) {
      const text = this.newMessageText.trim();
      const currentUser = JSON.parse(localStorage.getItem('user_details') || '{}');
      const nowIso = new Date().toISOString();
      const contactId = this.selectedContact?.id || 1;

      const payload = {
        userid: currentUser?.userId || 1,
        company_id: currentUser?.companyId || 1,
        clientId: currentUser?.clientId || '74BB6922',
        source: 'web',
        languageid: 1,
        entity: 'Landlord',
        code: '',
        entity_id: String(this.landlordId || ''),
        group_id: '0',
        sender_id: currentUser?.userId || 1,
        receiver_id: contactId,
        message: text,
        send_on: nowIso,
        read_on: nowIso,
        edited_on: nowIso
      };

      if (!this.chatMessagesMap[contactId]) {
        this.chatMessagesMap[contactId] = [];
      }

      this.chatMessagesMap[contactId].push({
        sender: 'You',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: true
      });
      this.newMessageText = '';
      this.savePersistedChatMessages();

      this.portfolioService.saveChatMessage(payload).subscribe({
        next: (res: any) => {
          console.log('Chat message saved successfully:', res);
        },
        error: (err: any) => console.error('Error sending chat message:', err)
      });
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
