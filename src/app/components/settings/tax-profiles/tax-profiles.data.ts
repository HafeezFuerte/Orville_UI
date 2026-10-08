export interface TaxProfile {
  id: number;
  name: string;
  percentage: number;
  expenseProfile: boolean;
  defaultCommercial: boolean;
  defaultResidential: boolean;
  expenseAccountId?: string;
}

export const EMPTY_TAX_PROFILE: Omit<TaxProfile, 'id'> = {
  name: '',
  percentage: 0,
  expenseProfile: false,
  defaultCommercial: false,
  defaultResidential: false,
  expenseAccountId: '',
};

/** Local mock — empty by default to match empty-state design. */
export const DEFAULT_TAX_PROFILES: TaxProfile[] = [];

