export interface PaymentSettingsModel {
  delayedRentDays: number[];
  upcomingPaymentDays: number[];
  bouncedChequeDays: number[];
  onlinePaymentsAccountId: string;
  receiveExtraAmount: boolean;
  enableMultipleLineItems: boolean;
  useLeaseReceiptNumber: boolean;
  applyLatePaymentFee: boolean;
}

export interface PaymentAccountOption {
  id: string;
  name: string;
}

export interface PaymentToggleDef {
  key: keyof Pick<
    PaymentSettingsModel,
    | 'receiveExtraAmount'
    | 'enableMultipleLineItems'
    | 'useLeaseReceiptNumber'
    | 'applyLatePaymentFee'
  >;
  label: string;
  description: string;
}

export const PAYMENT_ACCOUNT_OPTIONS: PaymentAccountOption[] = [
  { id: 'cash-checking', name: 'Cash - Checking' },
  { id: 'bank-main', name: 'Main Operating Account' },
  { id: 'bank-collections', name: 'Collections Account' },
];

export const PAYMENT_TOGGLES: PaymentToggleDef[] = [
  {
    key: 'receiveExtraAmount',
    label: 'Receive extra amount',
    description: 'Allow collecting more than the invoice balance when recording a payment.',
  },
  {
    key: 'enableMultipleLineItems',
    label: 'Enable multiple line items',
    description: 'Allow adding multiple line items when creating an invoice.',
  },
  {
    key: 'useLeaseReceiptNumber',
    label: 'Use lease receipt number on printouts',
    description:
      'Printed receipts and invoices show the lease default receipt number instead of the invoice number.',
  },
  {
    key: 'applyLatePaymentFee',
    label: 'Apply late payment fee',
    description: 'Automatically apply a late payment fee on overdue invoices.',
  },
];

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettingsModel = {
  delayedRentDays: [7, 15, 30],
  upcomingPaymentDays: [7, 15, 30],
  bouncedChequeDays: [1, 3, 7],
  onlinePaymentsAccountId: '',
  receiveExtraAmount: false,
  enableMultipleLineItems: true,
  useLeaseReceiptNumber: false,
  applyLatePaymentFee: false,
};
