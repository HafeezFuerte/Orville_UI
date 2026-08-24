export interface BulkAssignUnitRow {
  id: number;
  property: string;
  unit: string;
  landlords: string;
  beds: string;
}

export interface BulkAssignUserOption {
  id: number;
  name: string;
  email: string;
}

export const BULK_ASSIGN_USERS: BulkAssignUserOption[] = [
  { id: 1, name: 'Ahmed Hassan', email: 'ahmed.hassan@orville.ae' },
  { id: 2, name: 'Sara Al Maktoum', email: 'sara.m@orville.ae' },
  { id: 3, name: 'John Miller', email: 'john.miller@orville.ae' },
  { id: 4, name: 'Fatima Noor', email: 'fatima.n@orville.ae' },
  { id: 5, name: 'Hafeez Hafeez', email: 'hafeez@orville.ae' },
  { id: 6, name: 'Layla Ibrahim', email: 'layla@orville.ae' },
];

export const BULK_ASSIGN_UNITS: BulkAssignUnitRow[] = [
  {
    id: 1,
    property: 'DAR AL SALAAM',
    unit: '206-PR-15',
    landlords: 'Orville Real Estate',
    beds: 'N/A',
  },
  {
    id: 2,
    property: 'DAR AL SALAAM',
    unit: '204-PR-3',
    landlords: 'Orville Real Estate',
    beds: 'N/A',
  },
  {
    id: 3,
    property: 'DAR AL SALAAM',
    unit: '204-PR-1',
    landlords: 'Orville Real Estate',
    beds: 'N/A',
  },
  {
    id: 4,
    property: 'Barsha Building',
    unit: '201-PR-12',
    landlords: 'Orville Real Estate',
    beds: '2 Beds',
  },
  {
    id: 5,
    property: 'Barsha Building',
    unit: '102-PR-8',
    landlords: 'Orville Real Estate',
    beds: '1 Bed',
  },
  {
    id: 6,
    property: 'Saraya Plaza',
    unit: '1502',
    landlords: 'Orville Real Estate',
    beds: '3 Beds',
  },
  {
    id: 7,
    property: 'Saraya Plaza',
    unit: '1104',
    landlords: 'Orville Real Estate',
    beds: '2 Beds',
  },
  {
    id: 8,
    property: 'Marina Heights',
    unit: 'A-1201',
    landlords: 'Orville Real Estate',
    beds: 'Studio',
  },
  {
    id: 9,
    property: 'Marina Heights',
    unit: 'B-805',
    landlords: 'Orville Real Estate',
    beds: '1 Bed',
  },
  {
    id: 10,
    property: 'JLT Cluster X',
    unit: 'X3-1904',
    landlords: 'Orville Real Estate',
    beds: '2 Beds',
  },
  {
    id: 11,
    property: 'JLT Cluster X',
    unit: 'X1-602',
    landlords: 'Orville Real Estate',
    beds: 'N/A',
  },
  {
    id: 12,
    property: 'Palm Residence',
    unit: 'Villa-12',
    landlords: 'Orville Real Estate',
    beds: '4 Beds',
  },
];
