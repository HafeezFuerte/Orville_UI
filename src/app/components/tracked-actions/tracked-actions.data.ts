export interface TrackedActionRow {
  id: string;
  eventName: string;
  user: string;
  moduleName: string;
  recordId: string;
  event: string;
  date: string;
}

/** Exactly 10 rows — matches table list cap. */
export const TRACKED_ACTION_ROWS: TrackedActionRow[] = [
  {
    id: 'TA-1',
    eventName: 'Lease Generate Invoice Schedules',
    user: 'Asif Asif',
    moduleName: 'Lease',
    recordId: '147428',
    event: 'generate_invoice_schedules',
    date: '2026-08-26 15:59:27',
  },
  {
    id: 'TA-2',
    eventName: 'Invoice Viewed',
    user: 'Asif Asif',
    moduleName: 'Invoice',
    recordId: '1830006',
    event: 'show',
    date: '2026-08-26 15:48:11',
  },
  {
    id: 'TA-3',
    eventName: 'Lease Updated',
    user: 'Asif Asif',
    moduleName: 'Lease',
    recordId: '147428',
    event: 'update',
    date: '2026-08-26 15:40:03',
  },
  {
    id: 'TA-4',
    eventName: 'Invoice Status Changed',
    user: 'Asif Asif',
    moduleName: 'Invoice',
    recordId: '1830006',
    event: 'dd_status',
    date: '2026-08-26 15:22:49',
  },
  {
    id: 'TA-5',
    eventName: 'Property Viewed',
    user: 'Asif Asif',
    moduleName: 'Property',
    recordId: 'PR-1042',
    event: 'show',
    date: '2026-08-26 14:55:18',
  },
  {
    id: 'TA-6',
    eventName: 'Tenant Created',
    user: 'Asif Asif',
    moduleName: 'Tenant',
    recordId: 'TN-8821',
    event: 'create',
    date: '2026-08-26 14:12:40',
  },
  {
    id: 'TA-7',
    eventName: 'Work Order Updated',
    user: 'Asif Asif',
    moduleName: 'Work Order',
    recordId: 'WO-8891',
    event: 'update',
    date: '2026-08-26 13:38:05',
  },
  {
    id: 'TA-8',
    eventName: 'Broadcast Viewed',
    user: 'Asif Asif',
    moduleName: 'Broadcast',
    recordId: '—',
    event: 'show',
    date: '2026-08-26 12:01:22',
  },
  {
    id: 'TA-9',
    eventName: 'Unit Updated',
    user: 'Asif Asif',
    moduleName: 'Unit',
    recordId: 'UN-2201',
    event: 'update',
    date: '2026-08-26 11:17:56',
  },
  {
    id: 'TA-10',
    eventName: 'Lease Deleted',
    user: 'Asif Asif',
    moduleName: 'Lease',
    recordId: '146100',
    event: 'delete',
    date: '2026-08-26 10:05:33',
  },
];
