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
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule, AttachmentsComponent, NotesComponent, FilterDrawerComponent],
  templateUrl: './vendor-detail.component.html',
  styleUrl: './vendor-detail.component.scss'
})
export class VendorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesService);
  
  vendorId: any = null;
  vendorData: any = null;
  notesForm: any = {};
  attachmentsForm: any = {};

  tabsList: any[] = [];

  initializeTabs() {
    this.tabsList = [
      {
        key: 'Notes',
        label: 'Notes',
        entity: 'vendor',
        entity_id: this.vendorId,
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
        entity: 'vendor',
        entity_id: this.vendorId,
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
      this.vendorId = params['id'];
      if (this.vendorId) {
        this.getVendorDetails();
      }
    });
  }

  getVendorDetails() {
    const payload = {
      typeId: 29,
      filterId: 0,
      filterText: this.vendorId,
      filterText1: "",
      userId: Number(localStorage.getItem('userId')) || 1,
      clientId: "74BB6922",
      companyId: Number(localStorage.getItem('companyId')) || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const result = res.objResult;
          let vendorObj: any = null;
          if (result.table && result.table[0]) {
            vendorObj = result.table[0];
          } else if (result.vendors_dtls && result.vendors_dtls[0]) {
            vendorObj = result.vendors_dtls[0];
          } else if (result.vendor_dtls && result.vendor_dtls[0]) {
            vendorObj = result.vendor_dtls[0];
          } else if (result.vendors && result.vendors[0]) {
            vendorObj = result.vendors[0];
          } else {
            const arrayKey = Object.keys(result).find(key => Array.isArray(result[key]) && result[key].length > 0 && key !== 'workorders' && key !== 'work_orders' && key !== 'units' && key !== 'bills' && key !== 'purchase_orders' && key !== 'documents' && key !== 'quotations' && key !== 'notes' && key !== 'users' && key !== 'emergency_dtls');
            if (arrayKey) {
              vendorObj = result[arrayKey][0];
            }
          }
          this.vendorData = vendorObj;
          if (result.units) this.unitData = result.units;
          if (result.workorders) this.workOrderData = result.workorders;
          else if (result.work_orders) this.workOrderData = result.work_orders;
          if (result.bills) this.billData = result.bills;
          if (result.purchase_orders) this.poData = result.purchase_orders;
          if (result.documents) this.attachmentData = result.documents;
          if (result.quotations) this.quotationData = result.quotations;
          if (result.notes) this.noteData = result.notes;
          else if (result.note) this.noteData = result.note;
          if (result.users) this.userData = result.users;
          if (result.emergency_dtls) this.emergencyContactData = result.emergency_dtls;
          
          if (this.vendorData) {
            const data = this.vendorData;
            this.vendor.id = data.id || data.code || this.vendor.id;
            this.vendor.name = data.company_name || data.vendor_name || this.vendor.name;
            this.vendor.email = data.email_address || data.email || this.vendor.email;
            this.vendor.username = data.username || data.login_username || this.vendor.username;
            this.vendor.trn = data.tax_registration_no || data.trn || '-';
            this.vendor.tradeLicense = data.trade_license || '-';

            this.vendor.personal.fullName = data.contact_name || data.full_name || this.vendor.personal.fullName;
            this.vendor.personal.email = data.email_address || this.vendor.personal.email;
            this.vendor.personal.phone = data.phone_number || data.mobile_no || this.vendor.personal.phone;
            this.vendor.personal.address1 = data.address1 || this.vendor.personal.address1;
            this.vendor.personal.address2 = data.address2 || this.vendor.personal.address2;
            this.vendor.personal.country = data.country || data.country_id || this.vendor.personal.country;
            this.vendor.personal.state = data.state || data.stateid || this.vendor.personal.state;
            this.vendor.personal.city = data.city || this.vendor.personal.city;
            this.vendor.personal.postcode = data.zipcode || data.postcode || '';
            this.vendor.personal.created = data.created_at || data.created || '';
            this.vendor.personal.lastUpdated = data.updated_at || data.lastUpdated || '';
          }

          console.log('Vendor Details Loaded:', this.vendorData);
          this.initializeTabs();
        }
      },
      error: (err) => {
        console.error('Error fetching vendor details:', err);
      }
    });
  }
  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];

  activeTab = 'Overview';
  tabs = ['Overview', 'Unit', 'Work Orders', 'Financials', 'Attachments', 'Quotations', 'Notes', 'Users', 'Technicians'];

  activeFinancialSubTab = 'Bills';
  financialSubTabs = ['Bills', 'Purchase Orders'];

  showPersonalDetails = true;
  showActionDropdown = false;
  showSubscriptionsModal = false;
  showAddUserModal = false;
  showAddTechnicianModal = false;
  showFilterDrawer = false;
  
  showUnitColumnDropdown = false;
  showBillColumnDropdown = false;
  showPoColumnDropdown = false;

  toggleDrawer(show: boolean) {
    this.showFilterDrawer = show;
  }

  // Assigned category toggles
  categories = [
    { name: 'Electrical', active: true },
    { name: 'Air Conditioner', active: true },
    { name: 'Delivery', active: false },
    { name: 'Plumbing', active: false },
    { name: 'Doors & Locks', active: true }
  ];

  // Action Dropdown list (Figma vendor-detail Action menu)
  actionOptions: {
    label: string;
    icon: string;
    asset?: string;
    danger?: boolean;
    dangerIcon?: boolean;
  }[] = [
    { label: 'Edit Vendor', icon: 'ri-pencil-line', asset: 'assets/images/action-menu/pencil.svg' },
    { label: 'Add Attachment', icon: 'ri-attachment-2', asset: 'assets/images/action-menu/paperclip.svg' },
    { label: 'Add Broadcast', icon: 'ri-broadcast-line' },
    { label: 'Add Quotation', icon: 'ri-file-text-line', asset: 'assets/images/action-menu/file-invoice.svg' },
    { label: 'Add User', icon: 'ri-user-add-line' },
    { label: 'Send Email', icon: 'ri-mail-line' },
    { label: 'View Activity', icon: 'ri-time-line', asset: 'assets/images/action-menu/clock.svg' },
    { label: 'Assign Properties', icon: 'ri-home-4-line' },
    { label: 'Block Vendor', icon: 'ri-forbid-line', dangerIcon: true }
  ];

  get hasDangerAction(): boolean {
    return this.actionOptions.some((o: any) => o.danger);
  }

  get vendorStatusLabel(): string {
    return this.vendorData?.status || this.vendorData?.vendor_status || 'Active';
  }

  get isActiveVendor(): boolean {
    return (this.vendorStatusLabel || '').toLowerCase() === 'active';
  }

  get isBlockedVendor(): boolean {
    const value = (this.vendorStatusLabel || '').toLowerCase();
    return value === 'blocked' || value === 'inactive';
  }

  onVendorAction(label: string): void {
    this.showActionDropdown = false;
    if (label === 'Edit Vendor') {
      window.location.href = '/contacts/vendors/edit-vendor/' + this.vendorId;
      return;
    }
    if (label === 'Add Attachment') this.showSubscriptionsModal = true;
    else if (label === 'Add User') this.showAddUserModal = true;
  }

  // Mock subscriptions
  subscriptions = [
    { name: 'Cheque Due Reminder Email', subscribed: true },
    { name: 'Contract Auto Renewal', subscribed: true },
    { name: 'Contract Ending', subscribed: true },
    { name: 'Contract Send For Signature', subscribed: true }
  ];

  get allSubscriptionsSelected(): boolean {
    return this.subscriptions.length > 0 && this.subscriptions.every(s => s.subscribed);
  }

  toggleAllSubscriptions(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.subscriptions.forEach(s => (s.subscribed = checked));
  }

  // Vendor profiles
  // Vendor profiles
  vendor = {
    id: 0,
    name: 'Loading...',
    email: '',
    username: '',
    trn: '-',
    tradeLicense: '-',
    personal: {
      fullName: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      country: '',
      state: '',
      city: '',
      postcode: '',
      created: '',
      lastUpdated: '',
      canCreateWorkOrder: false
    }
  };

  // --- TAB 2: UNIT (Copy from Landlord details page) ---
  unitColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'Name', label: 'web.contacts.lblName', visible: true },
    { key: 'Category', label: 'web.contacts.lblCategory', visible: true },
    { key: 'Beds', label: 'web.contacts.lblBeds', visible: true },    
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

  // --- TAB 3: WORK ORDERS (Image 2 + Image 3 columns & add Created At at last) ---
  workOrderColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'title', label: 'web.contacts.lblSubject', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'closingStatus', label: 'web.contacts.lblclosingStatus', visible: true },
    { key: 'internalStatus', label: 'web.contacts.lblInternalStatus', visible: true },
    { key: 'dueDate', label: 'web.contacts.lblDueDate', visible: true },
    { key: 'priority', label: 'web.contacts.lblPriority', visible: true, useTemplate: true },
    { key: 'property', label: 'web.contacts.lblProperty', visible: true },
    { key: 'vendor', label: 'web.contacts.lblVendor', visible: true },
    { key: 'user', label: 'web.contacts.lblUser', visible: true },
    { key: 'tags', label: 'web.contacts.lblTags', visible: true },
    { key: 'maintenanceCategory', label: 'web.contacts.lblMaintenanceCategory', visible: true },
    { key: 'responsiblePerson', label: 'web.contacts.lblResponsiblePerson', visible: true },
    { key: 'updatedAt', label: 'web.contacts.lblUpdatedAt', visible: true },
    { key: 'createdAt', label: 'web.contacts.lblCreatedAt', visible: true }
  ];

  workOrderData: any[] = [];

  // --- TAB 4: FINANCIALS (Bills Sub-tab: Status & ID bottom-to-top) ---
  billColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true },
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
    { key: 'tax', label: 'web.contacts.lblTax', visible: true },
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

  billData: any[] = [];

  // --- TAB 4: FINANCIALS (Purchase Order Sub-tab: PO bottom-to-top) ---
  poColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true },
    { key: 'poNumber', label: 'web.contacts.lblInvoiceNumber', visible: true },
    { key: 'title', label: 'web.contacts.lblSubject', visible: true },
    { key: 'tags', label: 'web.contacts.lblTags', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'category', label: 'web.contacts.lblCategory', visible: true },
    { key: 'property', label: 'web.contacts.lblProperty', visible: true },
    { key: 'unit', label: 'web.contacts.lblUnit', visible: true },
    { key: 'workOrder', label: 'web.contacts.lblWorkOrder', visible: true },
    { key: 'invoice', label: 'web.contacts.lblInvoiceNumber', visible: true },
    { key: 'addedBy', label: 'web.contacts.lblCreatedBy', visible: true },
    { key: 'totalAmount', label: 'web.contacts.lblAmount', visible: true },
    { key: 'poDate', label: 'web.contacts.lblIssueDate', visible: true },
    { key: 'dueDate', label: 'web.contacts.lblDueDate', visible: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  poData: any[] = [];

  // --- TAB 5: ATTACHMENTS ---
  attachmentColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'fileType', label: 'web.contacts.lblFileType', visible: true },
    { key: 'docId', label: 'web.contacts.lblDocId', visible: true },
    { key: 'status', label: 'web.contacts.lblDocumentStatus', visible: true, useTemplate: true },
    { key: 'issueDate', label: 'web.contacts.lblIssueDate', visible: true },
    { key: 'expiryDate', label: 'web.contacts.lblExpiryDate', visible: true },
    { key: 'files', label: 'web.contacts.lblFiles', visible: true, useTemplate: true },
    { key: 'uploadedBy', label: 'web.contacts.lblUploadedBy', visible: true },
    { key: 'createdAt', label: 'web.contacts.lblCreatedAt', visible: true },
    { key: 'updatedAt', label: 'web.contacts.lblUpdatedAt', visible: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  attachmentData: any[] = [];

  // --- TAB 6: QUOTATIONS ---
  quotationColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'vendorName', label: 'web.contacts.lblVendor', visible: true },
    { key: 'quotationTitle', label: 'web.contacts.lblSubject', visible: true },
    { key: 'quotationNumber', label: 'web.contacts.lblInvoiceNumber', visible: true },
    { key: 'estdPrice', label: 'web.contacts.lblAmount', visible: true },
    { key: 'deliveryDate', label: 'web.contacts.lblDueDate', visible: true },
    { key: 'quotationCategoryName', label: 'web.contacts.lblCategory', visible: true },
    { key: 'landlordStatus', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'tenantStatus', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'userName', label: 'web.contacts.lblUserName', visible: true },
    { key: 'createdAt', label: 'web.contacts.lblCreatedAt', visible: true },
    { key: 'updatedAt', label: 'web.contacts.lblUpdatedAt', visible: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  quotationData: any[] = [];

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

  // --- TAB 8: USERS ---
  userColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true },
    { key: 'userName', label: 'web.contacts.lblUserName', visible: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true },
    { key: 'phone', label: 'web.contacts.lblPhoneNumber', visible: true },
    { key: 'role', label: 'web.contacts.lblRole', visible: true },
    { key: 'type', label: 'web.contacts.lblType', visible: true },
    { key: 'timezone', label: 'web.contacts.lblTimeZone', visible: true },
    { key: 'country', label: 'web.contacts.lblCountry', visible: true },
    { key: 'isDefault', label: 'web.contacts.lblDefault', visible: true },
    { key: 'createdAt', label: 'web.contacts.lblCreatedAt', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  userData: any[] = [];

  // --- TAB 9: TECHNICIANS ---
  technicianColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true },
    { key: 'phone', label: 'web.contacts.lblPhoneNumber', visible: true },
    { key: 'category', label: 'web.contacts.lblCategory', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  technicianData: any[] = [];
  emergencyContactData: any[] = [];

  setTab(tab: string) {
    this.activeTab = tab;
  }

  setFinancialSubTab(subTab: string) {
    this.activeFinancialSubTab = subTab;
  }

  get visibleUnitColumns() {
    return this.unitColumns.filter(col => col.visible !== false);
  }

  toggleUnitColumn(colKey: string) {
    const col = this.unitColumns.find(c => c.key === colKey);
    if (col) col.visible = !col.visible;
  }

  toggleAllUnitColumns(event: any) {
    const checked = event.target.checked;
    this.unitColumns.forEach(c => c.visible = checked);
  }

  get allUnitColumnsSelected(): boolean {
    return this.unitColumns.every(c => c.visible !== false);
  }

  get visibleBillColumns() {
    return this.billColumns.filter(col => col.visible !== false);
  }

  toggleBillColumn(colKey: string) {
    const col = this.billColumns.find(c => c.key === colKey);
    if (col) col.visible = !col.visible;
  }

  toggleAllBillColumns(event: any) {
    const checked = event.target.checked;
    this.billColumns.forEach(c => c.visible = checked);
  }

  get allBillColumnsSelected(): boolean {
    return this.billColumns.every(c => c.visible !== false);
  }

  get visiblePoColumns() {
    return this.poColumns.filter(col => col.visible !== false);
  }

  togglePoColumn(colKey: string) {
    const col = this.poColumns.find(c => c.key === colKey);
    if (col) col.visible = !col.visible;
  }

  toggleAllPoColumns(event: any) {
    const checked = event.target.checked;
    this.poColumns.forEach(c => c.visible = checked);
  }

  get allPoColumnsSelected(): boolean {
    return this.poColumns.every(c => c.visible !== false);
  }
}
