export type BankAccountType = 'Current Account' | 'Savings Account' | 'Call Account';

export interface BankAccount {
  id: number;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  currency: string;
  accountType: BankAccountType;
  isPrimary: boolean;
}

export const BANK_CURRENCY_OPTIONS: string[] = [
  'AED (United Arab Emirates Dirham)',
  'USD (US Dollar)',
  'EUR (Euro)',
  'GBP (British Pound)',
  'SAR (Saudi Riyal)',
];

export const BANK_ACCOUNT_TYPE_OPTIONS: BankAccountType[] = [
  'Current Account',
  'Savings Account',
  'Call Account',
];

export const EMPTY_BANK_ACCOUNT: Omit<BankAccount, 'id'> = {
  bankName: '',
  accountTitle: '',
  accountNumber: '',
  iban: '',
  swiftCode: '',
  currency: 'AED (United Arab Emirates Dirham)',
  accountType: 'Current Account',
  isPrimary: false,
};

/** Local mock — empty by default to match empty-state design. */
export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [];

export interface BankColumnDef {
  key: string;
  label: string;
  visible: boolean;
}
