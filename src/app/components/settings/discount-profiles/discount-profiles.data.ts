export type DiscountType = 'Percentage' | 'Fixed Amount';

export interface DiscountProfile {
  id: number;
  name: string;
  discountType: DiscountType;
  value: number;
  isDefault: boolean;
}

export const DISCOUNT_TYPE_OPTIONS: DiscountType[] = ['Percentage', 'Fixed Amount'];

export const EMPTY_DISCOUNT_PROFILE: Omit<DiscountProfile, 'id'> = {
  name: '',
  discountType: 'Percentage',
  value: 0,
  isDefault: false,
};

/** Local mock — empty by default to match empty-state design. */
export const DEFAULT_DISCOUNT_PROFILES: DiscountProfile[] = [];
