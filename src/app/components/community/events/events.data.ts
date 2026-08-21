export type EventStatus = 'Draft' | 'Published' | 'Cancelled';

export interface EventRow {
  id: string;
  name: string;
  location: string;
  status: EventStatus;
  date: string;
  maxAttendance: number;
  startTime: string;
  endTime: string;
  description: string;
  email: string;
  phone: string;
  property: string;
  sendableTo: string;
  attendees: number;
  createdAt: string;
  createdBy: string;
}

export const EVENT_ROWS: EventRow[] = [
  {
    id: '658',
    name: 'Fire Drill',
    location: 'Level 18, Marina Heights, Dubai',
    status: 'Draft',
    date: '15-07-2026',
    maxAttendance: 100,
    startTime: '10:00 PM',
    endTime: '1:00 AM',
    description: 'Mandatory building fire drill for all residents and staff.',
    email: 'event@mail.com',
    phone: '+971589652235',
    property: 'Marina Heights Tower',
    sendableTo: 'Property',
    attendees: 0,
    createdAt: '10-07-2026',
    createdBy: 'Admin User'
  },
  {
    id: '659',
    name: 'Community BBQ',
    location: 'Podium Garden, Orville Plaza',
    status: 'Published',
    date: '20-07-2026',
    maxAttendance: 80,
    startTime: '05:00 PM',
    endTime: '08:00 PM',
    description: 'Evening barbecue for residents and families.',
    email: 'community@orville.ae',
    phone: '+971 50 222 3344',
    property: 'Orville Plaza',
    sendableTo: 'Property',
    attendees: 0,
    createdAt: '08-07-2026',
    createdBy: 'Community Manager'
  },
  {
    id: '660',
    name: 'Yoga Morning',
    location: 'Rooftop Deck, Marina Heights',
    status: 'Cancelled',
    date: '22-07-2026',
    maxAttendance: 40,
    startTime: '07:00 AM',
    endTime: '08:00 AM',
    description: 'Sunrise yoga session for residents.',
    email: 'wellness@orville.ae',
    phone: '+971 50 555 7788',
    property: 'Marina Heights Tower',
    sendableTo: 'Property',
    attendees: 0,
    createdAt: '05-07-2026',
    createdBy: 'Admin User'
  },
  {
    id: '661',
    name: 'Kids Movie Night',
    location: 'Community Hall, Orville Plaza',
    status: 'Draft',
    date: '28-07-2026',
    maxAttendance: 60,
    startTime: '06:30 PM',
    endTime: '08:30 PM',
    description: 'Family-friendly movie screening for kids.',
    email: 'events@orville.ae',
    phone: '+971 50 999 1122',
    property: 'Orville Plaza',
    sendableTo: 'Property',
    attendees: 0,
    createdAt: '12-07-2026',
    createdBy: 'Community Manager'
  }
];

export function getEventById(id: string | null): EventRow {
  return EVENT_ROWS.find((row) => row.id === id) ?? EVENT_ROWS[0];
}
