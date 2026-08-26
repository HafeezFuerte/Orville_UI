export type CustomFieldDataType =
  | 'Single Select'
  | 'Date'
  | 'String'
  | 'Integer'
  | 'Boolean'
  | 'Text';

export type CustomFieldModule = 'Leases' | 'Units' | 'Properties' | 'Contacts';

export interface CustomFieldColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface CustomFieldRow {
  id: number;
  fieldName: string;
  fieldLabel: string;
  dataType: CustomFieldDataType;
  module: CustomFieldModule;
  visibleToTenant: boolean;
  visibleToLandlord: boolean;
  useForVerification: boolean;
}

export const CUSTOM_FIELD_DATA_TYPES: CustomFieldDataType[] = [
  'Single Select',
  'Date',
  'String',
  'Integer',
  'Boolean',
  'Text',
];

export const CUSTOM_FIELD_MODULES: CustomFieldModule[] = [
  'Leases',
  'Units',
  'Properties',
  'Contacts',
];

/** 17 rows — page 1 matches the Custom Fields screenshot when sorted by field name. */
export const DEFAULT_CUSTOM_FIELDS: CustomFieldRow[] = [
  {
    id: 1,
    fieldName: 'created_by',
    fieldLabel: 'Created By',
    dataType: 'Single Select',
    module: 'Leases',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 2,
    fieldName: 'created_date',
    fieldLabel: 'created date',
    dataType: 'Date',
    module: 'Leases',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 3,
    fieldName: 'flat_no',
    fieldLabel: 'Flat No',
    dataType: 'String',
    module: 'Units',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 4,
    fieldName: 'Floor',
    fieldLabel: 'Floor',
    dataType: 'String',
    module: 'Units',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 5,
    fieldName: 'Makani No',
    fieldLabel: 'Makani No',
    dataType: 'String',
    module: 'Properties',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 6,
    fieldName: 'monthly_rent',
    fieldLabel: 'monthly Rent',
    dataType: 'Integer',
    module: 'Units',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 7,
    fieldName: 'move_in_date',
    fieldLabel: 'Move in Date',
    dataType: 'Date',
    module: 'Leases',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 8,
    fieldName: 'no_of_person',
    fieldLabel: 'No of Person',
    dataType: 'Integer',
    module: 'Leases',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 9,
    fieldName: 'Parking No',
    fieldLabel: 'Parking No',
    dataType: 'String',
    module: 'Units',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 10,
    fieldName: 'paying_date',
    fieldLabel: 'Paying_Date',
    dataType: 'Date',
    module: 'Leases',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 11,
    fieldName: 'property_code',
    fieldLabel: 'Property Code',
    dataType: 'String',
    module: 'Properties',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 12,
    fieldName: 'renewal_notice',
    fieldLabel: 'Renewal Notice',
    dataType: 'Integer',
    module: 'Leases',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 13,
    fieldName: 'security_deposit',
    fieldLabel: 'Security Deposit',
    dataType: 'Integer',
    module: 'Leases',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 14,
    fieldName: 'unit_status',
    fieldLabel: 'Unit Status',
    dataType: 'Single Select',
    module: 'Units',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 15,
    fieldName: 'vacating_date',
    fieldLabel: 'Vacating Date',
    dataType: 'Date',
    module: 'Leases',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 16,
    fieldName: 'view_type',
    fieldLabel: 'View Type',
    dataType: 'Single Select',
    module: 'Units',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
  {
    id: 17,
    fieldName: 'year_built',
    fieldLabel: 'Year Built',
    dataType: 'Integer',
    module: 'Properties',
    visibleToTenant: false,
    visibleToLandlord: false,
    useForVerification: false,
  },
];
