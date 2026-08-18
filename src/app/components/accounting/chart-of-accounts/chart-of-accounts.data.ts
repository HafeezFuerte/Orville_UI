export type AccountType = 'Asset' | 'Equity' | 'Expense' | 'Liability' | 'Income';

export interface ChartAccountRow {
  id: string;
  accountNumber: string;
  name: string;
  description: string;
  type: AccountType;
  subType: string;
  subAccount: 'Yes' | 'No';
  createdBy: string;
  created: string;
}

export const ACCOUNT_TYPE_TABS: Array<'All' | AccountType> = [
  'All',
  'Asset',
  'Equity',
  'Expense',
  'Liability',
  'Income'
];

export const ACCOUNT_NAMES = [
  'Cash on Hand',
  'Bank - ENBD',
  'Accounts Receivable',
  'Owner Equity',
  'Maintenance Expense',
  'Accounts Payable',
  'Rental Income'
];

export const ACCOUNT_PARENTS = [
  'Current Assets',
  'Fixed Assets',
  'Operating Expenses',
  'Liabilities',
  'Income'
];

export const ACCOUNT_CATEGORIES = [
  'Cash',
  'Bank',
  'Receivable',
  'Payable',
  'Equity',
  'Expense',
  'Income'
];

export const CHART_ACCOUNT_ROWS: ChartAccountRow[] = [
  {
    id: '1817909',
    accountNumber: '53443',
    name: 'Muhammad Junaid',
    description: '-',
    type: 'Asset',
    subType: 'Current Asset',
    subAccount: 'Yes',
    createdBy: 'Zaid Rahman',
    created: '09-07-2026'
  },
  {
    id: '1817910',
    accountNumber: '53444',
    name: 'Owner Equity',
    description: '-',
    type: 'Equity',
    subType: 'Equity',
    subAccount: 'No',
    createdBy: 'Zaid Rahman',
    created: '08-07-2026'
  },
  {
    id: '1817911',
    accountNumber: '53445',
    name: 'Maintenance Expense',
    description: '-',
    type: 'Expense',
    subType: 'Operating Expense',
    subAccount: 'No',
    createdBy: 'Manager',
    created: '06-07-2026'
  },
  {
    id: '1817912',
    accountNumber: '53446',
    name: 'Vendor Payable',
    description: '-',
    type: 'Liability',
    subType: 'Current Liability',
    subAccount: 'Yes',
    createdBy: 'Admin',
    created: '04-07-2026'
  },
  {
    id: '1817913',
    accountNumber: '53447',
    name: 'Rental Income',
    description: '-',
    type: 'Income',
    subType: 'Operating Income',
    subAccount: 'No',
    createdBy: 'Zaid Rahman',
    created: '01-07-2026'
  }
];
