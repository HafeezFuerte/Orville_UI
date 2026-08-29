export type ListingOffer = 'For Rent' | 'For Sale';
export type ListingPublishStatus = 'Published' | 'Draft' | 'Unpublished';
export type ListingOccupancy = 'Vacant' | 'Occupied';

export interface PropertyListingCard {
  id: string;
  ref: string;
  title: string;
  unitType: string;
  price: string;
  occupancy: ListingOccupancy;
  publishStatus: ListingPublishStatus;
  offer: ListingOffer;
  imageUrl?: string | null;
}

export type PropertyInquiryType = 'For Rent' | 'For Sale' | 'General' | 'Viewing';

export interface PropertyInquiryRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: PropertyInquiryType;
  unit: string;
  message: string;
  submittedAt: string;
}

export interface ProjectListingRow {
  id: string;
  name: string;
  developer: string;
  location: string;
  units: number;
  available: number;
  status: 'Active' | 'Coming Soon' | 'Sold Out';
}

/** Presentation mock — varied listings for a realistic All Listings grid. */
export const PROPERTY_LISTING_CARDS: PropertyListingCard[] = [
  {
    id: '301-PR-1',
    ref: '#301-PR-1',
    title: 'Nada Rigga Building — Apartment 301',
    unitType: 'Apartment',
    price: 'AED 15,816.67',
    occupancy: 'Vacant',
    publishStatus: 'Published',
    offer: 'For Rent',
    imageUrl: null
  },
  {
    id: '412-VL-2',
    ref: '#412-VL-2',
    title: 'Jumeirah Village Circle — Villa 12',
    unitType: 'Villa',
    price: 'AED 285,000.00',
    occupancy: 'Vacant',
    publishStatus: 'Published',
    offer: 'For Sale',
    imageUrl: null
  },
  {
    id: '88-ST-3',
    ref: '#88-ST-3',
    title: 'Business Bay — Studio 8803',
    unitType: 'Studio',
    price: 'AED 6,500.00',
    occupancy: 'Occupied',
    publishStatus: 'Published',
    offer: 'For Rent',
    imageUrl: null
  },
  {
    id: '55-OF-4',
    ref: '#55-OF-4',
    title: 'DIFC Gate Village — Office 504',
    unitType: 'Office',
    price: 'AED 42,000.00',
    occupancy: 'Vacant',
    publishStatus: 'Draft',
    offer: 'For Rent',
    imageUrl: null
  },
  {
    id: '210-PH-5',
    ref: '#210-PH-5',
    title: 'Marina Gate — Penthouse 2101',
    unitType: 'Penthouse',
    price: 'AED 8,900,000.00',
    occupancy: 'Vacant',
    publishStatus: 'Published',
    offer: 'For Sale',
    imageUrl: null
  },
  {
    id: '17-TH-6',
    ref: '#17-TH-6',
    title: 'Arabian Ranches — Townhouse 17',
    unitType: 'Townhouse',
    price: 'AED 18,500.00',
    occupancy: 'Occupied',
    publishStatus: 'Published',
    offer: 'For Rent',
    imageUrl: null
  },
  {
    id: '9-SH-7',
    ref: '#9-SH-7',
    title: 'City Walk — Retail Shop 09',
    unitType: 'Shop',
    price: 'AED 95,000.00',
    occupancy: 'Vacant',
    publishStatus: 'Unpublished',
    offer: 'For Rent',
    imageUrl: null
  },
  {
    id: '301-PR-8',
    ref: '#301-PR-8',
    title: 'Nada Rigga Building — Apartment 308',
    unitType: 'Apartment',
    price: 'AED 14,200.00',
    occupancy: 'Vacant',
    publishStatus: 'Published',
    offer: 'For Rent',
    imageUrl: null
  },
  {
    id: '33-WH-9',
    ref: '#33-WH-9',
    title: 'Al Quoz Industrial — Warehouse 33',
    unitType: 'Warehouse',
    price: 'AED 1,250,000.00',
    occupancy: 'Vacant',
    publishStatus: 'Published',
    offer: 'For Sale',
    imageUrl: null
  },
  {
    id: '64-AP-10',
    ref: '#64-AP-10',
    title: 'Dubai Hills — Apartment A64',
    unitType: 'Apartment',
    price: 'AED 11,800.00',
    occupancy: 'Occupied',
    publishStatus: 'Published',
    offer: 'For Rent',
    imageUrl: null
  },
  {
    id: '2-VL-11',
    ref: '#2-VL-11',
    title: 'Palm Jumeirah — Villa Frond M',
    unitType: 'Villa',
    price: 'AED 45,000.00',
    occupancy: 'Vacant',
    publishStatus: 'Draft',
    offer: 'For Rent',
    imageUrl: null
  },
  {
    id: '101-ST-12',
    ref: '#101-ST-12',
    title: 'Downtown Views — Studio 1012',
    unitType: 'Studio',
    price: 'AED 920,000.00',
    occupancy: 'Vacant',
    publishStatus: 'Published',
    offer: 'For Sale',
    imageUrl: null
  }
];

