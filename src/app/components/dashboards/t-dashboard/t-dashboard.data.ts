export interface TenantProfile {
  name: string;
  unit: string;
  building: string;
  area: string;
  role: string;
  avatarInitials: string;
}

export interface NextPayment {
  amount: string;
  currency: string;
  dueDaysLabel: string;
  dueDate: string;
  instalment: string;
  method: string;
}

export interface TenantLease {
  leaseCode: string;
  status: 'Active' | 'Pending' | 'Expired';
  type: string;
  bedrooms: string;
  size: string;
  termStart: string;
  termEnd: string;
  annualRent: string;
  securityDeposit: string;
  currentDay: number;
  totalDays: number;
}

export interface TenantKpi {
  id: string;
  title: string;
  value: string;
  subtext: string;
  iconType: 'paid' | 'outstanding' | 'requests' | 'bookings';
}

export interface MaintenanceRequestItem {
  id: string;
  request: string;
  category: string;
  technician: string;
  status: 'In progress' | 'New' | 'Resolved';
}

export interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  badge: 'Building' | 'Amenities' | 'Safety';
  iconType: 'maintenance' | 'timing' | 'safety';
}

export interface PaymentScheduleItem {
  instalment: string;
  dueDate: string;
  amount: string;
  method: string;
  status: 'Cleared' | 'Upcoming' | 'Scheduled';
}

export const MOCK_TENANT_PROFILE: TenantProfile = {
  name: 'Zaid',
  unit: 'Apartment 1204',
  building: 'Marina Heights, Tower B',
  area: 'Dubai Marina',
  role: 'Tenant',
  avatarInitials: 'ZR',
};

export const MOCK_AVAILABLE_UNITS: string[] = [
  'Unit 1204 · Marina Heights',
  'Unit 802 · Marina Heights',
  'Unit 305 · Downtown Views',
];

export const MOCK_NEXT_PAYMENT: NextPayment = {
  amount: '8,750.00',
  currency: 'AED',
  dueDaysLabel: 'Due in 3 days',
  dueDate: '15 Apr 2026',
  instalment: 'Q2 · 2 of 4',
  method: 'Cheque #000214',
};

export const MOCK_TENANT_LEASE: TenantLease = {
  leaseCode: 'LS-2026-0412',
  status: 'Active',
  type: 'Residential',
  bedrooms: '2 Bedroom',
  size: '1,200 sqft',
  termStart: '01 Jan 2026',
  termEnd: '31 Dec 2026',
  annualRent: 'AED 35,000',
  securityDeposit: 'AED 4,000',
  currentDay: 101,
  totalDays: 365,
};

export const MOCK_TENANT_KPIS: TenantKpi[] = [
  {
    id: 'paid-year',
    title: 'Paid this year',
    value: 'AED 8,250',
    subtext: '1 of 4 instalments cleared',
    iconType: 'paid',
  },
  {
    id: 'outstanding',
    title: 'Outstanding',
    value: 'AED 8,750',
    subtext: 'Due 15 Apr 2026',
    iconType: 'outstanding',
  },
  {
    id: 'open-requests',
    title: 'Open requests',
    value: '2',
    subtext: '1 technician on the way',
    iconType: 'requests',
  },
  {
    id: 'saved-bookings',
    title: 'Saved bookings',
    value: '1',
    subtext: 'BK-2026-0011 · awaiting signature',
    iconType: 'bookings',
  },
];

export const MOCK_MAINTENANCE_REQUESTS: MaintenanceRequestItem[] = [
  {
    id: 'REQ-01',
    request: 'AC not cooling in master bedroom',
    category: 'HVAC',
    technician: 'Ravi Kumar',
    status: 'In progress',
  },
  {
    id: 'REQ-02',
    request: 'Kitchen sink leakage',
    category: 'Plumbing',
    technician: 'Assigning...',
    status: 'New',
  },
  {
    id: 'REQ-03',
    request: 'Replace corridor light bulb',
    category: 'Electrical',
    technician: 'Ahmed S.',
    status: 'Resolved',
  },
];

export const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ANN-01',
    title: 'Pool maintenance on 16 Apr',
    description: 'Swimming pool closed 9 am - 2 pm for cleaning.',
    badge: 'Building',
    iconType: 'maintenance',
  },
  {
    id: 'ANN-02',
    title: 'Ramadan timings for gym',
    description: 'Gym open 6 am - 2 am during Ramadan.',
    badge: 'Amenities',
    iconType: 'timing',
  },
  {
    id: 'ANN-03',
    title: 'Fire drill — Tower B',
    description: 'Thursday 10:30 am. Please follow marshal instructions.',
    badge: 'Safety',
    iconType: 'safety',
  },
];

export const MOCK_PAYMENT_SCHEDULE: PaymentScheduleItem[] = [
  {
    instalment: 'Q1 · Jan - Mar',
    dueDate: '01 Jan 2026',
    amount: 'AED 8,250.00',
    method: 'Cheque #000213 · ENBD',
    status: 'Cleared',
  },
  {
    instalment: 'Q2 · Apr - Jun',
    dueDate: '15 Apr 2026',
    amount: 'AED 8,750.00',
    method: 'Cheque #000214 · ENBD',
    status: 'Upcoming',
  },
  {
    instalment: 'Q3 · Jul - Sep',
    dueDate: '01 Jul 2026',
    amount: 'AED 8,250.00',
    method: 'Cheque #000215 · ENBD',
    status: 'Scheduled',
  },
  {
    instalment: 'Q4 · Oct - Dec',
    dueDate: '01 Oct 2026',
    amount: 'AED 8,250.00',
    method: 'Cheque #000216 · ENBD',
    status: 'Scheduled',
  },
];
