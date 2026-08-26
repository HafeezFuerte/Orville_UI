export interface InventoryCategoryColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface InventoryCategory {
  id: number;
  name: string;
  parentId: number | null;
  itemCount: number;
}

export interface InventoryCategoryDraft {
  name: string;
  parentId: number | null;
}

export const EMPTY_INVENTORY_CATEGORY: InventoryCategoryDraft = {
  name: '',
  parentId: null,
};

export const DEFAULT_INVENTORY_CATEGORIES: InventoryCategory[] = [
  { id: 1, name: 'Electrical', parentId: null, itemCount: 1 },
  { id: 2, name: 'Hardware', parentId: null, itemCount: 0 },
  { id: 3, name: 'Home Appliances', parentId: null, itemCount: 0 },
];
