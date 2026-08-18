export type InvoiceStatus =
  | 'Draft'
  | 'Unpaid'
  | 'Paid'
  | 'Hold'
  | 'Void'
  | 'Write Off'
  | 'Bounced'
  | 'Overdue'
  | 'Pending Approvals';

export interface InvoiceRow {
  id: string;
  status: InvoiceStatus;
  to: string;
  unitCommonArea: string;
  invoiceNumber: string;
  chequeNo: string;
  invoiceDate: string;
  invoiceType: string;
  account: string;
  currency: string;
  propertyName: string;
  propertyId: string;
  leaseId: string;
  leaseStatus: string;
  note: string;
  workOrder: string;
  amount: string;
  grossAmount: string;
  paid: string;
  paymentVia: string;
  moneyHeldBy: string;
  ddRefNo: string;
  bankName: string;
  internalStatus: string;
  archived: string;
  dueDate: string;
  paidDate: string;
  cheques: string;
  days: string;
  writeAmountOff: string;
  createdBy: string;
}

export const INVOICE_STATUS_TABS: Array<'All' | InvoiceStatus> = [
  'All',
  'Draft',
  'Unpaid',
  'Paid',
  'Hold',
  'Void',
  'Write Off',
  'Bounced',
  'Pending Approvals'
];

const extra = {
  currency: 'AED',
  propertyName: 'Marina Heights Tower',
  propertyId: '12534',
  leaseId: '53443',
  leaseStatus: 'Active',
  note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  workOrder: 'Repair Water Leak',
  amount: 'AED 1,000.00',
  grossAmount: 'AED 1,000.00',
  paid: 'AED 500.00',
  paymentVia: 'Cash',
  moneyHeldBy: 'Company',
  ddRefNo: 'DF2512689',
  bankName: 'ENBD Bank',
  internalStatus: 'All',
  archived: '-',
  dueDate: '10-06-2026',
  paidDate: '09-07-2026',
  cheques: '-',
  days: '20 Days',
  writeAmountOff: 'AED 0.00',
  createdBy: 'Manager'
};

export const INVOICE_ROWS: InvoiceRow[] = [
  {
    id: '1817909',
    status: 'Unpaid',
    to: 'Atif Shahzad',
    unitCommonArea: '103-PR-10',
    invoiceNumber: 'INV-26-00067223',
    chequeNo: '67223',
    invoiceDate: '06-07-2026',
    invoiceType: 'Charge',
    account: 'Rental Income',
    ...extra
  },
  {
    id: '1817910',
    status: 'Paid',
    to: 'Atif Shahzad',
    unitCommonArea: '103-PR-10',
    invoiceNumber: 'INV-26-00067224',
    chequeNo: '67224',
    invoiceDate: '06-07-2026',
    invoiceType: 'Charge',
    account: 'Rental Income',
    ...extra,
    paid: 'AED 1,000.00'
  },
  {
    id: '1817911',
    status: 'Draft',
    to: 'Atif Shahzad',
    unitCommonArea: '103-PR-10',
    invoiceNumber: 'INV-26-00067225',
    chequeNo: '67225',
    invoiceDate: '06-07-2026',
    invoiceType: 'Charge',
    account: 'Rental Income',
    ...extra,
    paid: 'AED 0.00',
    paidDate: '-'
  },
  {
    id: '1817912',
    status: 'Overdue',
    to: 'Atif Shahzad',
    unitCommonArea: '103-PR-10',
    invoiceNumber: 'INV-26-00067226',
    chequeNo: '67226',
    invoiceDate: '06-07-2026',
    invoiceType: 'Charge',
    account: 'Rental Income',
    ...extra
  },
  {
    id: '1817913',
    status: 'Unpaid',
    to: 'Atif Shahzad',
    unitCommonArea: '103-PR-10',
    invoiceNumber: 'INV-26-00067227',
    chequeNo: '67227',
    invoiceDate: '06-07-2026',
    invoiceType: 'Charge',
    account: 'Rental Income',
    ...extra
  }
];

export const INVOICE_KPIS = [
  { label: 'Total Amount', value: 'AED 54.84M', sub: '324 invoices issued' },
  { label: 'Total Paid', value: 'AED 51.27M', sub: '276 invoices fully paid' },
  { label: 'Total Outstanding', value: 'AED 3.57M', sub: '48 invoices pending payment' },
  { label: 'Overdue', value: 'AED 1.24M', sub: '31 invoices need follow-up' }
];
