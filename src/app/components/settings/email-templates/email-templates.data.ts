export type EmailTemplateTarget =
  | 'Property Manager'
  | 'Tenant'
  | 'Vendor'
  | 'Landlord';

export interface EmailTemplateColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface EmailTemplateRow {
  id: number;
  name: string;
  description: string;
  target: EmailTemplateTarget;
}

export const EMAIL_TEMPLATE_TARGETS: EmailTemplateTarget[] = [
  'Property Manager',
  'Tenant',
  'Vendor',
  'Landlord',
];

/** Seed names shown on page 1 of the screenshot. */
const SCREENSHOT_ROWS: Omit<EmailTemplateRow, 'id'>[] = [
  { name: 'Agent Assigned to Lead', description: '', target: 'Property Manager' },
  { name: 'App download reminder email', description: '', target: 'Tenant' },
  { name: 'Approved Quotation', description: '', target: 'Property Manager' },
  { name: 'Assigned Task', description: '', target: 'Property Manager' },
  { name: 'Confirmed Reservation', description: '', target: 'Landlord' },
  { name: 'Confirmed Reservation', description: '', target: 'Property Manager' },
  { name: 'Confirmed Reservation', description: '', target: 'Tenant' },
  { name: 'Contract Expired', description: '', target: 'Landlord' },
  { name: 'Contract Expired', description: '', target: 'Property Manager' },
  { name: 'Contract Expired', description: '', target: 'Tenant' },
];

const EXTRA_NAMES: { name: string; target: EmailTemplateTarget }[] = [
  { name: 'Contract Renewal Reminder', target: 'Landlord' },
  { name: 'Contract Renewal Reminder', target: 'Property Manager' },
  { name: 'Contract Renewal Reminder', target: 'Tenant' },
  { name: 'Invoice Generated', target: 'Landlord' },
  { name: 'Invoice Generated', target: 'Property Manager' },
  { name: 'Invoice Generated', target: 'Tenant' },
  { name: 'Invoice Overdue', target: 'Landlord' },
  { name: 'Invoice Overdue', target: 'Property Manager' },
  { name: 'Invoice Overdue', target: 'Tenant' },
  { name: 'Lease Signed', target: 'Landlord' },
  { name: 'Lease Signed', target: 'Property Manager' },
  { name: 'Lease Signed', target: 'Tenant' },
  { name: 'Maintenance Completed', target: 'Property Manager' },
  { name: 'Maintenance Completed', target: 'Tenant' },
  { name: 'Maintenance Request Received', target: 'Property Manager' },
  { name: 'Maintenance Request Received', target: 'Tenant' },
  { name: 'New Lead Assigned', target: 'Property Manager' },
  { name: 'Payment Received', target: 'Landlord' },
  { name: 'Payment Received', target: 'Property Manager' },
  { name: 'Payment Received', target: 'Tenant' },
  { name: 'Quotation Sent', target: 'Property Manager' },
  { name: 'Quotation Sent', target: 'Vendor' },
  { name: 'Vendor Contract Expiring', target: 'Property Manager' },
  { name: 'Vendor Contract Expiring', target: 'Vendor' },
  { name: 'Vendor Invoice Approved', target: 'Vendor' },
  { name: 'Vendor Payment Processed', target: 'Vendor' },
  { name: 'Welcome Email', target: 'Tenant' },
  { name: 'Welcome Email', target: 'Landlord' },
  { name: 'Work Order Assigned', target: 'Property Manager' },
  { name: 'Work Order Assigned', target: 'Vendor' },
  { name: 'Work Order Completed', target: 'Property Manager' },
  { name: 'Work Order Completed', target: 'Tenant' },
  { name: 'Work Order Completed', target: 'Vendor' },
];

