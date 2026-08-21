export type QuotationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Expired';

export interface QuotationRow {
  id: string;
  workOrderId: string;
  title: string;
  number: string;
  vendor: string;
  vendorInitials: string;
  category: string;
  status: QuotationStatus;
  amount: string;
  date: string;
  validity: string;
}

export const QUOTATION_ROWS: QuotationRow[] = [
  {
    id: 'Q-1042',
    workOrderId: 'WO-8821',
    title: 'AC Compressor Replacement',
    number: 'QT-2026-0142',
    vendor: 'CoolAir Technical Services',
    vendorInitials: 'CT',
    category: 'HVAC',
    status: 'Pending',
    amount: 'AED 4,850.00',
    date: '12-01-2026',
    validity: '26-01-2026'
  },
  {
    id: 'Q-1041',
    workOrderId: 'WO-8790',
    title: 'Lobby Lighting Upgrade',
    number: 'QT-2026-0138',
    vendor: 'BrightEdge Electricals',
    vendorInitials: 'BE',
    category: 'Electrical',
    status: 'Approved',
    amount: 'AED 12,400.00',
    date: '10-01-2026',
    validity: '24-01-2026'
  },
  {
    id: 'Q-1040',
    workOrderId: 'WO-8755',
    title: 'Kitchen Pest Control Service',
    number: 'QT-2026-0131',
    vendor: 'SafeNest Pest Solutions',
    vendorInitials: 'SN',
    category: 'Pest Control',
    status: 'Rejected',
    amount: 'AED 1,250.00',
    date: '08-01-2026',
    validity: '15-01-2026'
  },
  {
    id: 'Q-1039',
    workOrderId: 'WO-8702',
    title: 'Parking Gate Motor Repair',
    number: 'QT-2026-0124',
    vendor: 'AutoGate ME',
    vendorInitials: 'AG',
    category: 'Mechanical',
    status: 'Expired',
    amount: 'AED 3,100.00',
    date: '02-01-2026',
    validity: '09-01-2026'
  },
  {
    id: 'Q-1038',
    workOrderId: 'WO-8688',
    title: 'Water Heater Replacement',
    number: 'QT-2026-0119',
    vendor: 'PlumbRight LLC',
    vendorInitials: 'PR',
    category: 'Plumbing',
    status: 'Pending',
    amount: 'AED 2,780.00',
    date: '05-01-2026',
    validity: '19-01-2026'
  },
  {
    id: 'Q-1037',
    workOrderId: 'WO-8650',
    title: 'Fire Alarm Panel Inspection',
    number: 'QT-2026-0112',
    vendor: 'FireSafe Systems',
    vendorInitials: 'FS',
    category: 'Safety',
    status: 'Approved',
    amount: 'AED 6,900.00',
    date: '03-01-2026',
    validity: '17-01-2026'
  }
];

export interface QuotationLineItem {
  id: string;
  title: string;
  quantity: number;
  amountPerItem: number;
  totalAmount: number;
  category: string;
  taxProfile: string;
  description: string;
}

export const QUOTATION_LINE_ITEMS: QuotationLineItem[] = [
  {
    id: '1',
    title: 'Compressor unit — 2.5 ton',
    quantity: 1,
    amountPerItem: 3200,
    totalAmount: 3200,
    category: 'HVAC Parts',
    taxProfile: 'VAT 5%',
    description: 'OEM compressor for tower A rooftop unit.'
  },
  {
    id: '2',
    title: 'Labor — installation & testing',
    quantity: 8,
    amountPerItem: 180,
    totalAmount: 1440,
    category: 'Labor',
    taxProfile: 'VAT 5%',
    description: 'Technician hours including pressure test.'
  },
  {
    id: '3',
    title: 'Refrigerant recharge',
    quantity: 2,
    amountPerItem: 105,
    totalAmount: 210,
    category: 'Consumables',
    taxProfile: 'VAT 5%',
    description: 'R-410A top-up after seal check.'
  }
];

export const QUOTATION_DETAIL = {
  id: 'Q-1042',
  title: 'AC Compressor Replacement',
  number: 'QT-2026-0142',
  status: 'Pending' as QuotationStatus,
  workOrderId: 'WO-8821',
  vendor: 'CoolAir Technical Services',
  category: 'HVAC',
  amount: 'AED 4,850.00',
  date: '12-01-2026',
  validity: '26-01-2026',
  property: 'Dubai Marina, Tower A, Dubai',
  unit: 'Apartment 402-PR-4',
  contact: 'James T. Hirai',
  notes: 'Quotation includes parts warranty of 12 months and labor warranty of 90 days.',
  created: '12-01-2026'
};

export const QUOTATION_FORM_OPTIONS = {
  vendors: ['CoolAir Technical Services', 'BrightEdge Electricals', 'SafeNest Pest Solutions', 'AutoGate ME'],
  categories: ['HVAC', 'Electrical', 'Plumbing', 'Pest Control', 'Mechanical', 'Safety'],
  taxProfiles: ['VAT 5%', 'VAT 0%', 'Exempt'],
  workOrders: ['WO-8821', 'WO-8790', 'WO-8755', 'WO-8702'],
  properties: ['Dubai Marina, Tower A', 'Business Bay Tower', 'JLT Cluster X'],
  units: ['Apartment 402-PR-4', 'Office 1201', 'Shop G-04'],
  priorities: ['Low', 'Medium', 'High', 'Emergency']
};
