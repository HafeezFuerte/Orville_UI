export type InternalStatusModule =
  | 'Work Orders'
  | 'Leases'
  | 'Units'
  | 'Properties'
  | 'Tickets'
  | 'Inspections';

export interface InternalStatusColorOption {
  key: string;
  label: string;
  /** Theme-safe CSS color using DS semantic tokens where possible. */
  cssVar: string;
}

export interface InternalStatusColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface InternalStatusRow {
  id: number;
  name: string;
  module: InternalStatusModule;
  colorKey: string;
  hasAssociatedRecords: boolean;
}

export interface InternalStatusDraft {
  name: string;
  module: InternalStatusModule | '';
  colorKey: string;
}

export const INTERNAL_STATUS_MODULES: InternalStatusModule[] = [
  'Work Orders',
  'Leases',
  'Units',
  'Properties',
  'Tickets',
  'Inspections',
];

/** Named colors for the Color select — mapped to Orville semantic / brand tokens. */
export const INTERNAL_STATUS_COLORS: InternalStatusColorOption[] = [
  { key: 'success', label: 'Success', cssVar: 'rgb(var(--success-rgb, 39 134 91))' },
  { key: 'warning', label: 'Warning', cssVar: 'rgb(var(--warning-rgb, 208 138 40))' },
  { key: 'error', label: 'Error', cssVar: 'rgb(var(--danger-rgb, 201 74 74))' },
  { key: 'info', label: 'Information', cssVar: 'rgb(var(--info-rgb, 62 111 168))' },
  { key: 'primary', label: 'Primary', cssVar: 'rgb(var(--primary-rgb))' },
  { key: 'muted', label: 'Muted', cssVar: 'rgb(var(--text-muted))' },
];

export const EMPTY_INTERNAL_STATUS: InternalStatusDraft = {
  name: '',
  module: '',
  colorKey: '',
};

/** Starts empty to match the screenshot empty state. */
export const DEFAULT_INTERNAL_STATUSES: InternalStatusRow[] = [];
