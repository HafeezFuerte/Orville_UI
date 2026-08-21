export interface GuideRow {
  id: string;
  numericId: string;
  name: string;
  property: string;
  propertyFull: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export const GUIDE_ROWS: GuideRow[] = [
  {
    id: 'RG-101',
    numericId: '31658',
    name: 'Pool Safety Rules',
    property: 'Dubai Marina, Tower A',
    propertyFull: 'Dubai Marina, Tower A, Dubai',
    date: '14-07-2026',
    createdAt: '14-07-2026',
    updatedAt: '14-07-2026',
    description:
      'Follow all posted pool rules. Children must be supervised. No glass containers. Swim at your own risk during quiet hours.'
  },
  {
    id: 'RG-102',
    numericId: '31659',
    name: 'Parking Guidelines',
    property: 'Dubai Marina, Tower B',
    propertyFull: 'Dubai Marina, Tower B, Dubai',
    date: '12-07-2026',
    createdAt: '12-07-2026',
    updatedAt: '12-07-2026',
    description: 'Assigned parking only. Visitor parking requires a permit from the lobby desk.'
  },
  {
    id: 'RG-103',
    numericId: '31660',
    name: 'Pet Policy',
    property: 'Downtown Residence',
    propertyFull: 'Downtown Residence, Dubai',
    date: '10-07-2026',
    createdAt: '10-07-2026',
    updatedAt: '10-07-2026',
    description: 'Pets must be registered with management. Leash required in common areas.'
  },
  {
    id: 'RG-104',
    numericId: '31661',
    name: 'Noise Regulations',
    property: 'Dubai Marina, Tower A',
    propertyFull: 'Dubai Marina, Tower A, Dubai',
    date: '09-07-2026',
    createdAt: '09-07-2026',
    updatedAt: '09-07-2026',
    description: 'Quiet hours are 10:00 PM to 8:00 AM. Report disturbances to security.'
  },
  {
    id: 'RG-105',
    numericId: '31662',
    name: 'Gym Usage Rules',
    property: 'Downtown Residence',
    propertyFull: 'Downtown Residence, Dubai',
    date: '08-07-2026',
    createdAt: '08-07-2026',
    updatedAt: '08-07-2026',
    description: 'Wipe equipment after use. Guests must be accompanied by a resident.'
  },
  {
    id: 'RG-106',
    numericId: '31663',
    name: 'BBQ Area Rules',
    property: 'Palm Jumeirah West',
    propertyFull: 'Palm Jumeirah West, Dubai',
    date: '05-07-2026',
    createdAt: '05-07-2026',
    updatedAt: '05-07-2026',
    description: 'Book the BBQ area in advance. Clean grills after use. Dispose of ash safely.'
  },
  {
    id: 'RG-107',
    numericId: '31664',
    name: 'Visitor Policy',
    property: 'Dubai Marina, Tower B',
    propertyFull: 'Dubai Marina, Tower B, Dubai',
    date: '02-07-2026',
    createdAt: '02-07-2026',
    updatedAt: '02-07-2026',
    description: 'All visitors must check in at reception. Overnight guests require prior approval.'
  },
  {
    id: 'RG-108',
    numericId: '31665',
    name: 'Move-in Guidelines',
    property: 'Palm Jumeirah West',
    propertyFull: 'Palm Jumeirah West, Dubai',
    date: '28-06-2026',
    createdAt: '28-06-2026',
    updatedAt: '28-06-2026',
    description: 'Schedule elevator access for move-in. Protect common area floors during moves.'
  },
  {
    id: 'RG-109',
    numericId: '31666',
    name: 'Recycling Guide',
    property: 'Downtown Residence',
    propertyFull: 'Downtown Residence, Dubai',
    date: '25-06-2026',
    createdAt: '25-06-2026',
    updatedAt: '25-06-2026',
    description: 'Separate recyclables into marked bins. Bulk items must be booked for pickup.'
  },
  {
    id: 'RG-110',
    numericId: '31667',
    name: 'Emergency Procedures',
    property: 'All Properties',
    propertyFull: 'All Properties',
    date: '20-06-2026',
    createdAt: '20-06-2026',
    updatedAt: '20-06-2026',
    description: 'Know your nearest exit. Follow building alarms and security instructions.'
  }
];

export function getGuideById(id: string | null): GuideRow {
  return GUIDE_ROWS.find((row) => row.id === id) ?? GUIDE_ROWS[0];
}
