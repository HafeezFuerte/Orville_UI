import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent, TranslateModule],
  templateUrl: './vendor-detail.component.html',
  styleUrl: './vendor-detail.component.scss'
})
export class VendorDetailComponent {
  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];

  activeTab = 'Overview';
  tabs = ['Overview', 'Unit', 'Work Orders', 'Financials', 'Attachments', 'Quotations', 'Notes', 'Users', 'Technicians'];

  activeFinancialSubTab = 'Bills';
  financialSubTabs = ['Bills', 'Purchase Orders'];

  showPersonalDetails = true;
  showActionDropdown = false;
  showSubscriptionsModal = false;

  // Assigned category toggles
  categories = [
    { name: 'Electrical', active: true },
    { name: 'Air Conditioner', active: true },
    { name: 'Delivery', active: false },
    { name: 'Plumbing', active: false },
    { name: 'Doors & Locks', active: true }
  ];

  // Action Dropdown list
  actionOptions = [
    { label: 'Edit Vendor', icon: 'ri-edit-line' },
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

  // Mock subscriptions
  subscriptions = [
    { name: 'Cheque Due Reminder Email', subscribed: true },
    { name: 'Contract Auto Renewal', subscribed: true },
    { name: 'Contract Ending', subscribed: true },
    { name: 'Contract Send For Signature', subscribed: true }
  ];

  // Vendor profiles
  vendor = {
    id: 31658,
    name: 'Shamed Vendor',
    email: 'shamedvendor@gmail.com',
    username: 'orville_real',
    trn: '-',
    tradeLicense: '-',
    personal: {
      fullName: 'Shamed Rehman',
      email: 'rental@orvillerealestate.com',
      phone: '43332903',
      address1: 'Dubai Marina, Tower A, Dubai',
      address2: 'Dubai Marina, Tower A, Dubai',
      country: 'United Arab Emirates',
      state: 'Dubai',
      city: 'Dubai',
      postcode: 'India',
      created: '12-09-1995',
      lastUpdated: '12-09-1995',
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

  unitData = [
    { id: 'U-306', Name: 'Unit 306', Category: 'Residential', Property: 'Sunrise Apartments', Landlord: 'Orville Real Estate', Tags: 'Premium', unitType: 'Apartment', floorNumber: '1 Floor', managementFee: 'AED 600', status: 'Occupied', internalStatus: 'All', size: '1200 Sqft', marketRent: 'AED 26500.00', deposited: 'AED 4000.00', published: 'Yes', forSale: 'No' },
    { id: 'U-305', Name: 'Unit 305', Category: 'Residential', Property: 'Green Heights', Landlord: 'Orville Real Estate', Tags: 'Standard', unitType: 'Apartment', floorNumber: '1 Floor', managementFee: 'AED 600', status: 'Vacant', internalStatus: 'All', size: '1200 Sqft', marketRent: 'AED 26500.00', deposited: 'AED 4000.00', published: 'No', forSale: 'Yes' }
  ];

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

  workOrderData = [
    { id: 'WO-1001', title: 'Repair Water Leak', status: 'Open', closingStatus: 'Pending', internalStatus: 'Assigned', dueDate: '15-07-2026', priority: 'High', property: 'Sunrise Ap...', vendor: 'ABC Plumbing', user: 'John Smith', tags: 'Plumbing, Emergency', maintenanceCategory: 'Plumbing', responsiblePerson: 'Michael Brown', updatedAt: '10-07-2026 09:15 AM', createdAt: '10-07-2026' },
    { id: 'WO-1002', title: 'Replace Corridor Lights', status: 'In Progress', closingStatus: 'Pending', internalStatus: 'Working', dueDate: '18-07-2026', priority: 'Medium', property: 'Green Heig...', vendor: 'Bright Electric Ltd.', user: 'Sarah Lee', tags: 'Electrical', maintenanceCategory: 'Electrical', responsiblePerson: 'David Wilson', updatedAt: '11-07-2026 02:30 PM', createdAt: '11-07-2026' },
    { id: 'WO-1003', title: 'HVAC Annual Service', status: 'Completed', closingStatus: 'Closed', internalStatus: 'Verified', dueDate: '08-07-2026', priority: 'Low', property: 'Oak Reside...', vendor: 'CoolAir Services', user: 'Emma Davis', tags: 'Preventive', maintenanceCategory: 'HVAC', responsiblePerson: 'Chris Johnson', updatedAt: '09-07-2026 11:45 AM', createdAt: '09-07-2026' }
  ];

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

  billData = [
    { id: '1817909', status: 'Unpaid', to: 'Atif Shahzad', unitCommonArea: '103-PR-10', invoiceNumber: 'INV-26-00067223', chequeNo: '67223', invoiceDate: '12-07-2024', invoiceType: 'Rent', account: 'Rent Account', currency: 'AED', propertyName: 'Marina heights', propertyId: '982736', leaseId: '2234', leaseStatus: 'Active', note: 'Standard note', workOrder: 'WO-8273', amount: 'AED 3,000.00', tax: 'AED 150.00', grossAmount: 'AED 3,150.00', paid: 'AED 0.00', paymentVia: '-', moneyHeldBy: 'Company', ddRefNo: '-', bankName: 'ENBD Bank', internalStatus: 'All', archived: 'No', dueDate: '28-11-2024', paidDate: '-', cheque: '-', days: '14', writeAmountOff: '0.00', createdBy: 'Admin' },
    { id: '1817910', status: 'Paid', to: 'Atif Shahzad', unitCommonArea: '103-PR-10', invoiceNumber: 'INV-26-00067223', chequeNo: '67223', invoiceDate: '12-07-2024', invoiceType: 'Rent', account: 'Rent Account', currency: 'AED', propertyName: 'Marina heights', propertyId: '982736', leaseId: '2234', leaseStatus: 'Active', note: 'Standard note', workOrder: 'WO-8273', amount: 'AED 3,000.00', tax: 'AED 150.00', grossAmount: 'AED 3,150.00', paid: 'AED 3,150.00', paymentVia: 'Cash', moneyHeldBy: 'Company', ddRefNo: '-', bankName: 'ENBD Bank', internalStatus: 'All', archived: 'No', dueDate: '28-11-2024', paidDate: '28-11-2024', cheque: '-', days: '0', writeAmountOff: '0.00', createdBy: 'Admin' }
  ];

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

  poData = [
    { id: '31658', poNumber: 'PO-2026-0001', title: 'Kitchen plumbing repair', tags: 'Plumbing', status: 'Pending', category: 'Maintenance', property: 'Marina Heights Towers', unit: 'Apartment 203-PR-4', workOrder: 'WO-1001', invoice: 'INV-1001', addedBy: 'Admin', totalAmount: 'AED 2,250.00', poDate: '01-07-2026', dueDate: '10-07-2026' },
    { id: '31659', poNumber: 'PO-2026-0002', title: 'Annual electrical inspection', tags: 'Electrical', status: 'Approved', category: 'Compliance', property: 'Marina Heights Towers', unit: 'Apartment 203-PR-4', workOrder: 'WO-1002', invoice: '-', addedBy: 'Admin', totalAmount: 'AED 3,500.00', poDate: '05-07-2026', dueDate: '15-07-2026' }
  ];

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

  attachmentData = [
    { id: 'ATT-1001', fileType: 'Trade License', docId: 'DOC-1001', status: 'Active', issueDate: '12-07-2024', expiryDate: '12-07-2026', files: 'trade_license.pdf', uploadedBy: 'Admin', createdAt: '12-07-2024', updatedAt: '12-07-2024' }
  ];

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

  quotationData = [
    { id: 'ATT-1001', status: 'Review', vendorName: 'FixPro Services', quotationTitle: 'Kitchen plumbing repair', quotationNumber: 'QTN-2025-0031', estdPrice: 'AED 3,250.00', deliveryDate: '14-06-2026', quotationCategoryName: 'Maintenance', landlordStatus: 'Pending', tenantStatus: 'Approved', userName: 'Ahmed Malik', createdAt: '10-01-2026, 09:14', updatedAt: '12-01-2026, 13:06' },
    { id: 'ATT-1001', status: 'Approved', vendorName: 'BrightVolt LLC', quotationTitle: 'Annual electrical inspection', quotationNumber: 'QTN-2025-0032', estdPrice: 'AED 3,250.00', deliveryDate: '14-06-2026', quotationCategoryName: 'Compliance', landlordStatus: 'Approved', tenantStatus: 'Accepted', userName: 'Ahmed Malik', createdAt: '10-01-2026, 09:14', updatedAt: '12-01-2026, 13:06' }
  ];

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

  noteData = [
    { id: 'N-31658', subject: 'Standard maintenance terms', content: 'Agreed on 10% discount on HVAC maintenance works over AED 5,000.', via: 'Portal', noteDate: '12-07-2026', created_by: 'Admin', files: '-', created_at: '12-07-2026', updated_at: '12-07-2026' }
  ];

  // --- TAB 8: USERS ---
  userColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true },
    { key: 'userName', label: 'web.contacts.lblUserName', visible: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true },
    { key: 'phone', label: 'web.contacts.lblPhoneNumber', visible: true },
    { key: 'role', label: 'web.contacts.lblRole', visible: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true }
  ];

  userData = [
    { id: '31658', name: 'Zaid Rehman', userName: 'zaid_rehman', email: 'zaid@vendor.com', phone: '0528613568', role: 'Vendor Admin', status: 'Active' }
  ];

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

  technicianData = [
    { id: 'TECH-101', name: 'John Miller', email: 'john.miller@vendor.com', phone: '05698 253 25', category: 'Electrical', status: 'Active' }
  ];

  setTab(tab: string) {
    this.activeTab = tab;
  }

  setFinancialSubTab(subTab: string) {
    this.activeFinancialSubTab = subTab;
  }
}
