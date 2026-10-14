export interface PropertyTypeColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface PropertyTypeRow {
  id: number;
  name: string;
  code?: string;
  description?: string;
  propertiesCount: number;
  isActive?: boolean;
}

export interface PropertyTypeDraft {
  name: string;
  code?: string;
  description?: string;
}

export const EMPTY_PROPERTY_TYPE: PropertyTypeDraft = {
  name: '',
  code: '',
  description: '',
};

/** Starts empty to match the screenshot. */
export const DEFAULT_PROPERTY_TYPES: PropertyTypeRow[] = [];
