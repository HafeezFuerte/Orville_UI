export type VendorContractStatus = 'Active' | 'Draft' | 'Completed' | 'Offered';

export interface VendorContractRow {
  id: string;
  vendor: string;
  initials: string;
  name: string;
  properties: string;
  unitsRooms: string;
  startDate: string;
  endDate: string;
  createDate: string;
  status: VendorContractStatus;
  value: string;
  daysLeft: string;
}

export const VENDOR_CONTRACT_STATUS_TABS: Array<'All' | VendorContractStatus> = [
  'All',
  'Active',
  'Draft',
  'Completed',
  'Offered'
];

export const VENDOR_CONTRACT_ROWS: VendorContractRow[] = [
  {
    id: '31658',
    vendor: 'Orville Real Estate',
    initials: 'OR',
    name: 'Abdullah Al Shakib',
    properties: 'Marina Heights Tower',
    unitsRooms: '203 / 1250',
    startDate: '06-06-2026',
    endDate: '05-06-2027',
    createDate: '06-06-2026',
    status: 'Active',
    value: 'AED 56,000.00',
    daysLeft: '25 days'
  },
  {
    id: '31659',
    vendor: 'Orville Real Estate',
    initials: 'OR',
    name: 'Abdullah Al Shakib',
    properties: 'Marina Heights Tower',
    unitsRooms: '203 / 1250',
    startDate: '06-06-2026',
    endDate: '05-06-2027',
    createDate: '06-06-2026',
    status: 'Active',
    value: 'AED 56,000.00',
    daysLeft: '25 days'
  },
  {
    id: '31660',
    vendor: 'Horizon Holdings',
    initials: 'HH',
    name: 'Fatima Al Mansoori',
    properties: 'Palm Residence',
    unitsRooms: '12 / 48',
    startDate: '01-01-2026',
    endDate: '31-12-2026',
    createDate: '20-12-2025',
    status: 'Draft',
    value: 'AED 42,000.00',
    daysLeft: '—'
  },
  {
    id: '31641',
    vendor: 'Gulf Property LLC',
    initials: 'GP',
    name: 'Omar Hassan',
    properties: 'Downtown Views',
    unitsRooms: '8 / 20',
    startDate: '01-03-2025',
    endDate: '28-02-2026',
    createDate: '15-02-2025',
    status: 'Completed',
    value: 'AED 38,500.00',
    daysLeft: '0 days'
  },
  {
    id: '31672',
    vendor: 'Al Noor Investments',
    initials: 'AN',
    name: 'Sara Ibrahim',
    properties: 'Creek Harbour',
    unitsRooms: '4 / 16',
    startDate: '15-09-2026',
    endDate: '14-09-2027',
    createDate: '01-08-2026',
    status: 'Offered',
    value: 'AED 61,200.00',
    daysLeft: '—'
  }
];

export const VENDOR_OPTIONS = [
  'Orville Real Estate',
  'Horizon Holdings',
  'Gulf Property LLC',
  'Al Noor Investments'
];

export const PROPERTY_OPTIONS = [
  'Marina Heights Tower',
  'Palm Residence',
  'Downtown Views',
  'Creek Harbour'
];

export const UNIT_OPTIONS = ['Unit - Apartment- 210', 'Unit - Apartment- 209', 'Unit - 1204', 'Unit - 805'];

export const ROOM_OPTIONS = ['Room - Master', 'Room - 02', 'Room - Studio'];

export const CONTRACT_CYCLE_OPTIONS = ['Monthly', 'Quarterly', 'Yearly'];

export const FEE_TYPE_OPTIONS = ['Fixed', 'Percentage', 'Per unit'];

export const PAYMENT_VIA_OPTIONS = ['Bank transfer', 'Cheque', 'Cash'];

export function findVendorContract(id: string): VendorContractRow | undefined {
  return VENDOR_CONTRACT_ROWS.find((row) => row.id === id) ?? VENDOR_CONTRACT_ROWS[0];
}

export interface ContractPropertyRow {
  id: string;
  name: string;
  location: string;
  type: 'Residential' | 'Commercial';
  unitsRooms: string;
  internalStatus: string;
  tags: string;
  activeLeases: string;
  contracts: string;
  occupiedTotal: string;
  occupancyRate: number;
}

export interface ContractUnitRow {
  id: string;
  name: string;
  category: string;
  beds: string;
  property: string;
  propertyLocation: string;
  vendor: string;
  tags: string;
  unitType: string;
  floorNumber: string;
  managementFee: string;
  status: string;
  internalStatus: string;
  size: string;
  marketRent: string;
  deposited: string;
  published: string;
  forSale: string;
}

export interface ContractRoomRow extends ContractUnitRow {
  roomType: string;
}

