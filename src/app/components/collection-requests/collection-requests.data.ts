export type CollectionRequestStatus = 'Pending' | 'Received' | 'Processed' | 'Rejected';

/** Status badges — Figma 2559:66426 (solid fill, 4px, white text) */
export function collectionRequestStatusClass(status: CollectionRequestStatus | string): string {
  switch (status) {
    case 'Pending':
      return 'ov-status--warning';
    case 'Received':
      return 'ov-status--active';
    case 'Processed':
      return 'ov-status--info';
    case 'Rejected':
      return 'ov-status--blocked';
    default:
      return 'ov-status--muted';
  }
}

export interface CollectionRequestRow {
  id: string;
  collector: string;
  invoiceId: string;
  amount: string;
  status: CollectionRequestStatus;
  createdAt: string;
}

export interface CollectionRequestInvoice {
  invoiceId: string;
  property: string;
  unit: string;
  dueDate: string;
}

export interface CollectionRequestDetail extends CollectionRequestRow {
  tenant: string;
  collectionDate: string;
  approvedBy: string;
  invoices: CollectionRequestInvoice[];
}

export const COLLECTION_STATUS_TABS: Array<'All' | CollectionRequestStatus> = [
  'All',
  'Pending',
  'Received',
  'Processed',
  'Rejected'
];

export const COLLECTION_REQUEST_ROWS: CollectionRequestRow[] = [
  {
    id: '32153',
    collector: 'Foysal Rahman',
    invoiceId: 'INV - 12375',
    amount: 'AED 1500.00',
    status: 'Pending',
    createdAt: '06-07-2026'
  },
  {
    id: '32154',
    collector: 'Ashiqur Rahman',
    invoiceId: 'INV - 12376',
    amount: 'AED 1500.00',
    status: 'Received',
    createdAt: '06-07-2026'
  },
  {
    id: '32155',
    collector: 'Foysal Rahman',
    invoiceId: 'INV - 12377',
    amount: 'AED 1500.00',
    status: 'Processed',
    createdAt: '06-07-2026'
  },
  {
    id: '32156',
    collector: 'Ashiqur Rahman',
    invoiceId: 'INV - 12378',
    amount: 'AED 1500.00',
    status: 'Rejected',
    createdAt: '06-07-2026'
  },
  {
    id: '31',
    collector: 'Asif Asif',
    invoiceId: 'INV - 3215',
    amount: 'AED 2,500.00',
    status: 'Pending',
    createdAt: '06-06-2026'
  }
];

const DETAIL_EXTRAS: Record<
  string,
  Pick<CollectionRequestDetail, 'tenant' | 'collectionDate' | 'approvedBy' | 'invoices'>
> = {
  '31': {
    tenant: 'Abdullah Al Shakib',
    collectionDate: '06-06-2026',
    approvedBy: 'Manager',
    invoices: [
      {
        invoiceId: 'INV - 3215',
        property: 'Marina Heights Tower',
        unit: 'Apartment 209- PR-2',
        dueDate: '06-07-2026'
      }
    ]
  },
  '32153': {
    tenant: 'Foysal Rahman',
    collectionDate: '06-07-2026',
    approvedBy: 'Manager',
    invoices: [
      {
        invoiceId: 'INV - 12375',
        property: 'Marina Heights Tower',
        unit: 'Apartment 209- PR-2',
        dueDate: '06-07-2026'
      }
    ]
  }
};

export function getCollectionRequestDetail(id: string | null): CollectionRequestDetail {
  const row =
    COLLECTION_REQUEST_ROWS.find((item) => item.id === id) ||
    COLLECTION_REQUEST_ROWS.find((item) => item.id === '31') ||
    COLLECTION_REQUEST_ROWS[0];
  const extra = DETAIL_EXTRAS[row.id] || {
    tenant: row.collector,
    collectionDate: row.createdAt,
    approvedBy: 'Manager',
    invoices: [
      {
        invoiceId: row.invoiceId,
        property: 'Marina Heights Tower',
        unit: 'Apartment 209- PR-2',
        dueDate: row.createdAt
      }
    ]
  };

  return {
    ...row,
    ...extra
  };
}
