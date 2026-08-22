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
  id: string;
  itemCode: string;
  inventoryItem: string;
  description: string;
  quantity: number;
  price: number;
  taxProfile: string;
  total: number;
}

export interface PurchaseOrderLineDraft {
  itemCode: string;
  inventoryItem: string | null;
  description: string;
  quantity: number;
  price: number;
  taxProfile: string | null;
}

export interface PurchaseOrderLineDraft {
  itemCode: string;
  inventoryItem: string | null;
  description: string;
  quantity: number;
  price: number;
  taxProfile: string | null;
}

export interface PurchaseOrderDetailLine {
  id: string;
  itemCode: string;
  description: string;
  quantity: string;
  price: string;
  tax: string;
  total: string;
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

export const PURCHASE_ORDER_DETAIL_LINES: PurchaseOrderDetailLine[] = [
  {
    id: '1',
    itemCode: '31658',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    quantity: '2 Qty',
    price: 'AED 200.00',
    tax: 'AED 0.00',
    total: 'AED 200.00'
  },
  {
    id: '2',
    itemCode: '31659',
    description: 'Replacement filter pack for HVAC maintenance.',
    quantity: '1 Qty',
    price: 'AED 45.00',
    tax: 'AED 0.00',
    total: 'AED 45.00'
  },
  {
    id: '3',
    itemCode: '31660',
    description: 'Electrical cable 2.5mm for repair works.',
    quantity: '3 Qty',
    price: 'AED 22.50',
    tax: 'AED 0.00',
    total: 'AED 67.50'
  },
  {
    id: '4',
    itemCode: '31661',
    description: 'Pipe sealant consumable for plumbing line.',
    quantity: '2 Qty',
    price: 'AED 18.00',
    tax: 'AED 0.00',
    total: 'AED 36.00'
  },
  {
    id: '5',
    itemCode: '31662',
    description: 'LED tube replacement for common area lighting.',
    quantity: '4 Qty',
    price: 'AED 22.50',
    tax: 'AED 0.00',
    total: 'AED 90.00'
  }
];

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

export const PURCHASE_ORDER_FORM_OPTIONS = {
  properties: ['Marina Heights Tower A', 'Deira Business Center', '1st building/commercial', 'JLT Cluster A'],
  units: ['Apartment 01 Fl-1', 'Apartment-101-PR', 'Office-204', 'Retail-12'],
  vendors: ['Joy property man...', 'AirCool Solutions', 'BrightEdge Electricals', 'PlumbRight LLC'],
  inventoryItems: ['Micro wave', 'AC Filter Pack', 'LED Tube 18W', 'Pipe Sealant', 'Electrical Cable 2.5mm'],
  taxProfiles: ['Standard VAT 5%', 'Zero Rated', 'Exempt', 'Out of Scope']
};
