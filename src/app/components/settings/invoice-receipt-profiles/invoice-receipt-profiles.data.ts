export interface InvoiceReceiptProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  vat: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  postcode: string;
  footer: string;
  logoName: string;
  logoUrl: string;
}

export const IRP_COUNTRIES: string[] = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Oman',
  'Bahrain',
  'Kuwait',
  'India',
  'United Kingdom',
  'United States',
];

export const IRP_STATES_BY_COUNTRY: Record<string, string[]> = {
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
  'Saudi Arabia': ['Riyadh', 'Makkah', 'Eastern Province'],
  Qatar: ['Doha'],
  Oman: ['Muscat'],
  Bahrain: ['Capital'],
  Kuwait: ['Al Asimah'],
  India: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'United States': ['California', 'New York', 'Texas', 'Florida'],
};

export const EMPTY_INVOICE_RECEIPT_PROFILE: Omit<InvoiceReceiptProfile, 'id'> = {
  name: '',
  email: '',
  phone: '',
  vat: '',
  address1: '',
  address2: '',
  country: '',
  state: '',
  city: '',
  postcode: '',
  footer: '',
  logoName: '',
  logoUrl: '',
};

export const DEFAULT_INVOICE_RECEIPT_PROFILES: InvoiceReceiptProfile[] = [
  {
    id: 1,
    name: 'Prashanth kola',
    email: 'prashanth@orville.ae',
    phone: '+971 50 000 0000',
    vat: '',
    address1: 'dubai',
    address2: '',
    country: 'United Arab Emirates',
    state: 'Dubai',
    city: 'dubai',
    postcode: '',
    footer: '',
    logoName: '',
    logoUrl: '',
  },
];
