export interface CreditNoteRow {
  id: string;code?: string;
  date: string;
  contact: string;
  account: string;
  amount: string;
  remainingCredit: string;
  notes: string;
  createdBy: string;
  created: string;
}

export const CREDIT_NOTE_TENANTS = [
  'Adil Shahzad',
  'Fatima Al Zarooni',
  'Orville Real Estate',
  'Hassan Malik'
];

export const CREDIT_NOTE_ACCOUNTS = [
  'Rental Income',
  '4000 Service Charge',
  'Maintenance Income',
  'Late Fee Income'
];

export const CREDIT_NOTE_ROWS: CreditNoteRow[] = [
  {
    id: '1817909',
    date: '09-07-2026',
    contact: 'Adil Shahzad',
    account: 'Rental Income',
    amount: 'AED 1,250.00',
    remainingCredit: 'AED 0.00',
    notes: 'Overpayment on July invoice',
    createdBy: 'Manager',
    created: '09-07-2026'
  },
  {
    id: '1817910',
    date: '08-07-2026',
    contact: 'Fatima Al Zarooni',
    account: '4000 Service Charge',
    amount: 'AED 500.00',
    remainingCredit: 'AED 125.00',
    notes: 'Service charge adjustment',
    createdBy: 'Manager',
    created: '08-07-2026'
  },
  {
    id: '1817911',
    date: '06-07-2026',
    contact: 'Orville Real Estate',
    account: 'Maintenance Income',
    amount: 'AED 750.00',
    remainingCredit: 'AED 0.00',
    notes: 'Credit against work order',
    createdBy: 'Admin',
    created: '06-07-2026'
  },
  {
    id: '1817912',
    date: '04-07-2026',
    contact: 'Hassan Malik',
    account: 'Rental Income',
    amount: 'AED 2,000.00',
    remainingCredit: 'AED 2,000.00',
    notes: 'Advance rent credit',
    createdBy: 'Manager',
    created: '04-07-2026'
  },
  {
    id: '1817913',
    date: '01-07-2026',
    contact: 'Adil Shahzad',
    account: 'Late Fee Income',
    amount: 'AED 150.00',
    remainingCredit: 'AED 0.00',
    notes: 'Late fee waived',
    createdBy: 'Admin',
    created: '01-07-2026'
  }
];