export const PROJECT_LISTING_ROWS: ProjectListingRow[] = [
  {
    id: 'PRJ-001',
    name: 'Marina Heights Residences',
    developer: 'Orville Developments',
    location: 'Dubai Marina',
    units: 240,
    available: 38,
    status: 'Active'
  },
  {
    id: 'PRJ-002',
    name: 'Business Bay Towers',
    developer: 'Skyline Group',
    location: 'Business Bay',
    units: 180,
    available: 0,
    status: 'Sold Out'
  },
  {
    id: 'PRJ-003',
    name: 'JLT Lakeside',
    developer: 'Orville Developments',
    location: 'Jumeirah Lake Towers',
    units: 96,
    available: 96,
    status: 'Coming Soon'
  }
];

/** Screenshot SoT shows empty state; keep seed rows for local preview when needed. */
export const PROPERTY_INQUIRY_ROWS: PropertyInquiryRow[] = [];

export const PROPERTY_INQUIRY_SAMPLE_ROWS: PropertyInquiryRow[] = [
  {
    id: 'INQ-1001',
    fullName: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+971 50 123 4567',
    inquiryType: 'For Rent',
    unit: '301-PR-1',
    message: 'Interested in viewing this apartment next week.',
    submittedAt: '28 Aug 2026, 10:24 AM'
  },
  {
    id: 'INQ-1002',
    fullName: 'Sara Al Maktoum',
    email: 'sara.m@example.com',
    phone: '+971 55 987 6543',
    inquiryType: 'For Rent',
    unit: '301-PR-4',
    message: 'Please share availability and lease terms.',
    submittedAt: '27 Aug 2026, 3:12 PM'
  },
  {
    id: 'INQ-1003',
    fullName: 'James Wilson',
    email: 'j.wilson@example.com',
    phone: '+971 52 444 2211',
    inquiryType: 'For Sale',
    unit: '301-PR-8',
    message: 'Looking to purchase — request floor plan.',
    submittedAt: '20 Aug 2026, 9:05 AM'
  }
];

export function listingPublishClass(status: ListingPublishStatus): string {
  switch (status) {
    case 'Published':
      return 'ov-status ov-status--active';
    case 'Draft':
      return 'ov-status ov-status--warning';
    default:
      return 'ov-status ov-status--muted';
  }
}

export function listingOfferClass(_offer: ListingOffer): string {
  return 'ov-status ov-status--soft';
}

export function listingOccupancyClass(occupancy: ListingOccupancy): string {
  return occupancy === 'Occupied'
    ? 'ov-status ov-status--active'
    : 'ov-status ov-status--outline';
}

export function listingYesNoClass(value: boolean): string {
  return value ? 'ov-status ov-status--soft' : 'ov-status ov-status--outline';
}

