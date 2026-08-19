export type SpaceAvailability = 'Weekdays' | 'Weekends' | 'Always' | 'Closed' | 'Custom Days';
export type PaymentFlag = 'Enabled' | 'Disabled';

export interface SpaceScheduleRow {
  day: string;
  hours: string;
  closed?: boolean;
}

export interface SpaceAttachment {
  id: string;
  fileType: string;
  docId: string;
  status: 'Active' | 'Verified';
  issueDate: string;
  expiryDate: string;
  files: string;
  uploadedBy: string;
  shareLandlord: 'Yes' | 'No';
  shareTenant: 'Yes' | 'No';
  createdAt: string;
  updatedAt: string;
}

export interface SpaceRow {
  id: string;
  name: string;
  location: string;
  availability: SpaceAvailability;
  slotDuration: string;
  dateRange: string;
  rangeStatus: 'Active' | 'Inactive';
  enablePayment: PaymentFlag;
  phone: string;
  email: string;
  property: string;
  unit: string;
  createdAt: string;
  description: string;
  bookingClosesIn: string;
  slotPrice: string;
  rules: string;
  updatedAt: string;
  schedule: SpaceScheduleRow[];
}

export const SPACE_ROWS: SpaceRow[] = [
  {
    id: '31658',
    name: 'Skyline Meeting Room',
    location: 'Level 18, Marina Heights, Dubai',
    availability: 'Weekdays',
    slotDuration: '2 hours',
    dateRange: '14-07-2026 - 22-07-2026',
    rangeStatus: 'Active',
    enablePayment: 'Disabled',
    phone: '+971504892110',
    email: 'skyline@orville.ae',
    property: 'Marina Heights Tower',
    unit: 'Apartment-18-MR-1',
    createdAt: '14-07-2026',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bookingClosesIn: '8 days',
    slotPrice: 'AED 1500',
    rules: 'None',
    updatedAt: '14-07-2026',
    schedule: [
      { day: 'Monday', hours: '09:00 - 17:00' },
      { day: 'Tuesday', hours: '09:00 - 17:00' },
      { day: 'Wednesday', hours: '09:00 - 17:00' },
      { day: 'Thursday', hours: '09:00 - 17:00' },
      { day: 'Friday', hours: 'Closed', closed: true },
      { day: 'Saturday', hours: '09:00 - 17:00' },
      { day: 'Sunday', hours: '09:00 - 17:00' }
    ]
  },
  {
    id: '31659',
    name: 'Community Pool Deck',
    location: 'Podium, Marina Heights, Dubai',
    availability: 'Always',
    slotDuration: '1 hour',
    dateRange: '01-08-2026 - 31-08-2026',
    rangeStatus: 'Active',
    enablePayment: 'Enabled',
    phone: '+971504892111',
    email: 'pool@orville.ae',
    property: 'Marina Heights Tower',
    unit: 'Common-Pool-01',
    createdAt: '14-07-2026',
    description: 'Outdoor pool deck with shaded seating.',
    bookingClosesIn: '12 days',
    slotPrice: 'AED 250',
    rules: 'None',
    updatedAt: '14-07-2026',
    schedule: [
      { day: 'Monday', hours: '08:00 - 20:00' },
      { day: 'Tuesday', hours: '08:00 - 20:00' },
      { day: 'Wednesday', hours: '08:00 - 20:00' },
      { day: 'Thursday', hours: '08:00 - 20:00' },
      { day: 'Friday', hours: '08:00 - 20:00' },
      { day: 'Saturday', hours: '08:00 - 20:00' },
      { day: 'Sunday', hours: '08:00 - 20:00' }
    ]
  },
  {
    id: '31660',
    name: 'Gym Studio',
    location: 'Level 2, Marina Heights, Dubai',
    availability: 'Weekdays',
    slotDuration: '45 mins',
    dateRange: '14-07-2026 - 22-07-2026',
    rangeStatus: 'Inactive',
    enablePayment: 'Disabled',
    phone: '+971504892112',
    email: 'gym@orville.ae',
    property: 'Marina Heights Tower',
    unit: 'Gym-02',
    createdAt: '10-07-2026',
    description: 'Fitness studio for small group sessions.',
    bookingClosesIn: '3 days',
    slotPrice: 'AED 400',
    rules: 'None',
    updatedAt: '10-07-2026',
    schedule: [
      { day: 'Monday', hours: '06:00 - 22:00' },
      { day: 'Tuesday', hours: '06:00 - 22:00' },
      { day: 'Wednesday', hours: '06:00 - 22:00' },
      { day: 'Thursday', hours: '06:00 - 22:00' },
      { day: 'Friday', hours: 'Closed', closed: true },
      { day: 'Saturday', hours: '08:00 - 18:00' },
      { day: 'Sunday', hours: '08:00 - 18:00' }
    ]
  },
  {
    id: '31661',
    name: 'Cinema Lounge',
    location: 'Level 1, Marina Heights, Dubai',
    availability: 'Closed',
    slotDuration: '2 hours',
    dateRange: '14-07-2026 - 22-07-2026',
    rangeStatus: 'Inactive',
    enablePayment: 'Disabled',
    phone: '+971504892110',
    email: 'skyline@orville.ae',
    property: 'Marina Heights Tower',
    unit: 'Apartment-18-MR-1',
    createdAt: '14-07-2026',
    description: 'Private cinema lounge for residents.',
    bookingClosesIn: '8 days',
    slotPrice: 'AED 800',
    rules: 'None',
    updatedAt: '14-07-2026',
    schedule: [
      { day: 'Monday', hours: 'Closed', closed: true },
      { day: 'Tuesday', hours: 'Closed', closed: true },
      { day: 'Wednesday', hours: 'Closed', closed: true },
      { day: 'Thursday', hours: 'Closed', closed: true },
      { day: 'Friday', hours: 'Closed', closed: true },
      { day: 'Saturday', hours: 'Closed', closed: true },
      { day: 'Sunday', hours: 'Closed', closed: true }
    ]
  },
  {
    id: '31662',
    name: 'Guest Suite',
    location: 'Level 20, Marina Heights, Dubai',
    availability: 'Custom Days',
    slotDuration: '2 hours',
    dateRange: '14-07-2026 - 22-07-2026',
    rangeStatus: 'Active',
    enablePayment: 'Enabled',
    phone: '+971504892110',
    email: 'skyline@orville.ae',
    property: 'Marina Heights Tower',
    unit: 'Apartment-18-MR-1',
    createdAt: '14-07-2026',
    description: 'Overnight guest suite for visitors.',
    bookingClosesIn: '8 days',
    slotPrice: 'AED 1200',
    rules: 'None',
    updatedAt: '14-07-2026',
    schedule: [
      { day: 'Monday', hours: 'Closed', closed: true },
      { day: 'Tuesday', hours: '09:00 - 17:00' },
      { day: 'Wednesday', hours: '09:00 - 17:00' },
      { day: 'Thursday', hours: '09:00 - 17:00' },
      { day: 'Friday', hours: 'Closed', closed: true },
      { day: 'Saturday', hours: '10:00 - 16:00' },
      { day: 'Sunday', hours: '10:00 - 16:00' }
    ]
  }
];

export const SPACE_ATTACHMENTS: SpaceAttachment[] = [
  {
    id: 'ATT-1001',
    fileType: 'Passport Copy',
    docId: 'DOC-1001',
    status: 'Active',
    issueDate: '12-01-2026',
    expiryDate: '12-01-2026',
    files: '1 file',
    uploadedBy: 'Tenant',
    shareLandlord: 'Yes',
    shareTenant: 'Yes',
    createdAt: '10-01-2026, 09:14',
    updatedAt: '12-01-2026, 13:06'
  },
  {
    id: 'ATT-1001',
    fileType: 'Visa Copy',
    docId: 'DOC-1001',
    status: 'Verified',
    issueDate: '12-01-2026',
    expiryDate: '12-01-2026',
    files: '1 file',
    uploadedBy: 'Tenant',
    shareLandlord: 'Yes',
    shareTenant: 'Yes',
    createdAt: '10-01-2026, 09:14',
    updatedAt: '12-01-2026, 13:06'
  }
];

export function getSpaceDetail(id: string | null): SpaceRow {
  return SPACE_ROWS.find((row) => row.id === id) || SPACE_ROWS[0];
}