function buildDefaultEmailTemplates(): EmailTemplateRow[] {
  const rows: EmailTemplateRow[] = SCREENSHOT_ROWS.map((r, i) => ({
    id: i + 1,
    ...r,
  }));

  let id = rows.length + 1;
  for (const extra of EXTRA_NAMES) {
    rows.push({
      id: id++,
      name: extra.name,
      description: '',
      target: extra.target,
    });
  }

  // Pad to 123 total to match the screenshot badge / pagination.
  const fillers: { name: string; target: EmailTemplateTarget }[] = [
    { name: 'Booking Cancellation', target: 'Landlord' },
    { name: 'Booking Cancellation', target: 'Property Manager' },
    { name: 'Booking Cancellation', target: 'Tenant' },
    { name: 'Cheque Bounced Notice', target: 'Landlord' },
    { name: 'Cheque Bounced Notice', target: 'Property Manager' },
    { name: 'Cheque Bounced Notice', target: 'Tenant' },
    { name: 'Document Request', target: 'Landlord' },
    { name: 'Document Request', target: 'Property Manager' },
    { name: 'Document Request', target: 'Tenant' },
    { name: 'Inspection Scheduled', target: 'Landlord' },
    { name: 'Inspection Scheduled', target: 'Property Manager' },
    { name: 'Inspection Scheduled', target: 'Tenant' },
    { name: 'Move-in Checklist', target: 'Property Manager' },
    { name: 'Move-in Checklist', target: 'Tenant' },
    { name: 'Move-out Checklist', target: 'Property Manager' },
    { name: 'Move-out Checklist', target: 'Tenant' },
    { name: 'Password Reset', target: 'Landlord' },
    { name: 'Password Reset', target: 'Property Manager' },
    { name: 'Password Reset', target: 'Tenant' },
    { name: 'Password Reset', target: 'Vendor' },
    { name: 'Profile Verification', target: 'Landlord' },
    { name: 'Profile Verification', target: 'Property Manager' },
    { name: 'Profile Verification', target: 'Tenant' },
    { name: 'Rent Reminder', target: 'Landlord' },
    { name: 'Rent Reminder', target: 'Property Manager' },
    { name: 'Rent Reminder', target: 'Tenant' },
    { name: 'Reservation Cancelled', target: 'Landlord' },
    { name: 'Reservation Cancelled', target: 'Property Manager' },
    { name: 'Reservation Cancelled', target: 'Tenant' },
    { name: 'Service Request Update', target: 'Property Manager' },
    { name: 'Service Request Update', target: 'Tenant' },
    { name: 'Task Completed', target: 'Property Manager' },
    { name: 'Ticket Closed', target: 'Property Manager' },
    { name: 'Ticket Closed', target: 'Tenant' },
    { name: 'Ticket Created', target: 'Property Manager' },
    { name: 'Ticket Created', target: 'Tenant' },
    { name: 'Unit Available Notice', target: 'Property Manager' },
    { name: 'Unit Available Notice', target: 'Landlord' },
    { name: 'Vendor Invitation', target: 'Vendor' },
    { name: 'Viewing Scheduled', target: 'Landlord' },
    { name: 'Viewing Scheduled', target: 'Property Manager' },
    { name: 'Viewing Scheduled', target: 'Tenant' },
    { name: 'Broadcast Announcement', target: 'Property Manager' },
    { name: 'Broadcast Announcement', target: 'Tenant' },
    { name: 'Broadcast Announcement', target: 'Landlord' },
    { name: 'Commission Statement', target: 'Property Manager' },
    { name: 'Deposit Refund', target: 'Tenant' },
    { name: 'Deposit Refund', target: 'Property Manager' },
    { name: 'Late Fee Notice', target: 'Tenant' },
    { name: 'Late Fee Notice', target: 'Property Manager' },
    { name: 'Lease Amendment', target: 'Landlord' },
    { name: 'Lease Amendment', target: 'Property Manager' },
    { name: 'Lease Amendment', target: 'Tenant' },
    { name: 'Owner Statement Ready', target: 'Landlord' },
    { name: 'Owner Statement Ready', target: 'Property Manager' },
    { name: 'Portal Access Granted', target: 'Landlord' },
    { name: 'Portal Access Granted', target: 'Tenant' },
    { name: 'Portal Access Granted', target: 'Vendor' },
    { name: 'Quotation Rejected', target: 'Property Manager' },
    { name: 'Quotation Rejected', target: 'Vendor' },
    { name: 'Refund Processed', target: 'Tenant' },
    { name: 'Refund Processed', target: 'Property Manager' },
    { name: 'Security Deposit Held', target: 'Tenant' },
    { name: 'Security Deposit Held', target: 'Property Manager' },
    { name: 'Survey Invitation', target: 'Tenant' },
    { name: 'Survey Invitation', target: 'Landlord' },
    { name: 'Vendor Onboarding', target: 'Vendor' },
    { name: 'Weekly Digest', target: 'Property Manager' },
    { name: 'Weekly Digest', target: 'Landlord' },
  ];

  for (const f of fillers) {
    if (rows.length >= 123) {
      break;
    }
    rows.push({
      id: id++,
      name: f.name,
      description: '',
      target: f.target,
    });
  }

  while (rows.length < 123) {
    const n = rows.length + 1;
    const targets = EMAIL_TEMPLATE_TARGETS;
    rows.push({
      id: id++,
      name: `Email Template ${n}`,
      description: '',
      target: targets[n % targets.length],
    });
  }

  return rows;
}

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateRow[] = buildDefaultEmailTemplates();
