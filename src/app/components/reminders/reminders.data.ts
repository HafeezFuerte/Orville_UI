export type ReminderPriority = 'Low' | 'Medium' | 'High';
export type ReminderStatus = 'Pending' | 'Completed';

export interface ReminderRow {
  id: string;
  title: string;
  todo: string;
  participants: string;
  assigneeEmail?: string;
  usersCount?: number;
  priority: ReminderPriority;
  status: ReminderStatus;
  lastUpdated: string;
  createdOn: string;
  /** ISO-ish display date used for calendar: DD-MMM-YYYY or DD-MM-YYYY */
  date: string;
  dueDate?: string;
  paused: boolean;
  recurring: boolean;
  record: string;
}

export const REMINDER_ROWS: ReminderRow[] = [
  {
    id: '1984',
    title: 'Test reminder',
    todo: 'Testing the Reminder',
    participants: 'Rehan Asi',
    assigneeEmail: 'rehan@orville.ae',
    usersCount: 2,
    priority: 'Low',
    status: 'Completed',
    lastUpdated: '02-Jul-2025 04:10:00 AM',
    createdOn: '01-Jul-2025 09:00:00 AM',
    date: '02-Jul-2025',
    dueDate: '02-Jul-2025 04:00:00 AM',
    paused: false,
    recurring: false,
    record: 'Lease - 73778',
  },
  {
    id: '32153',
    title: 'Rent overdue follow-up',
    todo: 'Call tenant and share the overdue rent statement.',
    participants: 'Olivia Green',
    assigneeEmail: 'olivia@orville.ae',
    usersCount: 1,
    priority: 'High',
    status: 'Pending',
    lastUpdated: '20-Aug-2026 02:14 PM',
    createdOn: '12-Aug-2026 10:00 AM',
    date: '27-Aug-2026',
    dueDate: '27-Aug-2026 10:00:00 AM',
    paused: false,
    recurring: true,
    record: 'Lease - 73778',
  },
  {
    id: '32154',
    title: 'Security deposit collection',
    todo: 'Follow up with the tenant on the outstanding security deposit.',
    participants: 'Zainab Hassan',
    assigneeEmail: 'zainab@orville.ae',
    usersCount: 3,
    priority: 'High',
    status: 'Pending',
    lastUpdated: '18-Aug-2026 11:20 AM',
    createdOn: '10-Aug-2026 09:15 AM',
    date: '28-Aug-2026',
    dueDate: '28-Aug-2026 03:00:00 PM',
    paused: false,
    recurring: false,
    record: 'Lease - 73778',
  },
  {
    id: '32155',
    title: 'Lease renewal follow-up',
    todo: 'Confirm renewal terms and send the updated lease pack.',
    participants: 'Zara Malik',
    assigneeEmail: 'zara@orville.ae',
    usersCount: 2,
    priority: 'Medium',
    status: 'Pending',
    lastUpdated: '15-Aug-2026 04:00 PM',
    createdOn: '05-Aug-2026 08:30 AM',
    date: '15-Aug-2026',
    dueDate: '15-Aug-2026 11:00:00 AM',
    paused: false,
    recurring: true,
    record: 'Lease - 44120',
  },
  {
    id: '32156',
    title: 'Inspection schedule reminder',
    todo: 'Confirm unit access with the landlord before inspection.',
    participants: 'Hafeez Hafeez',
    assigneeEmail: 'hafeez@orville.ae',
    usersCount: 1,
    priority: 'Low',
    status: 'Completed',
    lastUpdated: '12-Aug-2026 01:00 PM',
    createdOn: '01-Aug-2026 09:00 AM',
    date: '12-Aug-2026',
    dueDate: '12-Aug-2026 09:00:00 AM',
    paused: false,
    recurring: false,
    record: 'Unit - 401',
  },
  {
    id: '32157',
    title: 'Vendor quotation review',
    todo: 'Review submitted quotations and shortlist two vendors.',
    participants: 'James Wilson',
    assigneeEmail: 'james@orville.ae',
    usersCount: 4,
    priority: 'Medium',
    status: 'Pending',
    lastUpdated: '22-Aug-2026 06:00 PM',
    createdOn: '20-Aug-2026 10:00 AM',
    date: '30-Aug-2026',
    dueDate: '30-Aug-2026 05:00:00 PM',
    paused: false,
    recurring: false,
    record: 'WO - 9921',
  },
  {
    id: '32158',
    title: 'Cheque deposit follow-up',
    todo: 'Confirm bank deposit for PDC batch this week.',
    participants: 'Sara Al Maktoum',
    assigneeEmail: 'sara@orville.ae',
    usersCount: 2,
    priority: 'High',
    status: 'Pending',
    lastUpdated: '25-Aug-2026 08:40 AM',
    createdOn: '24-Aug-2026 07:55 AM',
    date: '26-Aug-2026',
    dueDate: '26-Aug-2026 02:00:00 PM',
    paused: false,
    recurring: false,
    record: 'Finance',
  },
  {
    id: '32159',
    title: 'Community event brief',
    todo: 'Share event checklist with the building team.',
    participants: 'Angela Moore',
    assigneeEmail: 'angela@orville.ae',
    usersCount: 5,
    priority: 'Low',
    status: 'Pending',
    lastUpdated: '19-Aug-2026 03:20 PM',
    createdOn: '18-Aug-2026 12:00 PM',
    date: '05-Sep-2026',
    dueDate: '05-Sep-2026 10:00:00 AM',
    paused: false,
    recurring: false,
    record: 'Community',
  },
  {
    id: '32160',
    title: 'Document expiry check',
    todo: 'Review tenant documents expiring this month.',
    participants: 'Fatima Noor',
    assigneeEmail: 'fatima@orville.ae',
    usersCount: 1,
    priority: 'Medium',
    status: 'Completed',
    lastUpdated: '08-Aug-2026 05:10 PM',
    createdOn: '02-Aug-2026 11:00 AM',
    date: '08-Aug-2026',
    dueDate: '08-Aug-2026 04:00:00 PM',
    paused: false,
    recurring: true,
    record: 'Documents',
  },
  {
    id: '32161',
    title: 'Weekly collections digest',
    todo: 'Send weekly collections summary to managers.',
    participants: 'Ahmed Hassan',
    assigneeEmail: 'ahmed@orville.ae',
    usersCount: 3,
    priority: 'Low',
    status: 'Pending',
    lastUpdated: '21-Aug-2026 09:00 AM',
    createdOn: '21-Aug-2026 08:00 AM',
    date: '29-Aug-2026',
    dueDate: '29-Aug-2026 09:00:00 AM',
    paused: false,
    recurring: true,
    record: 'Collections',
  },
];

export function getReminderDetail(id: string | null): ReminderRow {
  return REMINDER_ROWS.find((row) => row.id === id) || REMINDER_ROWS[0];
}

/** Parse display dates like 27-Aug-2026 or 06-05-2026 into Date (local). */
export function parseReminderDate(value?: string): Date | null {
  if (!value) {
    return null;
  }
  const raw = value.trim().split(/\s+/)[0];
  const months: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const mmm = raw.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (mmm) {
    const month = months[mmm[2]];
    if (month == null) {
      return null;
    }
    return new Date(Number(mmm[3]), month, Number(mmm[1]));
  }
  const dmy = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmy) {
    return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
