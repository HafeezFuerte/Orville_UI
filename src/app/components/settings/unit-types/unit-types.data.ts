export type UnitCategoryType = 'Residential' | 'Commercial' | 'Mixed Use';

export interface UnitTypeColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface UnitTypeRow {
  id: number;
  name: string;
  code?: string;
  description?: string;
  categoryType: UnitCategoryType;
  unitsCount: number;
  isActive?: boolean;
}

export interface UnitTypeDraft {
  name: string;
  code?: string;
  description?: string;
  categoryType: UnitCategoryType;
}

export const UNIT_CATEGORY_TYPES: UnitCategoryType[] = [
  'Residential',
  'Commercial',
  'Mixed Use',
];

export const EMPTY_UNIT_TYPE: UnitTypeDraft = {
  name: '',
  code: '',
  description: '',
  categoryType: 'Residential',
};

/** Starts empty to match the screenshot. */
export const DEFAULT_UNIT_TYPES: UnitTypeRow[] = [];
