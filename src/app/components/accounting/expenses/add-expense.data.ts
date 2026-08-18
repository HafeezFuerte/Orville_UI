export const EXPENSE_VENDORS = [
  'Al Futtaim Facilities',
  'Enova',
  'Khidmah',
  'Imdaad'
];

export const EXPENSE_PROPERTIES = [
  'Orville Tower',
  'Marina Gate',
  'Downtown Residences'
];

export const EXPENSE_UNITS = ['101', '102', '201', 'Common'];

export const EXPENSE_PAYMENT_VIA = ['Cheque', 'Cash', 'Bank Transfer', 'Card'];

export const EXPENSE_TYPES = ['Bill', 'Credit', 'Deposit', 'Charge'];

export const EXPENSE_ACCOUNTS = [
  'Maintenance Expense',
  'Utility Expense',
  'Rental Income',
  'Cleaning Expense'
];

export const EXPENSE_LINE_STATUSES = ['Draft', 'Unpaid', 'Paid', 'Partial'];

export const EXPENSE_TAX_PROFILES = ['5% VAT', 'Zero Rated', 'Exempt'];

export const EXPENSE_BANKS = ['ENBD Bank', 'ADCB', 'FAB', 'Mashreq'];

export const EXPENSE_MONEY_HELD_BY = ['Company', 'Landlord', 'Vendor', 'Agent'];

export interface ExpenseCheque {
  id: string;
  chequeNo: string;
  bankName: string;
  chequeDate: string;
  amount: number;
  inHand: string;
  moneyHeldBy: string;
  status: string;
  attachment: string;
}

export interface ExpenseLineItem {
  id: string;
  inclusiveTax: string;
  description: string;
  price: number;
  tax: number;
  taxProfile: string;
  discount: number;
  discountPct: number;
  paid: number;
  account: string;
  status: string;
}

export const INITIAL_EXPENSE_CHEQUES: ExpenseCheque[] = [
  {
    id: '405943',
    chequeNo: 'CH-2531',
    bankName: 'ENBD Bank',
    chequeDate: '09-07-2026',
    amount: 500,
    inHand: 'Deposited',
    moneyHeldBy: 'Company',
    status: 'Pending',
    attachment: 'Cheque-image.jpg'
  }
];

export const INITIAL_EXPENSE_LINES: ExpenseLineItem[] = [
  {
    id: '405943',
    inclusiveTax: 'Yes',
    description: 'Monthly service charge',
    price: 1250,
    tax: 62.5,
    taxProfile: '5% VAT',
    discount: 0,
    discountPct: 0,
    paid: 0,
    account: 'Rental Income',
    status: 'Draft'
  }
];
