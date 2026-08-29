export type UnitCategoryType = 'Residential' | 'Commercial' | 'Mixed Use';

export interface UnitTypeColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface UnitTypeRow {
  id: number;
  name: string;
  categoryType: UnitCategoryType;
  unitsCount: number;
}

export interface UnitTypeDraft {
  name: string;
  categoryType: UnitCategoryType;
}

export const UNIT_CATEGORY_TYPES: UnitCategoryType[] = [
  'Residential',
  'Commercial',
  'Mixed Use',
];

export const EMPTY_UNIT_TYPE: UnitTypeDraft = {
  name: '',
  categoryType: 'Residential',
};

/** Starts empty to match the screenshot. */
export const DEFAULT_UNIT_TYPES: UnitTypeRow[] = [];
