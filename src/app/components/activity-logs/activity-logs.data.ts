export type ActivityEvent = 'Create' | 'Update' | 'Delete';

export interface ActivityLogRow {
  id: string;
  event: ActivityEvent;
  module: string;
  moduleRef: string;
  title: string;
  user: string;
  browserIp: string;
  date: string;
  changes: string;
  moreChanges?: number;
}

export const ACTIVITY_LOG_ROWS: ActivityLogRow[] = [
  {
    id: 'AL-1',
    event: 'Update',
    module: 'Lease',
    moduleRef: '147428',
    title: 'Data Change',
    user: 'SA #54378',
    browserIp: '—',
    date: '2026-08-26 15:12:04',
    changes: 'Status: Unpaid → Paid',
  },
  {
    id: 'AL-2',
    event: 'Update',
    module: 'Lease',
    moduleRef: '147428',
    title: 'Data Change',
    user: 'SA #54378',
    browserIp: '—',
    date: '2026-08-26 14:58:21',
    changes: 'Annual rent cents: 0.00 → 504000.00',
    moreChanges: 1,
  },
  {
    id: 'AL-3',
    event: 'Create',
    module: 'Invoice',
    moduleRef: '1830006',
    title: 'Data Change',
    user: 'SA #54378',
    browserIp: '—',
    date: '2026-08-26 13:40:11',
    changes: 'Status: Draft → Active',
  },
  {
    id: 'AL-4',
    event: 'Update',
    module: 'Invoice',
    moduleRef: '1830006',
    title: 'Data Change',
    user: 'SA #51201',
    browserIp: '—',
    date: '2026-08-26 12:05:33',
    changes: 'Amount: 1200.00 → 1450.00',
  },
  {
    id: 'AL-5',
    event: 'Update',
    module: 'Property',
    moduleRef: 'PR-1042',
    title: 'Data Change',
    user: 'SA #49811',
    browserIp: '—',
    date: '2026-08-25 18:22:09',
    changes: 'Status: Active → Draft',
    moreChanges: 5,
  },
  {
    id: 'AL-6',
    event: 'Create',
    module: 'Tenant',
    moduleRef: 'TN-8821',
    title: 'Data Change',
    user: 'SA #54378',
    browserIp: '—',
    date: '2026-08-25 16:11:47',
    changes: 'Created tenant record',
  },
  {
    id: 'AL-7',
    event: 'Update',
    module: 'Work Order',
    moduleRef: 'WO-8891',
    title: 'Data Change',
    user: 'SA #52044',
    browserIp: '10.0.12.44',
    date: '2026-08-25 11:03:18',
    changes: 'Status: Open → In Progress',
  },
  {
    id: 'AL-8',
    event: 'Update',
    module: 'Lease',
    moduleRef: '146902',
    title: 'Data Change',
    user: 'SA #54378',
    browserIp: '—',
    date: '2026-08-24 09:45:02',
    changes: 'End date: 2026-01-01 → 2027-01-01',
    moreChanges: 2,
  },
  {
    id: 'AL-9',
    event: 'Create',
    module: 'Broadcast',
    moduleRef: 'BC-441',
    title: 'Data Change',
    user: 'SA #50112',
    browserIp: '—',
    date: '2026-08-24 08:20:55',
    changes: 'Created broadcast',
  },
  {
    id: 'AL-10',
    event: 'Update',
    module: 'Unit',
    moduleRef: 'UN-2201',
    title: 'Data Change',
    user: 'SA #54378',
    browserIp: '—',
    date: '2026-08-23 17:30:40',
    changes: 'Status: Vacant → Occupied',
  },
];
