export interface BroadcastTypeColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface BroadcastTypeRow {
  id: number;
  type: string;
  isAdminCategory: boolean;
}

export interface BroadcastTypeDraft {
  type: string;
}

export const EMPTY_BROADCAST_TYPE: BroadcastTypeDraft = {
  type: '',
};

/** Sample broadcast types matching the Broadcast Configuration screenshot. */
export const DEFAULT_BROADCAST_TYPES: BroadcastTypeRow[] = [
  { id: 1, type: 'Updates', isAdminCategory: true },
  { id: 2, type: 'Alerts', isAdminCategory: true },
  { id: 3, type: 'Memo', isAdminCategory: true },
  { id: 4, type: 'Announcement', isAdminCategory: true },
];
