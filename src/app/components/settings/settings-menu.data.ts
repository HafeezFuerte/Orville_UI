import { Menu } from '../../shared/services/nav.service';

const ICON = (name: string) => `./assets/images/settings/${name}.svg`;

/** Figma Settings Menu (node 5035:95012) — section headings + links. */
export function buildFigmaSettingsMenuItems(): Menu[] {
  const items: Menu[] = [];

  const section = (title: string) => {
    items.push({ title, type: 'heading', active: false, selected: false });
  };

  const link = (title: string, path: string, icon: string, exact = true) => {
    items.push({
      title,
      path,
      icon: ICON(icon),
      type: 'link',
      active: false,
      selected: false,
      exact,
    });
  };

  section('Company Information');
  link('Company Details', '/settings/company-details', 'building-estate');
  link('Brand', '/settings/brand', 'polaroid');
  link('Watermark', '/settings/watermark', 'image');
  link('Company Shifts', '/settings/company-shifts', 'clock');
  link('Regional Settings', '/settings/regional-settings', 'globe');
  link('Departments', '/settings/departments', 'users');
  // Existing app page kept alongside Figma items
  link('Masters', '/settings/masters', 'settings-gear');

  section('Documents and PDF');
  link('Document Template', '/settings/document-template', 'file-invoice', false);
  link('PDF Builder', '/settings/pdf-builder', 'file-invoice', false);
  link('Mandatory Documents', '/settings/mandatory-documents', 'file-alert');
  link('Attachment Types', '/settings/attachment-types', 'paperclip');

  section('Users and Admins');
  link('Users and Admins', '/settings/users-and-admins', 'user-square', false);
  link('Roles and Permissions', '/settings/roles-and-permissions', 'settings-gear', false);
  link('Bulk Assign Properties', '/settings/bulk-assign-properties', 'building-community');
  link('Profile verification', '/settings/profile-verification', 'id');

  section('Invoices and Payments');
  link('Invoice/Receipt Profiles', '/settings/invoice-receipt-profiles', 'file-invoice');
  link('Discount Profiles', '/settings/discount-profiles', 'percent');
  link('Tax Profiles', '/settings/tax-profiles', 'percent');
  link('Bank Accounts', '/settings/bank-accounts', 'cash-banknote');
  link('Invoice Settings', '/settings/invoice-settings', 'settings-gear');
  link('Cheques', '/settings/cheques', 'cash-banknote');

  section('Leases and Contracts');
  link('Lease Settings', '/settings/lease-settings', 'contract');
  link('Contract Settings', '/settings/contract-settings', 'contract');
  link('Management Fee Configuration', '/settings/management-fee-configuration', 'hand-dollar');

  section('Types and Amenities');
  link('Work Order Settings', '/settings/work-order-settings', 'screwdriver-wrench');
  link('Maintenance Categories', '/settings/maintenance-categories', 'list');
  link('Quotation Categories', '/settings/quotation-categories', 'file-invoice');
  link('PO Settings', '/settings/po-settings', 'settings-gear');
  link('Promotion Categories', '/settings/promotion-categories', 'speakerphone');
  link('Inventory Categories', '/settings/inventory-categories', 'layout-grid');
  link('Asset Categories', '/settings/asset-categories', 'analyze');

  section('Helpdesk and Units');
  link('Tickets Settings', '/settings/tickets-settings', 'ticket');
  link('Unit Types', '/settings/unit-types', 'home');
  link('Room Types', '/settings/room-types', 'layout-grid');
  link('Property Types', '/settings/property-types', 'building-estate-2');
  link('Property Amenities', '/settings/property-amenities', 'list-details');

  section('Operational Configurations');
  link('Custom Fields', '/settings/custom-fields', 'pencil');
  link('Approvals', '/settings/approvals', 'gavel');
  link('Internal Statuses', '/settings/internal-statuses', 'list');

  section('Communication');
  link('Email settings', '/settings/email-settings', 'send');
  link('Email Templates', '/settings/email-templates', 'file-invoice');
  link('Notification/Email Settings', '/settings/notification-settings', 'bell-ringing');

  section('Custom links');
  link('Custom links', '/settings/custom-links', 'external-link');

  section('Mobile App Configuration');
  link('Mobile App Configuration', '/settings/mobile-app-configuration', 'users');

  section('App Integrations');
  link('Payment Gateways', '/settings/payment-gateways', 'wallet');

  section('ServiceHub');
  link('Work Order Settings', '/settings/servicehub/work-order-settings', 'screwdriver-wrench');
  link('Maintenance Categories', '/settings/servicehub/maintenance-categories', 'list');
  link('Quotation Categories', '/settings/servicehub/quotation-categories', 'file-invoice');
  link('PO Settings', '/settings/servicehub/po-settings', 'settings-gear');
  link('Promotion Categories', '/settings/servicehub/promotion-categories', 'speakerphone');
  link('Inventory Categories', '/settings/servicehub/inventory-categories', 'layout-grid');
  link('Asset Categories', '/settings/servicehub/asset-categories', 'analyze');
  link('Tickets Settings', '/settings/servicehub/tickets-settings', 'ticket');
  link('Visiting Slots', '/settings/servicehub/visiting-slots', 'calendar-event');

  section('EngageHub');
  link('Broadcast Configuration', '/settings/broadcast-configuration', 'speakerphone');

  section('Snaplist');
  link('Snaglist Preference', '/settings/snaplist-preference', 'search');

  return items;
}

/** Flat list of settings paths that use the shared placeholder (existing pages excluded). */
export const SETTINGS_PLACEHOLDER_ROUTES: { path: string; title: string }[] = [
  { path: 'payment-gateways', title: 'Payment Gateways' },
];
