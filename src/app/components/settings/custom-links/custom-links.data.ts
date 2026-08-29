export type CustomLinkAudience = 'tenants' | 'landlords' | 'vendors';

export interface CustomLinkColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface CustomLinkRow {
  id: number;
  name: string;
  url: string;
  shareWithTenants: boolean;
  shareWithLandlords: boolean;
  shareWithVendors: boolean;
  updatedAt: string;
}

export interface CustomLinkDraft {
  name: string;
  url: string;
  shareWithTenants: boolean;
  shareWithLandlords: boolean;
  shareWithVendors: boolean;
}

export const EMPTY_CUSTOM_LINK: CustomLinkDraft = {
  name: '',
  url: '',
  shareWithTenants: false,
  shareWithLandlords: false,
  shareWithVendors: false,
};

/** Starts empty to match the screenshot. */
export const DEFAULT_CUSTOM_LINKS: CustomLinkRow[] = [];

export function formatShareWith(row: Pick<
  CustomLinkRow,
  'shareWithTenants' | 'shareWithLandlords' | 'shareWithVendors'
>): string {
  const parts: string[] = [];
  if (row.shareWithTenants) {
    parts.push('Tenants');
  }
  if (row.shareWithLandlords) {
    parts.push('Landlords');
  }
  if (row.shareWithVendors) {
    parts.push('Vendors');
  }
  return parts.length ? parts.join(', ') : '—';
}
