import { SettingsUserRow, MOCK_SETTINGS_USERS } from './users-and-admins.data';

export type UserDetailTab = 'units' | 'properties' | 'reports' | 'logins';

export interface UserDetailProfile {
  userId: string;
  department: string;
  gender: string;
  nationality: string;
  languages: string;
  createdAt: string;
  lastUpdatedAt: string;
  lastSignInAt: string;
}

export interface UserAssignedUnit {
  id: string;
  unit: string;
  property: string;
  landlords: string;
}

export interface UserAssignedProperty {
  id: string;
  property: string;
  units: number;
}

export interface UserAssignedReport {
  id: string;
  name: string;
  type: string;
  typeTone: 'muted' | 'warning' | 'info' | 'success';
}

export interface UserLoginRow {
  id: string;
  loginTime: string;
  ipAddress: string;
  deviceType: 'Web' | 'Mobile' | 'Tablet';
}

export const USER_DETAIL_TABS: { id: UserDetailTab; label: string }[] = [
  { id: 'units', label: 'Assigned Units' },
  { id: 'properties', label: 'Assigned Properties' },
  { id: 'reports', label: 'Assigned Reports' },
  { id: 'logins', label: 'Login History' },
];

export const USER_DETAIL_PROFILES: Record<number, UserDetailProfile> = {
  1: {
    userId: '88901',
    department: 'Collections',
    gender: 'Male',
    nationality: 'UAE',
    languages: 'English, Arabic',
    createdAt: '12-Jan-2025 10:20 AM',
    lastUpdatedAt: '20-Aug-2026 02:14 PM',
    lastSignInAt: '26-Aug-2026 09:05 AM',
  },
  2: {
    userId: '88912',
    department: 'Inspections',
    gender: 'Female',
    nationality: 'UAE',
    languages: 'English, Arabic',
    createdAt: '03-Mar-2025 11:00 AM',
    lastUpdatedAt: '18-Aug-2026 04:22 PM',
    lastSignInAt: '25-Aug-2026 08:40 AM',
  },
  3: {
    userId: '89001',
    department: 'Operations',
    gender: 'Male',
    nationality: 'USA',
    languages: 'English',
    createdAt: '22-Jun-2024 09:30 AM',
    lastUpdatedAt: '15-Aug-2026 01:10 PM',
    lastSignInAt: '24-Aug-2026 07:55 AM',
  },
  4: {
    userId: '89044',
    department: 'Finance',
    gender: 'Female',
    nationality: 'Pakistan',
    languages: 'English, Urdu',
    createdAt: '10-Sep-2025 03:15 PM',
    lastUpdatedAt: '01-Feb-2026 12:00 PM',
    lastSignInAt: '01-Feb-2026 11:45 AM',
  },
  5: {
    userId: '10001',
    department: 'Management',
    gender: 'Male',
    nationality: 'India',
    languages: 'English, Hindi',
    createdAt: '01-Jan-2024 08:00 AM',
    lastUpdatedAt: '24-Aug-2026 06:00 PM',
    lastSignInAt: '26-Aug-2026 08:10 AM',
  },
  6: {
    userId: '10002',
    department: 'Admin',
    gender: 'Female',
    nationality: 'UAE',
    languages: 'English, Arabic',
    createdAt: '14-Feb-2024 10:00 AM',
    lastUpdatedAt: '20-Aug-2026 05:30 PM',
    lastSignInAt: '25-Aug-2026 09:20 AM',
  },
  7: {
    userId: '11001',
    department: 'Support',
    gender: 'Male',
    nationality: 'Egypt',
    languages: 'English, Arabic',
    createdAt: '05-May-2025 02:45 PM',
    lastUpdatedAt: '12-Aug-2026 03:00 PM',
    lastSignInAt: '22-Aug-2026 04:18 PM',
  },
};

/** Screenshot reference user (Fahad Faju) — used when id matches or as fallback enrich. */
export const FAHAD_DETAIL: SettingsUserRow = {
  id: 96312,
  kind: 'user',
  name: 'Fahad Faju',
  email: 'fajufahad1989@gmail.com',
  username: 'fahad89',
  phone: '+9710569327236',
  role: 'Collector',
  referenceNo: '',
  lastLogin: '26-Aug-2026',
  units: 387,
  status: 'active',
  initials: 'FF',
  avatarColor: '#6B6B7D',
};

export const FAHAD_PROFILE: UserDetailProfile = {
  userId: '96312',
  department: '—',
  gender: '—',
  nationality: '—',
  languages: '—',
  createdAt: '15-Mar-2024 11:22 AM',
  lastUpdatedAt: '22-Aug-2026 04:51 PM',
  lastSignInAt: '26-Aug-2026 08:33 AM',
};

