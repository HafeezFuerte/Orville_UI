export type ReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface ReservationRow {
  id: string;
  name: string;
  reserve: string;
  space: string;
  lease: string;
  time: string;
  bookingDate: string;
  phone: string;
  email: string;
  createdAt: string;
  status: ReservationStatus;
  property: string;
  unit: string;
  slotDuration: string;
  notes: string;
}

export const RESERVATION_ROWS: ReservationRow[] = [
  {
    id: '31658',
    name: 'Meeting Room A',
    reserve: 'Omar Al Mansoori',
    space: 'Skyline Meeting Room',
    lease: 'L-31942',
    time: '6:00 PM – 8:00 PM',
    bookingDate: '14-07-2026',
    phone: '+971504892110',
    email: 'skyline@orville.ae',
    createdAt: '14-07-2026',
    status: 'Confirmed',
    property: 'Marina Heights Tower',
    unit: 'Apartment-18-MR-1',
    slotDuration: '2 hours',
    notes: 'Team planning session.'
  },
  {
    id: '31659',
    name: 'Pool Deck Booking',
    reserve: 'Sara Ibrahim',
    space: 'Community Pool Deck',
    lease: 'L-32011',
    time: '10:00 AM – 12:00 PM',
    bookingDate: '15-07-2026',
    phone: '+971504892111',
    email: 'pool@orville.ae',
    createdAt: '14-07-2026',
    status: 'Pending',
    property: 'Marina Heights Tower',
    unit: 'Common-Pool-01',
    slotDuration: '2 hours',
    notes: 'Family gathering.'
  },
  {
    id: '31660',
    name: 'Gym Session',
    reserve: 'Hassan Qureshi',
    space: 'Gym Studio',
    lease: 'L-31880',
    time: '8:00 AM – 10:00 AM',
    bookingDate: '16-07-2026',
    phone: '+971504892112',
    email: 'gym@orville.ae',
    createdAt: '10-07-2026',
    status: 'Cancelled',
    property: 'Marina Heights Tower',
    unit: 'Gym-02',
    slotDuration: '2 hours',
    notes: 'Cancelled by guest.'
  }
];

export function getReservationDetail(id: string | null): ReservationRow {
  return RESERVATION_ROWS.find((row) => row.id === id) || RESERVATION_ROWS[0];
}
