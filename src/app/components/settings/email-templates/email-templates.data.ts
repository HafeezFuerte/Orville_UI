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
  description?: string;
  target: EmailTemplateTarget;
  code?: string;
  feature?: string;
  subject?: string;
  to_address?: string;
  bcc_address?: string;
  format?: string;
  template_type?: number;
  format_type?: number;
}

export const EMAIL_TEMPLATE_TARGETS: EmailTemplateTarget[] = [
  'Property Manager',
  'Tenant',
  'Vendor',
  'Landlord',
];

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateRow[] = [];
