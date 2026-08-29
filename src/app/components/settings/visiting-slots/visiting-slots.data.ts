export interface VisitingSlotColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface VisitingSlotRow {
  id: number;
  name: string;
}

export interface VisitingSlotDraft {
  name: string;
}

export const EMPTY_VISITING_SLOT: VisitingSlotDraft = {
  name: '',
};

/** Sample slots matching the Visiting Slots screenshot (11 total). */
export const DEFAULT_VISITING_SLOTS: VisitingSlotRow[] = [
  { id: 166, name: '9AM to 10AM' },
  { id: 167, name: '10AM to 11AM' },
  { id: 168, name: '11AM to 12PM' },
  { id: 169, name: '12PM to 1PM' },
  { id: 170, name: '1PM to 2PM' },
  { id: 171, name: '2PM to 3PM' },
  { id: 172, name: '3PM to 4PM' },
  { id: 173, name: '4PM to 5PM' },
  { id: 174, name: '5PM to 6PM' },
  { id: 175, name: '6PM to 7PM' },
  { id: 176, name: '7PM to 8PM' },
];
