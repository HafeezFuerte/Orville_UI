export type ProfileTab = 'general' | 'security' | 'mails' | 'properties';

export interface ProfileAssignedProperty {
  id: string;
  property: string;
  unit: string;
  landlords: string;
  tags: string;
  beds: string;
}

export const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'security', label: 'Security' },
  { id: 'mails', label: 'Mails' },
  { id: 'properties', label: 'Assigned Properties' },
];

/** Mock profile — presentation only. */
export const PROFILE_USER = {
  userId: '88901',
  firstName: 'Hafeez',
  lastName: 'Hafeez',
  fullName: 'Hafeez Hafeez',
  email: 'prashanth@goodhand.ae',
  username: 'hafeez',
  role: 'Manager',
  department: '—',
  phone: '',
  gender: '—',
  nationality: '—',
  languages: '—',
  country: 'United Arab Emirates (+971)',
  systemLanguage: 'English',
  timezone: '(GMT+04:00) Abu Dhabi',
  enableNotificationSound: true,
  emailSignature: '',
  emailSubsUsed: 46,
  emailSubsTotal: 47,
  twoStepAuth: false,
  passwordChangedAt: '30-May-2026 05:31 PM',
  createdAt: '12-Jan-2025 09:14 AM',
  lastUpdatedAt: '20-Aug-2026 02:40 PM',
  lastSignInAt: '26-Aug-2026 08:05 AM',
};

/** 10 rows for Assigned Properties table. */
export const PROFILE_ASSIGNED_PROPERTIES: ProfileAssignedProperty[] = [
  {
    id: '1',
    property: 'Nada Rigga Building',
    unit: '301-PR-6',
    landlords: 'Orville Real Estate',
    tags: '—',
    beds: '—',
  },
  {
    id: '2',
    property: 'Marina Towers',
    unit: '1204',
    landlords: 'Orville Real Estate',
    tags: '—',
    beds: '2',
  },
  {
    id: '3',
    property: 'Business Bay Heights',
    unit: '511-PR-4',
    landlords: 'Maktoum Holdings',
    tags: 'VIP',
    beds: '1',
  },
  {
    id: '4',
    property: 'Al Quoz Residences',
    unit: '08',
    landlords: 'Orville Real Estate',
    tags: '—',
    beds: 'Studio',
  },
  {
    id: '5',
    property: 'JLT Cluster X',
    unit: '2201',
    landlords: 'Ibrahim Estates',
    tags: '—',
    beds: '3',
  },
  {
    id: '6',
    property: 'Silicon Oasis Block B',
    unit: '14',
    landlords: 'Orville Real Estate',
    tags: '—',
    beds: '—',
  },
  {
    id: '7',
    property: 'Downtown Views',
    unit: '3308',
    landlords: 'Suwaidi Properties',
    tags: '—',
    beds: '2',
  },
  {
    id: '8',
    property: 'Palm Residences',
    unit: 'Villa 12',
    landlords: 'Orville Real Estate',
    tags: 'Villa',
    beds: '4',
  },
  {
    id: '9',
    property: 'City Walk Lofts',
    unit: '602',
    landlords: 'Hassan Group',
    tags: '—',
    beds: '1',
  },
  {
    id: '10',
    property: 'Dubai Hills Estate',
    unit: '45',
    landlords: 'Orville Real Estate',
    tags: '—',
    beds: '3',
  },
];

export const PROFILE_ASSIGNED_UNITS_LABEL = '3100';
