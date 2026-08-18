export type ChequeStatus =
  | 'Deposited'
  | 'Undeposited'
  | 'Pending'
  | 'Cleared'
  | 'Bounced'
  | 'Withdrawn'
  | 'Returned'
  | 'Void'
  | 'Redeposited';

export interface ChequeRow {
  id: string;
  invoiceId: string;
  chequeNo: string;
  bankNo: string;
  bankName: string;
  chequeDate: string;
  heldBy: string;
  amount: string;
  status: ChequeStatus;
  createdAt: string;
  inHand: 'Yes' | 'No';
  returned: 'Yes' | 'No';
  returnedDate: string;
  bounceDate: string;
  bounceReason: string;
  withdrawalReason: string;
  contactName: string;
  landlord: string;
  unit: string;
  attachment: string;
}

export const CHEQUE_STATUS_TABS: Array<'All' | ChequeStatus> = [
  'All',
  'Deposited',
  'Undeposited',
  'Pending',
  'Cleared',
  'Bounced',
  'Withdrawn',
  'Returned',
  'Void',
  'Redeposited'
];

export const CHEQUE_KPIS = [
  { label: 'Total Amount', value: 'AED 54.84M', sub: 'Total value of all cheques' },
  { label: 'Total Paid', value: 'AED 51.27M', sub: 'Total cleared cheque value' },
  { label: 'Total Outstanding', value: 'AED 3.57M', sub: 'Outstanding amount (Total - Cleared)' }
];

export const CHEQUE_ROWS: ChequeRow[] = [
  {
    id: 'CHQ-001',
    invoiceId: 'INV-1042',
    chequeNo: '102938',
    bankNo: '033',
    bankName: 'Emirates NBD',
    chequeDate: '12-06-2026',
    heldBy: 'Finance',
    amount: 'AED 12,500.00',
    status: 'Cleared',
    createdAt: '10-06-2026',
    inHand: 'Yes',
    returned: 'No',
    returnedDate: '-',
    bounceDate: '-',
    bounceReason: '-',
    withdrawalReason: '-',
    contactName: 'John Smith',
    landlord: 'Orville Real Estate',
    unit: 'A-101',
    attachment: 'cheque_scan.pdf'
  },
  {
    id: 'CHQ-002',
    invoiceId: 'INV-1048',
    chequeNo: '102941',
    bankNo: '003',
    bankName: 'ADCB',
    chequeDate: '18-06-2026',
    heldBy: 'Accounts',
    amount: 'AED 8,750.00',
    status: 'Pending',
    createdAt: '15-06-2026',
    inHand: 'Yes',
    returned: 'No',
    returnedDate: '-',
    bounceDate: '-',
    bounceReason: '-',
    withdrawalReason: '-',
    contactName: 'Fatima Al Zarooni',
    landlord: 'Orville Real Estate',
    unit: 'B-204',
    attachment: 'chq_002.pdf'
  },
  {
    id: 'CHQ-003',
    invoiceId: 'INV-1051',
    chequeNo: '102955',
    bankNo: '016',
    bankName: 'Mashreq',
    chequeDate: '11-06-2026',
    heldBy: 'Collections',
    amount: 'AED 4,200.00',
    status: 'Bounced',
    createdAt: '09-06-2026',
    inHand: 'No',
    returned: 'Yes',
    returnedDate: '14-06-2026',
    bounceDate: '11-06-2026',
    bounceReason: 'Insufficient Funds',
    withdrawalReason: '-',
    contactName: 'Hassan Malik',
    landlord: 'Orville Real Estate',
    unit: 'C-12',
    attachment: 'bounce_notice.pdf'
  },
  {
    id: 'CHQ-004',
    invoiceId: 'INV-1055',
    chequeNo: '102960',
    bankNo: '050',
    bankName: 'FAB',
    chequeDate: '20-06-2026',
    heldBy: 'Tenant',
    amount: 'AED 15,000.00',
    status: 'Withdrawn',
    createdAt: '19-06-2026',
    inHand: 'No',
    returned: 'No',
    returnedDate: '-',
    bounceDate: '-',
    bounceReason: '-',
    withdrawalReason: 'Customer Request',
    contactName: 'Sara Khan',
    landlord: 'Orville Real Estate',
    unit: 'A-305',
    attachment: '-'
  }
];
