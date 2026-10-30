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
  useTemplate ?:boolean;
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
  { key: 'id', label: 'web.common.lblID', visible: true },
  { key: 'inclusiveTax', label: 'web.accounting.invoices.inclusiveTax', visible: true },
  { key: 'description', label: 'web.accounting.invoices.description', visible: true },
  { key: 'price', label: 'web.accounting.invoices.price', visible: true },
  { key: 'tax', label: 'web.accounting.invoices.tax', visible: true },
  { key: 'discount', label: 'web.accounting.invoices.discount', visible: true },
  { key: 'discountPct', label: 'web.accounting.invoices.discountPct', visible: true },
  { key: 'total', label: 'web.accounting.invoices.total', visible: true }
];

export const CHEQUE_COLUMNS: InvoiceCol[] = [
  { key: 'id', label: 'web.common.lblID', visible: true, useTemplate: true },
  { key: 'rcp_no', label: 'web.leases.lblReceiptNo', visible: true, useTemplate: true },
  { key: 'cheque_no', label: 'web.leases.lblChequeNo', visible: true }, 
  { key: 'bank_name', label: 'web.leases.lblBankName', visible: true },
  { key: 'cheque_date', label: 'web.leases.lblChequeDate', visible: true },
  { key: 'heldBy', label: 'web.leases.lblHeldBy', visible: true },
  { key: 'amt', label: 'web.common.lblAmount', visible: true, useTemplate: true },
  { key: 'cheque_status', label: 'web.common.lblStatus', visible: true, useTemplate: true },
  { key: 'created_date', label: 'web.contacts.lblCreatedAt', visible: true },
  { key: 'cheque_in_hand', label: 'web.accounting.invoices.chequeInHand', visible: true },
  { key: 'is_returned', label: 'web.leases.lblReturned', visible: true },
  { key: 'returnedDate', label: 'web.leases.lblReturnedDate', visible: true },
  { key: 'bounce_date', label: 'web.leases.lblBounceDate', visible: true },
  { key: 'bounce_reason', label: 'web.leases.lblBounceReason', visible: true },
  { key: 'withdrawalReason', label: 'web.leases.lblWithdrawalReason', visible: true },
  { key: 'Tenant', label: 'web.contacts.lblContactName', visible: true, useTemplate: true },
  { key: 'landlord', label: 'web.leases.lblLandlord', visible: true, useTemplate: true },
  { key: 'unit_code', label: 'web.leases.lblUnit', visible: true , useTemplate: true},
  { key: 'attachment_path', label: 'web.accounting.invoices.attachment', visible: true  , useTemplate: true}
];

export const TXN_COLUMNS: InvoiceCol[] = [
  { key: 'id', label: 'web.common.lblID', visible: true },
  { key: 'qbStatus', label: 'web.accounting.invoices.quickbooksStatus', visible: true },
  { key: 'lineItemId', label: 'web.accounting.invoices.lineItems', visible: true },
  { key: 'account', label: 'web.accounting.invoices.colAccount', visible: true },
  { key: 'receivingAccount', label: 'web.accounting.invoices.leaseAccount', visible: true },
  { key: 'paymentMethod', label: 'web.accounting.invoices.paymentMode', visible: true },
  { key: 'details', label: 'web.common.lblDetails', visible: true },
  { key: 'paidDate', label: 'web.accounting.invoices.paidDate', visible: true },
  { key: 'amount', label: 'web.common.lblAmount', visible: true }
];

export const PENALTY_COLUMNS: InvoiceCol[] = [
  { key: 'id', label: 'web.common.lblID', visible: true },
  { key: 'paymentMethod', label: 'web.accounting.invoices.paymentMode', visible: true },
  { key: 'invoiceNumber', label: 'web.accounting.invoices.colInvoiceNumber', visible: true },
  { key: 'issueDate', label: 'web.accounting.invoices.dateOfIssue', visible: true },
  { key: 'dueDate', label: 'web.accounting.invoices.dueDate', visible: true },
  { key: 'amount', label: 'web.common.lblAmount', visible: true },
  { key: 'note', label: 'web.accounting.invoices.notes', visible: true },
  { key: 'action', label: 'web.accounting.invoices.colAction', visible: true }
];
