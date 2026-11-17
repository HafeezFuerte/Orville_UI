export type PurchaseOrderStatus = 'Draft' | 'Open' | 'Approved' | 'Closed' | 'Rejected';

export interface PurchaseOrderRow {
  id: string;
  poNumber: string;
  title: string;
  status: PurchaseOrderStatus;
  category: string;
  totalAmount: string;
  poDate: string;
  dueDate: string;
  vendor: string;
  property: string;
  unit: string;
  workOrder: string;
  invoice: string;
  addedBy: string;
}

export interface PurchaseOrderLineItem {
  item_code: string;
  code: string;
  baction: string;
  inventory_code: string | null;
  description: string;
  qty: number;
  amt: number;
  total_amt: number;
  tax_profile: number;
}

export interface PurchaseOrderLineDraft {
  item_code: string;
  code: string;
  baction: string;
  inventory_code: string | null;
  description: string;
  qty: number;
  amt: number;
  total_amt: number;
  tax_profile: number;
}

export interface PurchaseOrderLineDraft {
  item_code: string;
  code: string;
  baction: string;
  inventory_code: string | null;
  description: string;
  qty: number;
  amt: number;
  total_amt: number;
  tax_profile: number;
}

export interface PurchaseOrderDetailLine {
  item_code: string;
  code: string;
  baction: string;
  inventory_code: string | null;
  description: string;
  qty: number;
  amt: number;
  total_amt: number;
  tax_profile: number;
}

export interface PurchaseOrderDetail {
  id: string;
  title: string;
  poRef: string;
  status: PurchaseOrderStatus;
  poNumber: string;
  category: string;
  details: string;
  requisitioner: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  property: string;
  unit: string;
  shipping: {
    shipToName: string;
    companyName: string;
    phone: string;
    address: string;
    city: string;
    stateZip: string;
  };
  lines: PurchaseOrderDetailLine[];
}

export const PURCHASE_ORDER_DETAIL_LINES: any[] = [];

export const PURCHASE_ORDER_DETAIL: PurchaseOrderDetail = {
  id: '167',
  title: 'Building Repair Works',
  poRef: 'P3521',
  status: 'Draft',
  poNumber: '2924',
  category: 'Maintenance',
  details:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  requisitioner: '--',
  vendorName: 'Purchase Vendor',
  vendorEmail: 'vendor@gmail.com',
  vendorPhone: '+971585928532',
  property: 'Marina Heights Tower',
  unit: 'Apartment FR-8L',
  shipping: {
    shipToName: '01-01-2021',
    companyName: 'AED 500.00',
    phone: '+9715862325425',
    address: 'Buhaleeba plaza-5th floor - Al Muraqqabat',
    city: 'Dubai',
    stateZip: 'Dubai- 000000'
  },
  lines: PURCHASE_ORDER_DETAIL_LINES
};

export function getPurchaseOrderDetail(id: string): PurchaseOrderDetail {
  const row = PURCHASE_ORDER_ROWS.find((r) => r.id === id);
  if (!row) {
    return { ...PURCHASE_ORDER_DETAIL, id };
  }
  return {
    ...PURCHASE_ORDER_DETAIL,
    id: row.id,
    title: row.title,
    poRef: `P${row.poNumber}`,
    status: row.status,
    poNumber: row.poNumber,
    category: row.category === 'N/A' ? 'Maintenance' : row.category,
    vendorName: row.vendor.replace('...', ''),
    property: row.property.replace('...', ''),
    unit: row.unit
  };
}

export const PURCHASE_ORDER_ROWS: PurchaseOrderRow[] = [
  {
    id: '167',
    poNumber: '2924',
    title: 'Building Repair Works',
    status: 'Draft',
    category: 'N/A',
    totalAmount: 'AED 0.00',
    poDate: '01-01-2025',
    dueDate: '01-01-2025',
    vendor: 'Joy property man...',
    property: '1st building/c...',
    unit: 'Apartment 01 Fl-1',
    workOrder: '-',
    invoice: '-',
    addedBy: 'Zaid Rahman'
  },
  {
    id: '168',
    poNumber: '2925',
    title: 'Plumbing Repair and Maintenance',
    status: 'Draft',
    category: 'N/A',
    totalAmount: 'AED 0.00',
    poDate: '01-01-2025',
    dueDate: '01-01-2025',
    vendor: 'Joy property man...',
    property: '1st building/c...',
    unit: 'Apartment 01 Fl-1',
    workOrder: '-',
    invoice: '-',
    addedBy: 'Zaid Rahman'
  },
  {
    id: '169',
    poNumber: '2926',
    title: 'HVAC Filter Replacement',
    status: 'Open',
    category: 'HVAC',
    totalAmount: 'AED 450.00',
    poDate: '15-02-2025',
    dueDate: '28-02-2025',
    vendor: 'AirCool Solutions',
    property: 'Marina Heights Tower A',
    unit: 'Apartment-101-PR',
    workOrder: '42658',
    invoice: '-',
    addedBy: 'Zaid Rahman'
  },
  {
    id: '170',
    poNumber: '2927',
    title: 'Electrical Supplies',
    status: 'Approved',
    category: 'Electrical',
    totalAmount: 'AED 1,200.00',
    poDate: '20-03-2025',
    dueDate: '05-04-2025',
    vendor: 'BrightEdge Electricals',
    property: 'Deira Business Center',
    unit: 'Office-204',
    workOrder: '42660',
    invoice: 'INV-8821',
    addedBy: 'Sahul Hameed'
  }
];

// export const PURCHASE_ORDER_FORM_OPTIONS = {
//   properties: ['Marina Heights Tower A', 'Deira Business Center', '1st building/commercial', 'JLT Cluster A'],
//   units: ['Apartment 01 Fl-1', 'Apartment-101-PR', 'Office-204', 'Retail-12'],
//   vendors: ['Joy property man...', 'AirCool Solutions', 'BrightEdge Electricals', 'PlumbRight LLC'],
//   inventoryItems: [],
//   taxProfiles: ['Standard VAT 5%', 'Zero Rated', 'Exempt', 'Out of Scope'],
//   countries :[],
//   states :[]
// };
