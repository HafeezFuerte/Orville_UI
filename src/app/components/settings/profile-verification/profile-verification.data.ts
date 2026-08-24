export type ProfileVerificationTab = 'landlord' | 'tenant';

export interface ProfileFieldOption {
  id: string;
  label: string;
}

export const LANDLORD_FIELD_OPTIONS: ProfileFieldOption[] = [
  { id: 'full_name', label: 'FULL NAME' },
  { id: 'phone_country', label: 'PHONE NO WITH COUNTRY CODE' },
  { id: 'email', label: 'EMAIL' },
  { id: 'address_1', label: 'ADDRESS 1' },
  { id: 'date_of_birth', label: 'DATE OF BIRTH' },
  { id: 'nationality', label: 'NATIONALITY' },
  { id: 'bank_name', label: 'BANK NAME' },
  { id: 'bank_address', label: 'BANK ADDRESS' },
  { id: 'account_number', label: 'ACCOUNT NUMBER' },
  { id: 'iban', label: 'IBAN' },
  { id: 'code_swift', label: 'CODE SWIFT' },
];

export const TENANT_FIELD_OPTIONS: ProfileFieldOption[] = [
  { id: 'full_name', label: 'FULL NAME' },
  { id: 'phone_country', label: 'PHONE NO WITH COUNTRY CODE' },
  { id: 'email', label: 'EMAIL' },
  { id: 'address_1', label: 'ADDRESS 1' },
  { id: 'date_of_birth', label: 'DATE OF BIRTH' },
  { id: 'nationality', label: 'NATIONALITY' },
];

export const DEFAULT_LANDLORD_FIELD_IDS: string[] = LANDLORD_FIELD_OPTIONS.map((f) => f.id);

export const DEFAULT_TENANT_FIELD_IDS: string[] = TENANT_FIELD_OPTIONS.map((f) => f.id);
