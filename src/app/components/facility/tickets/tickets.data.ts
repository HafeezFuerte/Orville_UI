export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export type TicketStatus =
  | 'New'
  | 'Open'
  | 'In Progress'
  | 'On Hold'
  | 'Resolved'
  | 'Closed'
  | 'Rejected'
  | 'Accepted'
  | 'Vendor Rejected'
  | 'Tenant Rejected'
  | 'Escalated'
  | 'Re-opened';

export type TicketSource = 'Email' | 'Enter Manually' | 'Contact Form' | 'Tenant Portal';

export interface TicketRow {
  id: string;
  title: string;
  property: string;
  unit: string;
  priority: TicketPriority;
  status: TicketStatus;
  department: string;
  source: TicketSource;
  contactName: string;
  contactInitials: string;
  created: string;
  details: string;
  category: string;
}

/** Mock rows — Figma Facility > Ticket (3041:94437) + Board (3041:95309) */
export const TICKET_ROWS: TicketRow[] = [
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
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'Pest Control'
  },
  {
    id: '42659',
    title: 'Kitchen Full of Cockroaches',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-101-PR',
    priority: 'High',
    status: 'Rejected',
    department: 'Accounting Group',
    source: 'Enter Manually',
    contactName: 'Sahul Hameed',
    contactInitials: 'SH',
    created: '16-06-2026',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'Pest Control'
  },
  {
    id: '42660',
    title: 'Kitchen Full of Cockroaches',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-101-PR',
    priority: 'Low',
    status: 'Closed',
    department: 'Lease Group',
    source: 'Contact Form',
    contactName: 'Sahul Hameed',
    contactInitials: 'SH',
    created: '16-06-2026',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'Pest Control'
  },
  {
    id: '42661',
    title: 'Kitchen Full of Cockroaches',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-101-PR',
    priority: 'High',
    status: 'Rejected',
    department: 'Facility Group',
    source: 'Tenant Portal',
    contactName: 'Sahul Hameed',
    contactInitials: 'SH',
    created: '16-06-2026',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'Pest Control'
  },
  {
    id: 'TC1024',
    title: 'Water leakage under kitchen sink',
    property: 'Sunset Villa',
    unit: 'Villa-12',
    priority: 'Emergency',
    status: 'New',
    department: 'Facility Group',
    source: 'Tenant Portal',
    contactName: 'Sarah Jenkins',
    contactInitials: 'SJ',
    created: '15-06-2026',
    details: 'Active leak under sink; needs emergency plumbing.',
    category: 'Plumbing'
  },
  {
    id: 'TC1025',
    title: 'AC not cooling in living room',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-204',
    priority: 'High',
    status: 'New',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Omar Ali',
    contactInitials: 'OA',
    created: '15-06-2026',
    details: 'Living room AC blowing warm air since morning.',
    category: 'HVAC'
  },
  {
    id: 'TC1026',
    title: 'Broken corridor light fixture',
    property: 'Palm Residence',
    unit: 'Common Area',
    priority: 'Low',
    status: 'New',
    department: 'Facility Group',
    source: 'Enter Manually',
    contactName: 'Maya Chen',
    contactInitials: 'MC',
    created: '14-06-2026',
    details: 'Floor 3 corridor light flickering and out.',
    category: 'Electrical'
  },
  {
    id: 'TC1027',
    title: 'Water leakage under kitchen sink',
    property: 'Sunset Villa',
    unit: 'Villa-12',
    priority: 'Medium',
    status: 'Open',
    department: 'Facility Group',
    source: 'Contact Form',
    contactName: 'Ravi Kumar',
    contactInitials: 'RK',
    created: '14-06-2026',
    details: 'Secondary report of damp cabinet floor.',
    category: 'Plumbing'
  },
  {
    id: 'TC1028',
    title: 'Elevator stuck between floors',
    property: 'Marina Heights Tower A',
    unit: 'Elevator B',
    priority: 'Emergency',
    status: 'Open',
    department: 'Facility Group',
    source: 'Tenant Portal',
    contactName: 'Layla Hassan',
    contactInitials: 'LH',
    created: '16-06-2026',
    details: 'Elevator B not responding; passengers evacuated.',
    category: 'Elevator'
  },
  {
    id: 'TC1029',
    title: 'Gate remote not working',
    property: 'Palm Residence',
    unit: 'Gate-01',
    priority: 'Low',
    status: 'Open',
    department: 'Security Group',
    source: 'Email',
    contactName: 'Tom Reed',
    contactInitials: 'TR',
    created: '13-06-2026',
    details: 'Visitor gate remote battery / signal issue.',
    category: 'Access'
  },
  {
    id: 'TC1030',
    title: 'Replace lobby carpet section',
    property: 'Marina Heights Tower A',
    unit: 'Lobby',
    priority: 'Medium',
    status: 'In Progress',
    department: 'Facility Group',
    source: 'Enter Manually',
    contactName: 'Sarah Jenkins',
    contactInitials: 'SJ',
    created: '12-06-2026',
    details: 'Vendor on site for carpet patch.',
    category: 'Housekeeping'
  },
  {
    id: 'TC1031',
    title: 'Parking barrier arm jammed',
    property: 'Sunset Villa',
    unit: 'Parking',
    priority: 'High',
    status: 'In Progress',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Omar Ali',
    contactInitials: 'OA',
    created: '12-06-2026',
    details: 'Barrier stuck open; technician assigned.',
    category: 'Access'
  },
  {
    id: 'TC1032',
    title: 'Pool pump noise complaint',
    property: 'Palm Residence',
    unit: 'Pool Deck',
    priority: 'Medium',
    status: 'In Progress',
    department: 'Facility Group',
    source: 'Contact Form',
    contactName: 'Maya Chen',
    contactInitials: 'MC',
    created: '11-06-2026',
    details: 'Pump vibration reported overnight.',
    category: 'Pool'
  },
  {
    id: 'TC1033',
    title: 'Waiting on spare HVAC part',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-501',
    priority: 'High',
    status: 'On Hold',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Ravi Kumar',
    contactInitials: 'RK',
    created: '10-06-2026',
    details: 'Part ETA next week from vendor.',
    category: 'HVAC'
  },
  {
    id: 'TC1034',
    title: 'Tenant approval pending',
    property: 'Sunset Villa',
    unit: 'Villa-08',
    priority: 'Low',
    status: 'On Hold',
    department: 'Lease Group',
    source: 'Tenant Portal',
    contactName: 'Layla Hassan',
    contactInitials: 'LH',
    created: '09-06-2026',
    details: 'Access window confirmation needed.',
    category: 'Access'
  },
  {
    id: 'TC1035',
    title: 'Leak repaired and verified',
    property: 'Palm Residence',
    unit: 'Apartment-12',
    priority: 'Medium',
    status: 'Resolved',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Tom Reed',
    contactInitials: 'TR',
    created: '08-06-2026',
    details: 'Pipe joint replaced; dry for 48h.',
    category: 'Plumbing'
  },
  {
    id: 'TC1036',
    title: 'Lobby light replaced',
    property: 'Marina Heights Tower A',
    unit: 'Lobby',
    priority: 'Low',
    status: 'Resolved',
    department: 'Facility Group',
    source: 'Enter Manually',
    contactName: 'Sarah Jenkins',
    contactInitials: 'SJ',
    created: '07-06-2026',
    details: 'Fixture swapped; tested OK.',
    category: 'Electrical'
  },
  {
    id: 'TC1037',
    title: 'Duplicate pest ticket',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-101-PR',
    priority: 'Medium',
    status: 'Rejected',
    department: 'Facility Group',
    source: 'Contact Form',
    contactName: 'Omar Ali',
    contactInitials: 'OA',
    created: '06-06-2026',
    details: 'Merged into existing open ticket.',
    category: 'Pest Control'
  },
  {
    id: 'TC1038',
    title: 'Vendor quote accepted',
    property: 'Sunset Villa',
    unit: 'Villa-03',
    priority: 'High',
    status: 'Accepted',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Maya Chen',
    contactInitials: 'MC',
    created: '05-06-2026',
    details: 'Roof sealant quote approved.',
    category: 'Exterior'
  },
  {
    id: 'TC1039',
    title: 'Vendor declined scope',
    property: 'Palm Residence',
    unit: 'Roof',
    priority: 'High',
    status: 'Vendor Rejected',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Ravi Kumar',
    contactInitials: 'RK',
    created: '04-06-2026',
    details: 'Vendor cannot meet SLA window.',
    category: 'Exterior'
  },
  {
    id: 'TC1040',
    title: 'Tenant declined visit slot',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-310',
    priority: 'Medium',
    status: 'Tenant Rejected',
    department: 'Facility Group',
    source: 'Tenant Portal',
    contactName: 'Layla Hassan',
    contactInitials: 'LH',
    created: '03-06-2026',
    details: 'Reschedule requested by tenant.',
    category: 'HVAC'
  },
  {
    id: 'TC1041',
    title: 'Escalated water damage',
    property: 'Sunset Villa',
    unit: 'Villa-12',
    priority: 'Emergency',
    status: 'Escalated',
    department: 'Facility Group',
    source: 'Email',
    contactName: 'Tom Reed',
    contactInitials: 'TR',
    created: '02-06-2026',
    details: 'Manager escalation after SLA breach.',
    category: 'Plumbing'
  },
  {
    id: 'TC1042',
    title: 'Issue returned after close',
    property: 'Palm Residence',
    unit: 'Apartment-22',
    priority: 'High',
    status: 'Re-opened',
    department: 'Facility Group',
    source: 'Tenant Portal',
    contactName: 'Sarah Jenkins',
    contactInitials: 'SJ',
    created: '01-06-2026',
    details: 'Same AC fault reported again.',
    category: 'HVAC'
  },
  {
    id: 'TC1043',
    title: 'Noise complaint follow-up',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-415',
    priority: 'Low',
    status: 'Re-opened',
    department: 'Lease Group',
    source: 'Contact Form',
    contactName: 'Omar Ali',
    contactInitials: 'OA',
    created: '31-05-2026',
    details: 'Neighbor noise recurring evenings.',
    category: 'General'
  }
];
