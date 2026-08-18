export type ExpenseStatus =
  | 'Draft'
  | 'Unpaid'
  | 'Paid'
  | 'Hold'
  | 'Void'
  | 'Write Off'
  | 'Bounced'
  | 'Overdue';

export interface ExpenseRow {
  id: string;
  billNumber: string;
  unitCommonArea: string;
  leaseDetails: string;
  chequeNo: string;
  account: string;
  bankName: string;
  totalAmount: string;
  dueDate: string;
  issueDate: string;
  paidDate: string;
  createdBy: string;
  status: ExpenseStatus;
}

export const EXPENSE_STATUS_TABS: Array<'All' | ExpenseStatus> = [
  'All',
  'Draft',
  'Unpaid',
  'Paid',
  'Hold',
  'Void',
  'Write Off',
  'Bounced'
];

export const EXPENSE_ROWS: ExpenseRow[] = [
  {
    id: '1817909',
    billNumber: 'BILL-26-00012',
    unitCommonArea: '103-PR-10',
    leaseDetails: 'LS-26-00421',
    chequeNo: '67223',
    account: 'Maintenance Expense',
    bankName: 'ENBD Bank',
    totalAmount: 'AED 1,000.00',
    dueDate: '10-07-2026',
    issueDate: '06-07-2026',
    paidDate: '-',
    createdBy: 'Manager',
    status: 'Unpaid'
  },
  {
    id: '1817910',
    billNumber: 'BILL-26-00013',
    unitCommonArea: '201-PR-1',
    leaseDetails: 'LS-26-00422',
    chequeNo: '67224',
    account: 'Utility Expense',
    bankName: 'ADCB',
    totalAmount: 'AED 1,000.00',
    dueDate: '10-07-2026',
    issueDate: '06-07-2026',
    paidDate: '09-07-2026',
    createdBy: 'Manager',
    status: 'Paid'
  },
  {
    id: '1817911',
    billNumber: 'BILL-26-00014',
    unitCommonArea: 'Common Area',
    leaseDetails: '-',
    chequeNo: '-',
    account: 'Cleaning Expense',
    bankName: 'FAB',
    totalAmount: 'AED 1,000.00',
    dueDate: '12-07-2026',
    issueDate: '06-07-2026',
    paidDate: '-',
    createdBy: 'Manager',
    status: 'Draft'
  },
  {
    id: '1817912',
    billNumber: 'BILL-26-00015',
    unitCommonArea: '215-PR-1',
    leaseDetails: 'LS-26-00430',
    chequeNo: '67226',
    account: 'Repair Expense',
    bankName: 'ENBD Bank',
    totalAmount: 'AED 1,000.00',
    dueDate: '01-07-2026',
    issueDate: '06-06-2026',
    paidDate: '-',
    createdBy: 'Manager',
    status: 'Overdue'
  },
  {
    id: '1817913',
    billNumber: 'BILL-26-00016',
    unitCommonArea: '108-PR-10',
    leaseDetails: 'LS-26-00431',
    chequeNo: '67227',
    account: 'Maintenance Expense',
    bankName: 'Mashreq',
    totalAmount: 'AED 1,000.00',
    dueDate: '10-07-2026',
    issueDate: '06-07-2026',
    paidDate: '-',
    createdBy: 'Manager',
    status: 'Unpaid'
  },
  {
    id: '1817914',
    billNumber: 'BILL-26-00017',
    unitCommonArea: '110-PR-2',
    leaseDetails: 'LS-26-00432',
    chequeNo: '67228',
    account: 'Security Expense',
    bankName: 'ENBD Bank',
    totalAmount: 'AED 2,400.00',
    dueDate: '15-07-2026',
    issueDate: '07-07-2026',
    paidDate: '-',
    createdBy: 'Manager',
    status: 'Hold'
  },
  {
    id: '1817915',
    billNumber: 'BILL-26-00018',
    unitCommonArea: '301-PR-4',
    leaseDetails: 'LS-26-00433',
    chequeNo: '-',
    account: 'Legal Expense',
    bankName: 'ADCB',
    totalAmount: 'AED 3,500.00',
    dueDate: '20-07-2026',
    issueDate: '08-07-2026',
    paidDate: '-',
    createdBy: 'Manager',
    status: 'Void'
  },
  {
    id: '1817916',
    billNumber: 'BILL-26-00019',
    unitCommonArea: 'Common Area',
    leaseDetails: '-',
    chequeNo: '67230',
    account: 'Insurance Expense',
    bankName: 'FAB',
    totalAmount: 'AED 5,000.00',
    dueDate: '18-07-2026',
    issueDate: '08-07-2026',
    paidDate: '-',
    createdBy: 'Manager',
    status: 'Write Off'
  },
  {
    id: '1817917',
    billNumber: 'BILL-26-00020',
    unitCommonArea: '205-PR-8',
    leaseDetails: 'LS-26-00440',
    chequeNo: '67231',
    account: 'Utility Expense',
    bankName: 'Mashreq',
    totalAmount: 'AED 1,250.00',
    dueDate: '05-07-2026',
    issueDate: '01-07-2026',
    paidDate: '-',
    createdBy: 'Manager',
    status: 'Bounced'
  }
];

export const EXPENSE_KPIS = [
  { label: 'Total Amount', value: 'AED 54.84M', sub: '324 expenses issued' },
  { label: 'Total Paid', value: 'AED 51.27M', sub: '276 expenses fully paid' },
  { label: 'Total Outstanding', value: 'AED 3.57M', sub: '48 expenses pending payment' },
  { label: 'Overdue', value: 'AED 1.24M', sub: '31 expenses need follow-up' }
];
