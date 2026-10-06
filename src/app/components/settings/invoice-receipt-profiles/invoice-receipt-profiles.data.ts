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

export const IRP_CITIES_BY_STATE: Record<string, string[]> = {
  Dubai: ['Dubai City', 'Deira', 'Bur Dubai', 'Business Bay', 'Downtown Dubai', 'Dubai Marina', 'Jumeirah', 'Al Barsha', 'Jebel Ali'],
  'Abu Dhabi': ['Abu Dhabi City', 'Al Ain', 'Al Dhafra', 'Yas Island', 'Saadiyat Island', 'Mussafah'],
  Sharjah: ['Sharjah City', 'Khor Fakkan', 'Kalba', 'Al Dhaid', 'Al Majaz'],
  Ajman: ['Ajman City', 'Masfout', 'Manama'],
  'Ras Al Khaimah': ['Ras Al Khaimah City', 'Al Jazirah Al Hamra', 'Dhadna'],
  Fujairah: ['Fujairah City', 'Dibba Al-Fujairah'],
  'Umm Al Quwain': ['Umm Al Quwain City', 'Falaj Al Mualla'],

  Riyadh: ['Riyadh City', 'Al Kharj', 'Diriyah', 'Al Majmaah'],
  Makkah: ['Jeddah', 'Makkah City', 'Taif', 'Rabigh'],
  'Eastern Province': ['Dammam', 'Khobar', 'Jubail', 'Dhahran', 'Ahsa'],

  Doha: ['Doha', 'West Bay', 'Lusail', 'Pearl Qatar'],
  Muscat: ['Muscat', 'Seeb', 'Muttrah', 'Bausher', 'Ruwi'],
  Capital: ['Manama', 'Juffair', 'Seef'],
  'Al Asimah': ['Kuwait City', 'Sharq', 'Dasman'],

  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
  Delhi: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],

  England: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol'],
  Scotland: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
  Wales: ['Cardiff', 'Swansea', 'Newport'],
  'Northern Ireland': ['Belfast', 'Derry', 'Lisburn'],

  California: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
  'New York': ['New York City', 'Buffalo', 'Albany', 'Rochester'],
  Texas: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  Florida: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
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
