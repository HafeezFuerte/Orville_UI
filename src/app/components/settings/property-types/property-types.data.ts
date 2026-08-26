export interface PropertyTypeColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface PropertyTypeRow {
  id: number;
  name: string;
  propertiesCount: number;
}

export interface PropertyTypeDraft {
  name: string;
}

export const EMPTY_PROPERTY_TYPE: PropertyTypeDraft = {
  name: '',
};

/** Starts empty to match the screenshot. */
export const DEFAULT_PROPERTY_TYPES: PropertyTypeRow[] = [];
