export interface InvoiceDetail {
  id: string;
  recordId: string;
  invoiceNo: string;
  type: string;
  tenant: string;
  lease: string;
  issueDate: string;
  dueDate: string;
  paymentVia: string;
  preparedBy: string;
  amountDue: string;
  referenceNo: string;
  subtotal: string;
  tax: string;
  discount: string;
  balance: string;
  amountPaid: string;
  qbStatus: string;
  customerId: string;
  note: string;
  attachment: string;
  receiptNo: string;
  status: string;
}

export interface InvoiceCol {
  key: string;
  label: string;
  visible: boolean;
}

export interface InvoiceOverviewRow {
  id: string;
  inclusiveTax: string;
  description: string;
  price: string;
  tax: string;
  discount: string;
  discountPct: string;
  total: string;
}

export interface InvoiceChequeRow {
  id: string;
  chequeNo: string;
  bankName: string;
  chequeDate: string;
  amount: string;
  inHand: string;
  status: string;
  attachment: string;
}

export interface InvoiceTxnRow {
  id: string;
  qbStatus: string;
  lineItemId: string;
  account: string;
  receivingAccount: string;
  paymentMethod: string;
  details: string;
  paidDate: string;
  amount: string;
}

export interface InvoicePenaltyRow {
  id: string;
  paymentMethod: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  note: string;
}

export const INVOICE_DETAIL: InvoiceDetail = {
  id: '1818508',
  recordId: '31658',
  invoiceNo: 'INV-26-00067254',
  type: 'Tenant Invoice',
  tenant: 'Hafeez Hafeez',
  lease: 'Apartment 201-PR-1',
  issueDate: '09-07-2026',
  dueDate: '09-07-2026',
  paymentVia: 'Cheque',
  preparedBy: 'Zaid Rahman',
  amountDue: 'AED 3000.00',
  referenceNo: '#5234',
  subtotal: 'AED 0.00',
  tax: 'AED 0.00',
  discount: 'AED 0.00',
  balance: 'AED 0.00',
  amountPaid: 'AED 0.00',
  qbStatus: 'Synced',
  customerId: '1854',
  note: '',
  attachment: '',
  receiptNo: '',
  status: 'Draft'
};

export const INVOICE_OVERVIEW_ROWS: InvoiceOverviewRow[] = [
  {
    id: '405943',
    inclusiveTax: 'Yes',
    description: 'Monthly service charge',
    price: 'AED 1,250.00',
    tax: 'AED 62.50',
    discount: 'AED 0.00',
    discountPct: '0%',
    total: 'AED 1,312.50'
  }
];

export const INVOICE_CHEQUE_ROWS: InvoiceChequeRow[] = [
  {
    id: '405943',
    chequeNo: 'CH-2531',
    bankName: 'ENBD Bank',
    chequeDate: '09-07-2026',
    amount: 'AED 500.00',
    inHand: 'Deposited',
    status: 'Pending',
    attachment: 'Cheque-image.jpg'
  }
];

export const INVOICE_TXN_ROWS: InvoiceTxnRow[] = [
  {
    id: '405943',
    qbStatus: 'Not synced',
    lineItemId: '1803870',
    account: 'Rental Income',
    receivingAccount: 'Account',
    paymentMethod: 'Cash',
    details: '-',
    paidDate: '07-06-2026',
    amount: 'AED 1,312.50'
  }
];

export const INVOICE_PENALTY_ROWS: InvoicePenaltyRow[] = [
  {
    id: '405943',
    paymentMethod: 'Cash',
    invoiceNumber: '1803870',
    issueDate: '07-06-2026',
    dueDate: '08-06-2026',
    amount: 'AED 1,312.50',
    note: '-'
  }
];

export const OVERVIEW_COLUMNS: InvoiceCol[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'inclusiveTax', label: 'Inclusive Tax?', visible: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'price', label: 'Price', visible: true },
  { key: 'tax', label: 'Tax', visible: true },
  { key: 'discount', label: 'Discount', visible: true },
  { key: 'discountPct', label: 'Discount %', visible: true },
  { key: 'total', label: 'Total', visible: true }
];

export const CHEQUE_COLUMNS: InvoiceCol[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'chequeNo', label: 'Cheque No', visible: true },
  { key: 'bankName', label: 'Bank Name', visible: true },
  { key: 'chequeDate', label: 'Cheque Date', visible: true },
  { key: 'amount', label: 'Amount', visible: true },
  { key: 'inHand', label: 'Cheque In Hand', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'attachment', label: 'Attachment', visible: true }
];

export const TXN_COLUMNS: InvoiceCol[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'qbStatus', label: 'Quickbooks Status', visible: true },
  { key: 'lineItemId', label: 'Line Item ID', visible: true },
  { key: 'account', label: 'Account', visible: true },
  { key: 'receivingAccount', label: 'Receiving Account', visible: true },
  { key: 'paymentMethod', label: 'Payment Method', visible: true },
  { key: 'details', label: 'Details', visible: true },
  { key: 'paidDate', label: 'Paid Date', visible: true },
  { key: 'amount', label: 'Amount', visible: true }
];

export const PENALTY_COLUMNS: InvoiceCol[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'paymentMethod', label: 'Payment Method', visible: true },
  { key: 'invoiceNumber', label: 'Invoice Number', visible: true },
  { key: 'issueDate', label: 'Issue Date', visible: true },
  { key: 'dueDate', label: 'Due Date', visible: true },
  { key: 'amount', label: 'Amount', visible: true },
  { key: 'note', label: 'Note', visible: true },
  { key: 'action', label: 'Action', visible: true }
];
