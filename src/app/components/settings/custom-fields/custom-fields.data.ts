export interface CustomFieldDataTypeOption {
  id: string;
  name: string;
}

export type CustomFieldDataType =
  | 'TX'
  | 'NM'
  | 'DT'
  | 'TI'
  | 'DL'
  | 'DP'
  | 'FU'
  | 'IM'
  | 'RB'
  | 'CK'
  | 'Single Select'
  | 'Date'
  | 'String'
  | 'Integer'
  | 'Boolean'
  | 'Text'
  | string;

export type CustomFieldModule =
  | 'Property'
  | 'Units'
  | 'Rooms'
  | 'Leases'
  | 'Contacts'
  | 'Tenants'
  | 'Landlords'
  | 'Vendors'
  | 'Technicians'
  | 'Work Orders'
  | string;

export interface CustomFieldColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface CustomFieldRow {
  id: number;
  fieldName: string;
  fieldLabel: string;
  dataType: string;
  dataTypeId?: string;
  module: string;
  sortOrder?: number;
  isMandatory?: boolean;
  isReadonly?: boolean;
  isVisible?: boolean;
  minLength?: number;
  maxLength?: number;
  probableValues?: string;
  defaultValue?: string;
  visibleToTenant: boolean;
  visibleToLandlord: boolean;
  useForVerification: boolean;
  dependencyId?: number;
  dependencyType?: number;
}

export interface CustomFieldDraft {
  fieldName: string;
  fieldLabel: string;
  dataType: string;
  module: string;
  sortOrder: number;
  isMandatory: boolean;
  isReadonly: boolean;
  isVisible: boolean;
  minLength: number;
  maxLength: number;
  probableValues: string;
  defaultValue: string;
  visibleToTenant: boolean;
  visibleToLandlord: boolean;
  useForVerification: boolean;
  dependencyId: number;
  dependencyType: number;
}

export const EMPTY_CUSTOM_FIELD: CustomFieldDraft = {
  fieldName: '',
  fieldLabel: '',
  dataType: 'TX',
  module: 'Property',
  sortOrder: 1,
  isMandatory: false,
  isReadonly: false,
  isVisible: true,
  minLength: 0,
  maxLength: 0,
  probableValues: '',
  defaultValue: '',
  visibleToTenant: false,
  visibleToLandlord: false,
  useForVerification: false,
  dependencyId: 0,
  dependencyType: 0,
};

export const DEFAULT_DATA_TYPES: CustomFieldDataTypeOption[] = [
  { id: 'TX', name: 'Textbox' },
  { id: 'NM', name: 'Numeric' },
  { id: 'DT', name: 'Date' },
  { id: 'TI', name: 'Time' },
  { id: 'DL', name: 'Select' },
  { id: 'DP', name: 'SelectPicker' },
  { id: 'FU', name: 'FileUpload' },
  { id: 'IM', name: 'Image' },
  { id: 'RB', name: 'RadioButton' },
  { id: 'CK', name: 'CheckBox' },
];

export const CUSTOM_FIELD_DATA_TYPES = DEFAULT_DATA_TYPES;

export const CUSTOM_FIELD_MODULES: string[] = [
  'Property',
  'Units',
  'Rooms',
  'Tenants',
  'Landlords',
  'Vendors',
  'Leases',
  'Work Orders',
  'Tickets',
  'Invoices',
  'Expenses',
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