export const CONTRACT_PROPERTIES: ContractPropertyRow[] = [
  {
    id: '31658',
    name: 'Marina Heights Towers',
    location: 'Dubai Marina, Tower A, Dubai',
    type: 'Residential',
    unitsRooms: '42/90',
    internalStatus: 'All',
    tags: 'Tags',
    activeLeases: '44',
    contracts: '2',
    occupiedTotal: '42/54',
    occupancyRate: 77.8
  },
  {
    id: '31658',
    name: 'Marina Heights Towers',
    location: 'Dubai Marina, Tower A, Dubai',
    type: 'Commercial',
    unitsRooms: '42/90',
    internalStatus: 'All',
    tags: 'Tags',
    activeLeases: '44',
    contracts: '2',
    occupiedTotal: '42/54',
    occupancyRate: 77.8
  }
];

export const CONTRACT_UNITS: ContractUnitRow[] = [
  {
    id: '31658',
    name: 'Apartment 209',
    category: 'Residential',
    beds: '1 Bed',
    property: 'Marina Height Towers',
    propertyLocation: 'Dubai',
    vendor: 'Orville Real Estate',
    tags: 'Tags',
    unitType: 'Apartment',
    floorNumber: '1 Floor',
    managementFee: 'AED 600',
    status: 'Occupied',
    internalStatus: 'All',
    size: '1200 Sqft',
    marketRent: 'AED 36500.00',
    deposited: 'AED 4000.00',
    published: 'No',
    forSale: 'No'
  },
  {
    id: '31658',
    name: 'Apartment 209',
    category: 'Residential',
    beds: '1 Bed',
    property: 'Marina Height Towers',
    propertyLocation: 'Dubai',
    vendor: 'Orville Real Estate',
    tags: 'Tags',
    unitType: 'Apartment',
    floorNumber: '1 Floor',
    managementFee: 'AED 600',
    status: 'Occupied',
    internalStatus: 'All',
    size: '1200 Sqft',
    marketRent: 'AED 36500.00',
    deposited: 'AED 4000.00',
    published: 'No',
    forSale: 'No'
  }
];

export const CONTRACT_ROOMS: ContractRoomRow[] = [
  {
    id: '31658',
    name: 'Apartment 209',
    category: 'Residential',
    beds: '1 Bed',
    property: 'Marina Height Towers',
    propertyLocation: 'Dubai',
    vendor: 'Orville Real Estate',
    tags: 'Tags',
    unitType: 'Apartment',
    roomType: '1 Bedroom',
    floorNumber: '1 Floor',
    managementFee: 'AED 600',
    status: 'Occupied',
    internalStatus: 'All',
    size: '1200 Sqft',
    marketRent: 'AED 36500.00',
    deposited: 'AED 4000.00',
    published: 'No',
    forSale: 'No'
  },
  {
    id: '31658',
    name: 'Apartment 209',
    category: 'Residential',
    beds: '1 Bed',
    property: 'Marina Height Towers',
    propertyLocation: 'Dubai',
    vendor: 'Orville Real Estate',
    tags: 'Tags',
    unitType: 'Apartment',
    roomType: 'Maid Room',
    floorNumber: '1 Floor',
    managementFee: 'AED 600',
    status: 'Occupied',
    internalStatus: 'All',
    size: '1200 Sqft',
    marketRent: 'AED 36500.00',
    deposited: 'AED 4000.00',
    published: 'No',
    forSale: 'No'
  }
];

export const CONTRACT_COMMISSIONS = [
  {
    from: 'Vendor',
    type: 'Percentage',
    percent: '5%',
    amount: 'AED 3,000.00',
    fixedAmount: 'AED 0.00',
    reservedAmount: 'AED 0.00',
    balance: 'AED 3,000.00'
  }
];

export const CONTRACT_DOCUMENTS = [
  { name: 'Vendor Agreement.pdf', meta: '2.4 MB - Updated today' },
  { name: 'Vendor Agreement.pdf', meta: '2.4 MB - Updated today' },
  { name: 'Vendor Agreement.pdf', meta: '2.4 MB - Updated today' },
  { name: 'Vendor Agreement.pdf', meta: '2.4 MB - Updated today' }
];

export const CONTRACT_PAYMENTS = [
  {
    id: '31658',
    status: 'Pending',
    name: 'John Smith',
    invoice: 'INV-2025-001',
    cheque: 'CHQ-00125',
    date: '05-06-2026',
    category: 'Utilities',
    description: 'Utility Charges',
    amount: 'AED 1,200.00'
  },
  {
    id: '31659',
    status: 'Pending',
    name: 'John Smith',
    invoice: 'INV-2025-001',
    cheque: 'CHQ-00125',
    date: '05-06-2026',
    category: 'Utilities',
    description: 'Utility Charges',
    amount: 'AED 1,200.00'
  }
];

export const CONTRACT_SIGNATURES = [
  { id: '31658', status: 'Pending', name: 'John Smith', document: 'Vendor Agreement.pdf', sent: '05-06-2026', type: 'Vendor' },
  { id: '31659', status: 'Pending', name: 'Sarah Ahmed', document: 'Vendor Agreement.pdf', sent: '05-06-2026', type: 'Witness' }
];
