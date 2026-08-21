export type FlatRowStatus = 'Available' | 'Maintenance';
export type FlatStayStatus = 'Pending' | 'Confirmed' | 'Checked in' | 'Checked out' | 'Cancelled';
export type FlatPaymentStatus = 'Unpaid' | 'Partial' | 'Paid';

export interface FlatRow {
  id: string;
  name: string;
  property: string;
  status: FlatRowStatus;
}

export interface FlatStay {
  id: string;
  flatId: string;
  guestName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: FlatStayStatus;
  paymentStatus: FlatPaymentStatus;
  totalAmount: number;
  paidAmount: number;
  notes: string;
}

export const FLAT_STAY_STATUSES: FlatStayStatus[] = [
  'Pending',
  'Confirmed',
  'Checked in',
  'Checked out',
  'Cancelled'
];

export const FLAT_PAYMENT_STATUSES: FlatPaymentStatus[] = ['Unpaid', 'Partial', 'Paid'];

export const FLAT_ROWS: FlatRow[] = [
  { id: 'f-101', name: 'A-101', property: 'Marina Heights', status: 'Available' },
  { id: 'f-102', name: 'A-102', property: 'Marina Heights', status: 'Available' },
  { id: 'f-201', name: 'A-201', property: 'Marina Heights', status: 'Available' },
  { id: 'f-305', name: 'B-305', property: 'Marina Heights', status: 'Available' },
  { id: 'f-110', name: 'C-110', property: 'Palm Residences', status: 'Available' },
  { id: 'f-111', name: 'C-111', property: 'Palm Residences', status: 'Available' },
  { id: 'f-401', name: 'D-401', property: 'Palm Residences', status: 'Maintenance' },
  { id: 'f-402', name: 'D-402', property: 'Palm Residences', status: 'Available' }
];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfWeek(date: Date): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function addMonths(date: Date, months: number): Date {
  const day = date.getDate();
  const next = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const max = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, max));
  return next;
}

export function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12);
}

export function lastNightKey(checkOut: string): string {
  return dateKey(addDays(parseDateKey(checkOut), -1));
}

export function diffDays(from: string, to: string): number {
  const a = parseDateKey(from).getTime();
  const b = parseDateKey(to).getTime();
  return Math.round((b - a) / 86400000);
}

export function staysOverlap(a: FlatStay, b: FlatStay): boolean {
  return a.checkIn < b.checkOut && b.checkIn < a.checkOut;
}

export function seedFlatStays(today = new Date()): FlatStay[] {
  const t = startOfDay(today);
  const k = (offset: number) => dateKey(addDays(t, offset));
  return [
    {
      id: 's-1001',
      flatId: 'f-101',
      guestName: 'Omar Al Mansoori',
      phone: '+971504892110',
      email: 'omar.mansoori@orville.ae',
      checkIn: k(0),
      checkOut: k(4),
      guests: 2,
      status: 'Checked in',
      paymentStatus: 'Paid',
      totalAmount: 4800,
      paidAmount: 4800,
      notes: 'Late check-in requested.'
    },
    {
      id: 's-1002',
      flatId: 'f-102',
      guestName: 'Sara Ibrahim',
      phone: '+971504892111',
      email: 'sara.ibrahim@orville.ae',
      checkIn: k(2),
      checkOut: k(6),
      guests: 3,
      status: 'Confirmed',
      paymentStatus: 'Partial',
      totalAmount: 3600,
      paidAmount: 1800,
      notes: 'Family stay.'
    },
    {
      id: 's-1003',
      flatId: 'f-201',
      guestName: 'Hassan Qureshi',
      phone: '+971504892112',
      email: 'hassan.qureshi@orville.ae',
      checkIn: k(-2),
      checkOut: k(1),
      guests: 1,
      status: 'Checked out',
      paymentStatus: 'Paid',
      totalAmount: 2100,
      paidAmount: 2100,
      notes: ''
    },
    {
      id: 's-1004',
      flatId: 'f-305',
      guestName: 'Layla Hassan',
      phone: '+971504892113',
      email: 'layla.hassan@orville.ae',
      checkIn: k(5),
      checkOut: k(12),
      guests: 2,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      totalAmount: 5600,
      paidAmount: 0,
      notes: 'Awaiting payment.'
    },
    {
      id: 's-1005',
      flatId: 'f-110',
      guestName: 'Noor Al Farsi',
      phone: '+971504892114',
      email: 'noor.farsi@orville.ae',
      checkIn: k(1),
      checkOut: k(3),
      guests: 4,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      totalAmount: 2400,
      paidAmount: 2400,
      notes: ''
    },
    {
      id: 's-1006',
      flatId: 'f-111',
      guestName: 'Youssef Nader',
      phone: '+971504892115',
      email: 'youssef.nader@orville.ae',
      checkIn: k(7),
      checkOut: k(10),
      guests: 2,
      status: 'Confirmed',
      paymentStatus: 'Partial',
      totalAmount: 2700,
      paidAmount: 900,
      notes: 'Sea view requested.'
    },
    {
      id: 's-1007',
      flatId: 'f-402',
      guestName: 'Mariam Saleh',
      phone: '+971504892116',
      email: 'mariam.saleh@orville.ae',
      checkIn: k(3),
      checkOut: k(8),
      guests: 1,
      status: 'Cancelled',
      paymentStatus: 'Unpaid',
      totalAmount: 3200,
      paidAmount: 0,
      notes: 'Cancelled by guest.'
    },
    {
      id: 's-1008',
      flatId: 'f-102',
      guestName: 'Daniel Wright',
      phone: '+971504892117',
      email: 'daniel.wright@orville.ae',
      checkIn: k(8),
      checkOut: k(14),
      guests: 2,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      totalAmount: 4200,
      paidAmount: 0,
      notes: ''
    },
    {
      id: 's-1009',
      flatId: 'f-101',
      guestName: 'Huda Karim',
      phone: '+971504892118',
      email: 'huda.karim@orville.ae',
      checkIn: k(6),
      checkOut: k(9),
      guests: 2,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      totalAmount: 2700,
      paidAmount: 2700,
      notes: ''
    },
    {
      id: 's-1010',
      flatId: 'f-201',
      guestName: 'Peter Lang',
      phone: '+971504892119',
      email: 'peter.lang@orville.ae',
      checkIn: k(4),
      checkOut: k(7),
      guests: 1,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      totalAmount: 1800,
      paidAmount: 1800,
      notes: ''
    },
    {
      id: 's-1011',
      flatId: 'f-305',
      guestName: 'Amira Farouk',
      phone: '+971504892120',
      email: 'amira.farouk@orville.ae',
      checkIn: k(-1),
      checkOut: k(2),
      guests: 3,
      status: 'Checked in',
      paymentStatus: 'Partial',
      totalAmount: 2400,
      paidAmount: 800,
      notes: ''
    },
    {
      id: 's-1012',
      flatId: 'f-110',
      guestName: 'Karim Haddad',
      phone: '+971504892121',
      email: 'karim.haddad@orville.ae',
      checkIn: k(10),
      checkOut: k(13),
      guests: 2,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      totalAmount: 2100,
      paidAmount: 0,
      notes: ''
    }
  ];
}
