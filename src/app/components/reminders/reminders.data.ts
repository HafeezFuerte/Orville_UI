export type ReminderPriority = 'Low' | 'Medium' | 'High';
export type ReminderStatus = 'Pending' | 'Completed';

export interface ReminderRow {
  id: string;
  title: string;
  todo: string;
  participants: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  lastUpdated: string;
  createdOn: string;
  date: string;
  paused: boolean;
  recurring: boolean;
  record: string;
}

export const REMINDER_ROWS: ReminderRow[] = [
  {
    id: '32153',
    title: 'Rent overdue follow-up',
    todo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    participants: 'Olivia Green',
    priority: 'Low',
    status: 'Pending',
    lastUpdated: '06-05-2026',
    createdOn: '06-05-2026',
    date: '06-05-2026',
    paused: true,
    recurring: false,
    record: 'Lease - 73778'
  },
  {
    id: '32154',
    title: 'Security deposit collection',
    todo: 'Follow up with the tenant on the outstanding security deposit.',
    participants: 'Zainab Hassan',
    priority: 'High',
    status: 'Completed',
    lastUpdated: '06-07-2026',
    createdOn: '06-07-2026',
    date: '06-07-2026',
    paused: false,
    recurring: false,
    record: 'Lease - 73778'
  },
  {
    id: '32155',
    title: 'Lease renewal follow-up',
    todo: 'Confirm renewal terms and send the updated lease pack.',
    participants: 'Zara Malik',
    priority: 'High',
    status: 'Completed',
    lastUpdated: '06-07-2026',
    createdOn: '06-07-2026',
    date: '06-07-2026',
    paused: false,
    recurring: true,
    record: 'Lease - 44120'
  },
  {
    id: '32156',
    title: 'Rent overdue follow-up',
    todo: 'Call the tenant and share the overdue rent statement.',
    participants: 'Zainab Hassan',
    priority: 'Medium',
    status: 'Completed',
    lastUpdated: '06-07-2026',
    createdOn: '06-07-2026',
    date: '06-07-2026',
    paused: false,
    recurring: false,
    record: 'Lease - 44120'
  }
];

export function getReminderDetail(id: string | null): ReminderRow {
  return REMINDER_ROWS.find((row) => row.id === id) || REMINDER_ROWS[0];
}
