export type PromotionStatus = 'Draft' | 'Published';

export interface PromotionRow {
  id: string;
  name: string;
  code: string;
  category: string;
  status: PromotionStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  offer: string;
  email: string;
  phone: string;
  property: string;
  sendableTo: string;
  contacts: string;
  project: string;
  order: string;
  address: string;
  country: string;
  city: string;
  state: string;
  createdAt: string;
  createdBy: string;
}

export const PROMOTION_ROWS: PromotionRow[] = [
  {
    id: '658',
    name: 'Resident Exclusive Discount',
    code: 'MARINA-EXCL-18',
    category: 'Discount',
    status: 'Published',
    startDate: '15-07-2026',
    endDate: '23-07-2026',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    description:
      'Enjoy an exclusive 15% discount on all amenity bookings this month. This special offer is available only for verified residents of Sunset Apartments. Use code MARINA-EXCL-18 at checkout.',
    offer: '15% Off',
    email: 'event@mail.com',
    phone: '+971589652235',
    property: 'Sunset Apartments',
    sendableTo: 'Property',
    contacts: 'All Residents',
    project: 'Tower A',
    order: '1',
    address: 'Level 18, Marina Heights, Dubai',
    country: 'United Arab Emirates',
    city: 'Dubai',
    state: 'Dubai',
    createdAt: '10-07-2026',
    createdBy: 'Admin User'
  },
  {
    id: '659',
    name: 'Summer Pool Access',
    code: 'POOL26',
    category: 'Amenity',
    status: 'Draft',
    startDate: '01-08-2026',
    endDate: '31-08-2026',
    startTime: '08:00 AM',
    endTime: '08:00 PM',
    description: 'Complimentary pool access for residents during August.',
    offer: 'Free Access',
    email: 'amenities@orville.ae',
    phone: '+971502223344',
    property: 'Marina Heights Tower',
    sendableTo: 'Property',
    contacts: 'All Residents',
    project: 'Tower B',
    order: '2',
    address: 'Marina Walk',
    country: 'United Arab Emirates',
    city: 'Dubai',
    state: 'Dubai',
    createdAt: '12-07-2026',
    createdBy: 'Community Manager'
  },
  {
    id: '660',
    name: 'Welcome Gift Bundle',
    code: 'WELCOME',
    category: 'Gift',
    status: 'Published',
    startDate: '01-06-2026',
    endDate: '31-12-2026',
    startTime: '12:00 AM',
    endTime: '11:59 PM',
    description: 'Welcome gift for new tenants signing a 12-month lease.',
    offer: 'Gift Bundle',
    email: 'welcome@orville.ae',
    phone: '+971509991122',
    property: 'Orville Plaza',
    sendableTo: 'All Tenants',
    contacts: 'New Tenants',
    project: 'Plaza',
    order: '3',
    address: 'Orville Plaza, Business Bay',
    country: 'United Arab Emirates',
    city: 'Dubai',
    state: 'Dubai',
    createdAt: '01-06-2026',
    createdBy: 'Admin User'
  }
];

export function getPromotionById(id: string | null): PromotionRow {
  return PROMOTION_ROWS.find((row) => row.id === id) ?? PROMOTION_ROWS[0];
}
