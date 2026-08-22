export type VisitorStatus = 'Not Checked-in' | 'Checked-in' | 'Checked-out';
export type VisitorVisitType = 'Guest' | 'Personal' | 'Service' | 'Delivery';

export interface VisitorRow {
  id: string;
  visitorName: string;
  email: string;
  phoneNumber: string;
  visitingDate: string;
  visitType: VisitorVisitType;
  status: VisitorStatus;
  passCode: string;
  numberOfVisitors: string;
  property: string;
  unit: string;
  contact: string;
  created: string;
}

export interface VisitorDetail {
  id: string;
  visitorName: string;
  email: string;
  phone: string;
  propertyLabel: string;
  unitLabel: string;
  property: string;
  unit: string;
  visitingDate: string;
  numberOfVisitors: string;
  duration: string;
  visitType: VisitorVisitType;
  oneTimeValidity: string;
  country: string;
  checkIn: string;
  checkOut: string;
  status: VisitorStatus;
  sentTag: string;
  codeStatus: string;
  entryStatus: VisitorStatus;
  contact: string;
  invitedBy: string;
  notes: string;
  passcode: string;
  codeExpiry: string;
  uuid: string;
  systemCreated: string;
  systemUpdated: string;
  accessPassType: string;
  parkingRequired: boolean;
  vehicleNumber: string;
}

export const VISITOR_VISIT_TYPES: VisitorVisitType[] = ['Personal', 'Guest', 'Service', 'Delivery'];

export const VISITOR_PROPERTIES = [
  'Marina Heights Tower',
  'Dubai Marina, Tower A, Dubai',
  'Business Bay Central',
  'JLT Residence'
];

export const VISITOR_UNITS = [
  'Apartment-PR-01',
  'Apartment 402-PR-4',
  'Apartment-201-PR-1',
  'Office-1205'
];

export const VISITOR_CONTACTS = [
  'Hasibur Rashid Mah',
  'Operational',
  'Zaid Rahman',
  'Front Desk'
];

export const VISITOR_DURATION_OPTIONS = [
  '30 minutes',
  '60 minutes',
  '120 minutes',
  '240 minutes'
];

export const VISITOR_VALIDITY_OPTIONS = ['Not Set', '1 Day', '3 Days', '7 Days'];

export const VISITOR_ACCESS_PASS_TYPES = ['QR Code', 'Passcode', 'QR Code + Passcode'];

export const VISITOR_ROWS: VisitorRow[] = [
  {
    id: '31658',
    visitorName: 'Asad Ahmed',
    email: 'asadahmed23@mail.com',
    phoneNumber: '+971566894232',
    visitingDate: '06-06-2026',
    visitType: 'Guest',
    status: 'Not Checked-in',
    passCode: '05062027',
    numberOfVisitors: '03',
    property: 'Marina Heights Tower',
    unit: 'Apartment-PR-01',
    contact: 'Hasibur Rashid Mah',
    created: '06-06-2026 10.00 PM'
  },
  {
    id: '31659',
    visitorName: 'Ahmad Yasmin',
    email: 'ahmadyasmin@mail.com',
    phoneNumber: '+971 58 62 2358',
    visitingDate: '07-06-2026',
    visitType: 'Personal',
    status: 'Checked-in',
    passCode: '05062028',
    numberOfVisitors: '01',
    property: 'Marina Heights Tower',
    unit: 'Apartment-PR-02',
    contact: 'Zaid Rahman',
    created: '05-06-2026 04.30 PM'
  },
  {
    id: '31660',
    visitorName: 'Dana Said',
    email: 'danasaid23@mail.com',
    phoneNumber: '+971 58 62 2358',
    visitingDate: '08-06-2026',
    visitType: 'Service',
    status: 'Not Checked-in',
    passCode: '05062029',
    numberOfVisitors: '02',
    property: 'Business Bay Central',
    unit: 'Office-1205',
    contact: 'Operational',
    created: '06-06-2026 09.15 AM'
  },
  {
    id: '31661',
    visitorName: 'Mo Naser',
    email: 'mo_!naser@mail.com',
    phoneNumber: '+971 58 62 2358',
    visitingDate: '09-06-2026',
    visitType: 'Delivery',
    status: 'Checked-out',
    passCode: '05062030',
    numberOfVisitors: '01',
    property: 'JLT Residence',
    unit: 'Apartment-201-PR-1',
    contact: 'Front Desk',
    created: '08-06-2026 11.00 AM'
  },
  {
    id: '31662',
    visitorName: 'Moka Roma',
    email: 'mokaroma214@mail.com',
    phoneNumber: '+971 58 62 2358',
    visitingDate: '10-06-2026',
    visitType: 'Guest',
    status: 'Not Checked-in',
    passCode: '05062031',
    numberOfVisitors: '04',
    property: 'Marina Heights Tower',
    unit: 'Apartment-PR-01',
    contact: 'Hasibur Rashid Mah',
    created: '09-06-2026 02.45 PM'
  }
];

export const VISITOR_DETAIL: VisitorDetail = {
  id: '527556',
  visitorName: 'Asad Ahmed',
  email: 'asadahmed23@mail.com',
  phone: '+971568453525',
  propertyLabel: 'Marina Heights Tower . Apartment-PR-01',
  unitLabel: 'Apartment-PR-01',
  property: 'Dubai Marina, Tower A, Dubai',
  unit: 'Apartment 402-PR-4',
  visitingDate: '22-07-2026',
  numberOfVisitors: '3',
  duration: '120',
  visitType: 'Guest',
  oneTimeValidity: 'Yes',
  country: 'United Arab Emirates',
  checkIn: '-',
  checkOut: '-',
  status: 'Not Checked-in',
  sentTag: 'Pet Friendly',
  codeStatus: 'Not Used',
  entryStatus: 'Not Checked-in',
  contact: 'Operational',
  invitedBy: 'Asad Ahmed',
  notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  passcode: '448168',
  codeExpiry: '23-07-2026 12:00 AM',
  uuid: '686464d2-083b-4254-8518-fc7059b3360b',
  systemCreated: '20-07-2026 05:48 PM',
  systemUpdated: '20-07-2026 05:48 PM',
  accessPassType: 'QR Code',
  parkingRequired: true,
  vehicleNumber: ''
};

export function getVisitorDetail(id: string): VisitorDetail {
  const row = VISITOR_ROWS.find((r) => r.id === id);
  if (!row) {
    return { ...VISITOR_DETAIL, id };
  }

  return {
    ...VISITOR_DETAIL,
    id: row.id,
    visitorName: row.visitorName,
    email: row.email,
    phone: row.phoneNumber.replace(/\s/g, ''),
    propertyLabel: `${row.property} . ${row.unit}`,
    unitLabel: row.unit,
    property: row.property,
    unit: row.unit,
    visitingDate: row.visitingDate,
    numberOfVisitors: row.numberOfVisitors.replace(/^0+/, '') || row.numberOfVisitors,
    visitType: row.visitType,
    status: row.status,
    entryStatus: row.status,
    passcode: row.passCode,
    invitedBy: row.visitorName,
    contact: row.contact
  };
}
