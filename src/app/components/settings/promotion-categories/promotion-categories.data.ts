export interface PromotionCategoryColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface PromotionCategory {
  id: number;
  name: string;
}

export interface PromotionCategoryDraft {
  name: string;
}

export const EMPTY_PROMOTION_CATEGORY: PromotionCategoryDraft = {
  name: '',
};

/** Starts empty to match the screenshot. */
export const DEFAULT_PROMOTION_CATEGORIES: PromotionCategory[] = [];
