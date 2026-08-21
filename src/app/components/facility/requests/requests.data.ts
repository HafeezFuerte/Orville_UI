export type RequestStatus =
  | 'Open'
  | 'New'
  | 'Pending'
  | 'Approved'
  | 'Resolved'
  | 'Closed'
  | 'On Hold'
  | 'Rejected'
  | 'Re-opened';

export type RequestPriority = 'Low' | 'Medium' | 'High';

export interface RequestRow {
  id: string;
  title: string;
  property: string;
  unit: string;
  priority: RequestPriority;
  status: RequestStatus;
  department: string;
  source: string;
  contactName: string;
  contactInitials: string;
  created: string;
  details: string;
}

export const REQUEST_ROWS: RequestRow[] = [
  {
    id: '42658',
    title: 'Kitchen Full of Cockroaches',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-101-PR',
    priority: 'Medium',
    status: 'Open',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Sahul Hameed',
    contactInitials: 'SH',
    created: '16-06-2026',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: '42659',
    title: 'AC Not Cooling Properly',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-204-PR',
    priority: 'High',
    status: 'Rejected',
    department: 'Accounting Group',
    source: 'Enter Manually',
    contactName: 'Sahul Hameed',
    contactInitials: 'SH',
    created: '16-06-2026',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: '42660',
    title: 'Water Leak in Bathroom',
    property: 'Orville Plaza',
    unit: 'Apartment-101-PR',
    priority: 'Low',
    status: 'Closed',
    department: 'Lease Group',
    source: 'Contact Form',
    contactName: 'Sahul Hameed',
    contactInitials: 'SH',
    created: '16-06-2026',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: '42661',
    title: 'Broken Elevator Button',
    property: 'Downtown Residence',
    unit: 'Common Area',
    priority: 'High',
    status: 'Rejected',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Fatima Al Noor',
    contactInitials: 'FN',
    created: '15-06-2026',
    details: 'Elevator panel on floor 12 needs replacement.'
  },
  {
    id: '42662',
    title: 'Lobby Light Flickering',
    property: 'Palm Jumeirah West',
    unit: 'Lobby',
    priority: 'Medium',
    status: 'Open',
    department: 'Facility Group',
    source: 'Enter Manually',
    contactName: 'Omar Al Mansoori',
    contactInitials: 'OM',
    created: '15-06-2026',
    details: 'Main lobby ceiling lights flickering intermittently.'
  },
  {
    id: '42663',
    title: 'Parking Gate Stuck',
    property: 'Marina Heights Tower B',
    unit: 'Parking P2',
    priority: 'High',
    status: 'Rejected',
    department: 'Facility Group',
    source: 'Contact Form',
    contactName: 'Layla Hassan',
    contactInitials: 'LH',
    created: '14-06-2026',
    details: 'Barrier arm does not open with resident cards.'
  },
  {
    id: '42664',
    title: 'Gym Equipment Noise',
    property: 'Downtown Residence',
    unit: 'Gym',
    priority: 'Medium',
    status: 'Closed',
    department: 'Lease Group',
    source: 'Email',
    contactName: 'Sahul Hameed',
    contactInitials: 'SH',
    created: '14-06-2026',
    details: 'Treadmill 3 making grinding noise during use.'
  },
  {
    id: '42665',
    title: 'Pool Filter Alarm',
    property: 'Palm Jumeirah West',
    unit: 'Pool Deck',
    priority: 'Low',
    status: 'Open',
    department: 'Facility Group',
    source: 'Enter Manually',
    contactName: 'Noor Khalid',
    contactInitials: 'NK',
    created: '13-06-2026',
    details: 'Filter pressure alarm triggered overnight.'
  },
  {
    id: '42666',
    title: 'Intercom Not Working',
    property: 'Orville Plaza',
    unit: 'Apartment-512-PR',
    priority: 'Medium',
    status: 'Closed',
    department: 'Accounting Group',
    source: 'Contact Form',
    contactName: 'Sahul Hameed',
    contactInitials: 'SH',
    created: '13-06-2026',
    details: 'Unit intercom does not connect to lobby desk.'
  },
  {
    id: '42667',
    title: 'Smoke Detector Beeping',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-308-PR',
    priority: 'Low',
    status: 'Rejected',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Aisha Rahman',
    contactInitials: 'AR',
    created: '12-06-2026',
    details: 'Detector chirps every few minutes — likely battery.'
  },
  {
    id: '42668',
    title: 'Door Lock Jammed',
    property: 'Marina Heights Tower B',
    unit: 'Apartment-115-PR',
    priority: 'High',
    status: 'New',
    department: 'Facility Group',
    source: 'Contact Form',
    contactName: 'James Carter',
    contactInitials: 'JC',
    created: '12-06-2026',
    details: 'Front door deadbolt will not turn from outside.'
  },
  {
    id: '42669',
    title: 'Hot Water Unavailable',
    property: 'Downtown Residence',
    unit: 'Apartment-220-PR',
    priority: 'High',
    status: 'Pending',
    department: 'Lease Group',
    source: 'Email',
    contactName: 'Mariam Saleh',
    contactInitials: 'MS',
    created: '11-06-2026',
    details: 'No hot water in kitchen or bathroom since morning.'
  }
];