export const USER_ASSIGNED_UNITS: UserAssignedUnit[] = [
  { id: '1', unit: '401-PR-1', property: 'Rashid Commercial', landlords: 'Orville Real Estate' },
  { id: '2', unit: '402-PR-1', property: 'Rashid Commercial', landlords: 'Orville Real Estate' },
  { id: '3', unit: '501-PR-2', property: 'Marina Heights Tower', landlords: 'Blue Ocean Holdings' },
  { id: '4', unit: '502-PR-2', property: 'Marina Heights Tower', landlords: 'Blue Ocean Holdings' },
  { id: '5', unit: '12-A', property: 'Orville Plaza', landlords: 'Orville Real Estate' },
  { id: '6', unit: '14-B', property: 'Orville Plaza', landlords: 'Orville Real Estate' },
  { id: '7', unit: '2201', property: 'Business Bay Gate', landlords: 'Bay Gate LLC' },
  { id: '8', unit: '2202', property: 'Business Bay Gate', landlords: 'Bay Gate LLC' },
  { id: '9', unit: 'G-01', property: 'JLT Cluster W', landlords: 'Cluster Partners' },
  { id: '10', unit: 'G-02', property: 'JLT Cluster W', landlords: 'Cluster Partners' },
];

export const USER_ASSIGNED_PROPERTIES: UserAssignedProperty[] = [];

export const USER_ASSIGNED_REPORTS: UserAssignedReport[] = [
  { id: '1', name: 'Property Overview', type: 'Financial Reports', typeTone: 'muted' },
  { id: '2', name: 'Rent Statement', type: 'Rental Reports', typeTone: 'warning' },
  { id: '3', name: 'Outstanding Balances', type: 'Financial Reports', typeTone: 'muted' },
  { id: '4', name: 'Lease Expiry Summary', type: 'Rental Reports', typeTone: 'warning' },
  { id: '5', name: 'Collections Aging', type: 'Financial Reports', typeTone: 'muted' },
  { id: '6', name: 'Vacancy Report', type: 'Rental Reports', typeTone: 'warning' },
  { id: '7', name: 'Payment Receipts', type: 'Financial Reports', typeTone: 'muted' },
  { id: '8', name: 'Tenant Ledger', type: 'Rental Reports', typeTone: 'warning' },
  { id: '9', name: 'Work Order Costs', type: 'Financial Reports', typeTone: 'muted' },
  { id: '10', name: 'Unit Occupancy', type: 'Rental Reports', typeTone: 'warning' },
];

export const USER_LOGIN_HISTORY: UserLoginRow[] = [
  { id: '1', loginTime: '26-Aug-2026 08:33 AM', ipAddress: '185.112.44.19', deviceType: 'Web' },
  { id: '2', loginTime: '25-Aug-2026 07:12 AM', ipAddress: '185.112.44.19', deviceType: 'Web' },
  { id: '3', loginTime: '24-Aug-2026 09:05 AM', ipAddress: '91.230.12.88', deviceType: 'Web' },
  { id: '4', loginTime: '23-Aug-2026 06:48 PM', ipAddress: '185.112.44.19', deviceType: 'Mobile' },
  { id: '5', loginTime: '22-Aug-2026 10:21 AM', ipAddress: '185.112.44.19', deviceType: 'Web' },
  { id: '6', loginTime: '21-Aug-2026 08:02 AM', ipAddress: '102.45.9.210', deviceType: 'Web' },
  { id: '7', loginTime: '20-Aug-2026 11:40 AM', ipAddress: '185.112.44.19', deviceType: 'Web' },
  { id: '8', loginTime: '19-Aug-2026 03:15 PM', ipAddress: '185.112.44.19', deviceType: 'Web' },
  { id: '9', loginTime: '18-Aug-2026 09:55 AM', ipAddress: '91.230.12.88', deviceType: 'Tablet' },
  { id: '10', loginTime: '17-Aug-2026 07:30 AM', ipAddress: '185.112.44.19', deviceType: 'Web' },
];

export function findSettingsUser(id: number): SettingsUserRow | undefined {
  if (id === FAHAD_DETAIL.id) {
    return FAHAD_DETAIL;
  }
  return MOCK_SETTINGS_USERS.find((u) => u.id === id) || FAHAD_DETAIL;
}

export function getUserDetailProfile(id: number): UserDetailProfile {
  if (id === FAHAD_DETAIL.id) {
    return FAHAD_PROFILE;
  }
  return (
    USER_DETAIL_PROFILES[id] || {
      userId: String(id),
      department: '—',
      gender: '—',
      nationality: '—',
      languages: '—',
      createdAt: '—',
      lastUpdatedAt: '—',
      lastSignInAt: '—',
    }
  );
}