export interface PropertyListingDetail {
  id: string;
  listingId: string;
  unitNo: string;
  name: string;
  property: string;
  propertyCode?: string;
  location: string;
  unitType: string;
  beds: string;
  baths: string;
  size: string;
  occupancy: ListingOccupancy;
  publishStatus: ListingPublishStatus;
  offer: ListingOffer;
  city: string;
  community: string;
  forSale: boolean;
  published: boolean;
  monthlyRent: string;
  salePrice: string;
  description: string;
  amenities: string[];
  imageUrl?: string | null;
}

const LISTING_DETAIL_BY_ID: Record<string, PropertyListingDetail> = {
  '301-PR-1': {
    id: '301-PR-1',
    listingId: '73912',
    unitNo: '301-PR-1',
    name: 'Apartment 301-PR-1',
    property: 'Nada Rigga Building',
    propertyCode: 'NRB-01',
    location: '-',
    unitType: 'Apartment',
    beds: '2',
    baths: '2',
    size: '1,150 sqft',
    occupancy: 'Vacant',
    publishStatus: 'Published',
    offer: 'For Rent',
    city: 'Dubai',
    community: 'Al Rigga',
    forSale: false,
    published: true,
    monthlyRent: 'AED 15,816.67',
    salePrice: 'N/A',
    description:
      'Bright 2-bedroom apartment in Nada Rigga Building with open living area and city views. Ideal for professionals seeking a central Dubai address.',
    amenities: [
      'Covered Parking',
      'High-Speed Wi-Fi',
      '24/7 Security',
      'Swimming Pool',
      'Fully Equipped Gym',
      'Concierge'
    ],
    imageUrl: null
  },
  '301-PR-2': {
    id: '301-PR-2',
    listingId: '73912',
    unitNo: '301-PR-2',
    name: 'Apartment 301-PR-2',
    property: 'Nada Rigga Building',
    propertyCode: 'NRB-01',
    location: '-',
    unitType: 'Apartment',
    beds: '-',
    baths: '-',
    size: '-',
    occupancy: 'Vacant',
    publishStatus: 'Published',
    offer: 'For Rent',
    city: 'Dubai',
    community: '-',
    forSale: false,
    published: true,
    monthlyRent: 'AED 17,033.33',
    salePrice: 'N/A',
    description: '',
    amenities: [],
    imageUrl: null
  }
};

function detailFromCard(card: PropertyListingCard): PropertyListingDetail {
  const forSale = card.offer === 'For Sale';
  return {
    id: card.id,
    listingId: card.id.replace(/\D/g, '') || card.id,
    unitNo: card.id,
    name: card.title.includes('—')
      ? card.title.split('—').pop()?.trim() || card.title
      : card.title,
    property: card.title.includes('—')
      ? card.title.split('—')[0].trim()
      : 'Property',
    location: '-',
    unitType: card.unitType,
    beds: '-',
    baths: '-',
    size: '-',
    occupancy: card.occupancy,
    publishStatus: card.publishStatus,
    offer: card.offer,
    city: 'Dubai',
    community: '-',
    forSale,
    published: card.publishStatus === 'Published',
    monthlyRent: forSale ? 'N/A' : card.price,
    salePrice: forSale ? card.price : 'N/A',
    description: '',
    amenities: [],
    imageUrl: card.imageUrl
  };
}

/** Resolve listing detail for route param; falls back to card catalog. */
export function getListingDetail(id: string): PropertyListingDetail {
  if (LISTING_DETAIL_BY_ID[id]) {
    return LISTING_DETAIL_BY_ID[id];
  }
  const card = PROPERTY_LISTING_CARDS.find((c) => c.id === id);
  if (card) {
    return detailFromCard(card);
  }
  return {
    ...LISTING_DETAIL_BY_ID['301-PR-2'],
    id,
    unitNo: id,
    name: `Listing ${id}`
  };
}
