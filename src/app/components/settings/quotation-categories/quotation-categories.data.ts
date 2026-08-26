export interface QuotationCategoryColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface QuotationCategory {
  id: number;
  name: string;
  helpText: string;
  isAdmin: boolean;
}

export interface QuotationCategoryDraft {
  name: string;
  helpText: string;
}

export const EMPTY_QUOTATION_CATEGORY: QuotationCategoryDraft = {
  name: '',
  helpText: '',
};

/** Starts empty to match the screenshot; users can add via the modal. */
export const DEFAULT_QUOTATION_CATEGORIES: QuotationCategory[] = [];
