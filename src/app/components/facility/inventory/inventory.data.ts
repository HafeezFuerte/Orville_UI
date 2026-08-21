export type InventoryStockType = 'Stock' | 'Non-Stock';

export interface InventoryRow {
  id: string;
  itemName: string;
  partNumber: string;
  category: string;
  subcategory: string;
  cost: string;
  threshold: string;
  stockType: InventoryStockType;
  placedDate: string;
  expiration: string;
  expiringSoon: boolean;
  vendor: string;
  locations: string;
}

export interface InventoryLineRow {
  id: string;
  location: string;
  area: string;
  status: string;
  availableQty: string;
  minimumQty: string;
  barcode: string;
  cost: string;
}

export interface InventoryDetail {
  id: string;
  itemName: string;
  partNumber: string;
  category: string;
  subcategory: string;
  stockType: InventoryStockType;
  description: string;
  itemCost: string;
  itemQuantity: string;
  quantityThreshold: string;
  sameCost: boolean;
  placedDate: string;
  expirationDate: string;
  created: string;
  lastUpdated: string;
  images: { name: string; url: string }[];
  notes: string;
  attachments: { name: string; size: string; type: string }[];
  lines: InventoryLineRow[];
}

export const INVENTORY_ROWS: InventoryRow[] = [
  {
    id: '167',
    itemName: 'Micro wave',
    partNumber: '13483854561',
    category: 'Electrical',
    subcategory: 'N/A',
    cost: 'AED 100.00',
    threshold: 'N/A',
    stockType: 'Non-Stock',
    placedDate: '01-07-2026',
    expiration: '30-07-2026',
    expiringSoon: true,
    vendor: 'N/A',
    locations: '0 (1)'
  },
  {
    id: '168',
    itemName: 'AC Filter Pack',
    partNumber: 'AF-9921-H',
    category: 'HVAC',
    subcategory: 'Filters',
    cost: 'AED 45.00',
    threshold: '10',
    stockType: 'Stock',
    placedDate: '12-01-2026',
    expiration: '12-01-2027',
    expiringSoon: false,
    vendor: 'AirCool Solutions',
    locations: '3 (5)'
  },
  {
    id: '169',
    itemName: 'LED Tube 18W',
    partNumber: 'LT-18W-6500',
    category: 'Electrical',
    subcategory: 'Lighting',
    cost: 'AED 22.50',
    threshold: '25',
    stockType: 'Stock',
    placedDate: '05-02-2026',
    expiration: 'N/A',
    expiringSoon: false,
    vendor: 'BrightEdge Electricals',
    locations: '2 (4)'
  },
  {
    id: '170',
    itemName: 'Pipe Sealant',
    partNumber: 'PS-440',
    category: 'Plumbing',
    subcategory: 'Consumables',
    cost: 'AED 18.00',
    threshold: '8',
    stockType: 'Stock',
    placedDate: '20-03-2026',
    expiration: '20-09-2026',
    expiringSoon: false,
    vendor: 'PlumbRight LLC',
    locations: '1 (2)'
  }
];

export const INVENTORY_LINE_ROWS: InventoryLineRow[] = [
  {
    id: '31658',
    location: 'Deira, Dubai',
    area: 'Deira',
    status: 'In Stock',
    availableQty: '2 Qty',
    minimumQty: '-',
    barcode: '2125387',
    cost: 'AED 200.00'
  },
  {
    id: '31659',
    location: 'Deira, Dubai',
    area: 'Deira',
    status: 'In Stock',
    availableQty: '2 Qty',
    minimumQty: '-',
    barcode: '2125388',
    cost: 'AED 200.00'
  },
  {
    id: '31660',
    location: 'Marina, Dubai',
    area: 'Marina',
    status: 'In Stock',
    availableQty: '1 Qty',
    minimumQty: '1',
    barcode: '2125389',
    cost: 'AED 200.00'
  },
  {
    id: '31661',
    location: 'JLT, Dubai',
    area: 'Cluster A',
    status: 'Low Stock',
    availableQty: '0 Qty',
    minimumQty: '2',
    barcode: '2125390',
    cost: 'AED 200.00'
  },
  {
    id: '31662',
    location: 'Deira, Dubai',
    area: 'Deira',
    status: 'In Stock',
    availableQty: '2 Qty',
    minimumQty: '-',
    barcode: '2125391',
    cost: 'AED 200.00'
  }
];

export const INVENTORY_DETAIL: InventoryDetail = {
  id: '167',
  itemName: 'Microwave Oven',
  partNumber: '13483854561',
  category: 'Electrical',
  subcategory: '-',
  stockType: 'Non-Stock',
  description:
    'Countertop microwave for kitchen appliances inventory. Suitable for residential units and common kitchens.',
  itemCost: 'AED 350.00',
  itemQuantity: '2 Qty',
  quantityThreshold: '-',
  sameCost: true,
  placedDate: '01-07-2026',
  expirationDate: '30-07-2026',
  created: '20-07-2026',
  lastUpdated: '20-07-2026',
  images: [{ name: 'image.jpg', url: 'assets/images/work-order-detail/before-sample.jpg' }],
  notes: 'Keep spare unit sealed. Check warranty card before issuing to technicians.',
  attachments: [
    { name: 'Warranty.pdf', size: '240 KB', type: 'Warranty' },
    { name: 'Manual.pdf', size: '1.2 MB', type: 'Manual' }
  ],
  lines: INVENTORY_LINE_ROWS
};

export const INVENTORY_FORM_OPTIONS = {
  categories: ['Electrical', 'HVAC', 'Plumbing', 'Mechanical', 'Fire Safety', 'General'],
  subcategories: ['Filters', 'Lighting', 'Consumables', 'Tools', 'Spare Parts', 'N/A'],
  vendors: ['AirCool Solutions', 'BrightEdge Electricals', 'PlumbRight LLC', 'SafeGuard Systems'],
  attachmentTypes: ['Invoice', 'Warranty', 'Manual', 'Photo', 'Other']
};

export interface InventoryLineDraft {
  location: string;
  area: string;
  barcode: string;
  cost: string;
  availableQty: string;
  minimumQty: string;
}
