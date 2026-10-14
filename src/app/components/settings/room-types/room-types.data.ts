export type RoomCategoryType = 'Residential' | 'Commercial' | 'Mixed Use';

export interface RoomTypeColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface RoomTypeRow {
  id: number;
  name: string;
  code?: string;
  description?: string;
  categoryType: RoomCategoryType;
  roomsCount: number;
  isActive?: boolean;
}

export interface RoomTypeDraft {
  name: string;
  code?: string;
  description?: string;
  categoryType: RoomCategoryType;
}

export const ROOM_CATEGORY_TYPES: RoomCategoryType[] = [
  'Residential',
  'Commercial',
  'Mixed Use',
];

export const EMPTY_ROOM_TYPE: RoomTypeDraft = {
  name: '',
  code: '',
  description: '',
  categoryType: 'Residential',
};

/** Starts empty to match Unit Types / Room Types empty state. */
export const DEFAULT_ROOM_TYPES: RoomTypeRow[] = [];
