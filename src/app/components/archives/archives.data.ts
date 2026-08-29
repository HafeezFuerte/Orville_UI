export type ArchiveTabId =
  | 'properties'
  | 'units'
  | 'tenants'
  | 'landlords'
  | 'leases'
  | 'invoices'
  | 'broadcasts'
  | 'projects'
  | 'events'
  | 'promotions'
  | 'assets'
  | 'quotations'
  | 'tickets'
  | 'inventory'
  | 'purchase-orders'
  | 'litigations'
  | 'work-orders';

export interface ArchiveTab {
  id: ArchiveTabId;
  label: string;
}

/** Screenshot entity tabs (left → right). */
export const ARCHIVE_TABS: ArchiveTab[] = [
  { id: 'properties', label: 'Properties' },
  { id: 'units', label: 'Units' },
  { id: 'tenants', label: 'Tenants' },
  { id: 'landlords', label: 'Landlords' },
  { id: 'leases', label: 'Leases' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'broadcasts', label: 'Broadcasts' },
  { id: 'projects', label: 'Projects' },
  { id: 'events', label: 'Events' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'assets', label: 'Assets' },
  { id: 'quotations', label: 'Quotations' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'inventory', label: 'Inventory Items' },
  { id: 'purchase-orders', label: 'Purchase Orders' },
  { id: 'litigations', label: 'Litigations' },
  { id: 'work-orders', label: 'Work Orders' },
];

export interface ArchivedRecord {
  id: string;
  name: string;
  address?: string;
  totalLeases?: number | string;
  totalUnits?: number | string;
  deletedAt: string;
  archivedBy: string;
  /** Used for search on non-property tabs */
  city?: string;
}

/** Properties tab sample rows from screenshot. */
export const ARCHIVED_PROPERTIES: ArchivedRecord[] = [
  {
    id: 'PR-1042',
    name: 'TEST BUILDING-4',
    address: 'Al Quoz, Dubai',
    totalLeases: 0,
    totalUnits: 12,
    deletedAt: '12-03-2026',
    archivedBy: 'Prashanth',
    city: 'Dubai',
  },
  {
    id: 'PR-1041',
    name: 'TEST BUILDING-3',
    address: 'Business Bay, Dubai',
    totalLeases: 2,
    totalUnits: 8,
    deletedAt: '10-03-2026',
    archivedBy: 'Prashanth',
    city: 'Dubai',
  },
];

export function getArchivedRows(tab: ArchiveTabId): ArchivedRecord[] {
  if (tab === 'properties') {
    return [...ARCHIVED_PROPERTIES];
  }
  return [];
}
