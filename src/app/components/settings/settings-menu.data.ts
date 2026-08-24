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
  link('Property Types', '/settings/property-types', 'building-estate-2');
  link('Property Amenities', '/settings/property-amenities', 'list-details');

  section('Operational Configurations');
  link('Custom Fields', '/settings/custom-fields', 'pencil');
  link('Approvals', '/settings/approvals', 'gavel');
  link('Internal Statuses', '/settings/internal-statuses', 'list');

  section('Communication');
  link('Email settings', '/settings/email-settings', 'send');
  link('Email Templates', '/settings/email-templates', 'file-invoice');
  link('Notification Settings', '/settings/notification-settings', 'bell-ringing');

  section('Custom links');
  link('Custom links', '/settings/custom-links', 'external-link');

  section('App Integrations');
  link('Payment Gateways', '/settings/payment-gateways', 'wallet');

  section('ServiceHub');
  link('Work Order Settings', '/settings/servicehub/work-order-settings', 'screwdriver-wrench');
  link('Maintenance Categories', '/settings/servicehub/maintenance-categories', 'list');
  link('Quotation Categories', '/settings/servicehub/quotation-categories', 'file-invoice');
  link('PO Settings', '/settings/servicehub/po-settings', 'settings-gear');
  link('Inventory Categories', '/settings/servicehub/inventory-categories', 'layout-grid');
  link('Tickets Settings', '/settings/servicehub/tickets-settings', 'ticket');
  link('Visiting Slots', '/settings/servicehub/visiting-slots', 'calendar-event');

  section('EngageHub');
  link('Broadcast Configuration', '/settings/broadcast-configuration', 'speakerphone');

  section('Snaplist');
  link('Snaplist Preference', '/settings/snaplist-preference', 'search');

  return items;
}

/** Flat list of settings paths that use the shared placeholder (existing pages excluded). */
export const SETTINGS_PLACEHOLDER_ROUTES: { path: string; title: string }[] = [
  { path: 'discount-profiles', title: 'Discount Profiles' },
  { path: 'tax-profiles', title: 'Tax Profiles' },
  { path: 'bank-accounts', title: 'Bank Accounts' },
  { path: 'invoice-settings', title: 'Invoice Settings' },
  { path: 'cheques', title: 'Cheques' },
  { path: 'lease-settings', title: 'Lease Settings' },
  { path: 'management-fee-configuration', title: 'Management Fee Configuration' },
  { path: 'work-order-settings', title: 'Work Order Settings' },
  { path: 'maintenance-categories', title: 'Maintenance Categories' },
  { path: 'quotation-categories', title: 'Quotation Categories' },
  { path: 'po-settings', title: 'PO Settings' },
  { path: 'promotion-categories', title: 'Promotion Categories' },
  { path: 'inventory-categories', title: 'Inventory Categories' },
  { path: 'asset-categories', title: 'Asset Categories' },
  { path: 'tickets-settings', title: 'Tickets Settings' },
  { path: 'unit-types', title: 'Unit Types' },
  { path: 'property-types', title: 'Property Types' },
  { path: 'property-amenities', title: 'Property Amenities' },
  { path: 'custom-fields', title: 'Custom Fields' },
  { path: 'approvals', title: 'Approvals' },
  { path: 'internal-statuses', title: 'Internal Statuses' },
  { path: 'email-settings', title: 'Email settings' },
  { path: 'email-templates', title: 'Email Templates' },
  { path: 'notification-settings', title: 'Notification Settings' },
  { path: 'custom-links', title: 'Custom links' },
  { path: 'payment-gateways', title: 'Payment Gateways' },
  { path: 'servicehub/work-order-settings', title: 'Work Order Settings' },
  { path: 'servicehub/maintenance-categories', title: 'Maintenance Categories' },
  { path: 'servicehub/quotation-categories', title: 'Quotation Categories' },
  { path: 'servicehub/po-settings', title: 'PO Settings' },
  { path: 'servicehub/inventory-categories', title: 'Inventory Categories' },
  { path: 'servicehub/tickets-settings', title: 'Tickets Settings' },
  { path: 'servicehub/visiting-slots', title: 'Visiting Slots' },
  { path: 'broadcast-configuration', title: 'Broadcast Configuration' },
  { path: 'snaplist-preference', title: 'Snaplist Preference' },
];
