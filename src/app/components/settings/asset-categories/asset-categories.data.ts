export interface AssetCategoryColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface AssetCategory {
  id: number;
  name: string;
  parentId: number | null;
  assetCount: number;
}

export interface AssetCategoryDraft {
  name: string;
  parentId: number | null;
}

export const EMPTY_ASSET_CATEGORY: AssetCategoryDraft = {
  name: '',
  parentId: null,
};

export const DEFAULT_ASSET_CATEGORIES: AssetCategory[] = [
  { id: 1, name: 'Home Appliances', parentId: null, assetCount: 3 },
];
