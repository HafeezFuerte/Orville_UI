export const INVOICE_CUSTOMERS = [
  'Adil Shahzad',
  'Orville Real Estate',
  'Fatima Al Zarooni'
];

export const INVOICE_LEASES = [
  'Apartment-201-PR-1',
  'Villa-12-PR-4',
  'Office-8-PR-2'
];

export const INVOICE_PAYMENT_VIA = ['Cheque', 'Cash', 'Bank Transfer', 'Card'];

export const INVOICE_MONEY_HELD_BY = ['Company', 'Landlord', 'Agent'];

export const INVOICE_TYPES = ['Charge', 'Credit', 'Deposit'];

export const INVOICE_ACCOUNTS = [
  'Rental Income',
  '4000 Service Charge',
  'Late Fee Income',
  'Maintenance Income'
];

export const INVOICE_LINE_STATUSES = ['Unpaid', 'Paid', 'Partial'];

export const CHEQUE_STATUSES = ['Pending', 'Deposited', 'Cleared', 'Bounced'];

export const CHEQUE_IN_HAND = ['Yes', 'No'];

export const BANKS = ['ENBD Bank', 'ADCB', 'FAB', 'Mashreq'];

export interface InvoiceLineItem {
  id: string;
  inclusiveTax: string;
  description: string;
  price: number;
  tax: number;
  discount: number;
  discountPct: number;
  paid: number;
  account: string;
  status: string;
}

export interface InvoiceCheque {
  id: string;
  chequeNo: string;
  bankName: string;
  chequeDate: string;
  amount: number;
  inHand: string;
  status: string;
  attachment: string;
}

export const INITIAL_LINE_ITEMS: InvoiceLineItem[] = [
  {
    id: '405943',
    inclusiveTax: 'Yes',
    description: 'Monthly service charge',
    price: 1250,
    tax: 62.5,
    discount: 0,
    discountPct: 0,
    paid: 0,
    account: 'Rental Income',
    status: 'Unpaid'
  }
];

export const INITIAL_CHEQUES: InvoiceCheque[] = [
  {
    id: '405943',
    chequeNo: 'CH-2531',
    bankName: 'ENBD Bank',
    chequeDate: '09-07-2026',
    amount: 500,
    inHand: 'Yes',
    status: 'Pending',
    attachment: 'Cheque-image.jpg'
  }
];
