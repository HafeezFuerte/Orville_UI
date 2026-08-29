export type EmailLogTab = 'all' | 'failed';

export interface EmailLogRow {
  id: string;
  date: string;
  subject: string;
  from: string;
  to: string;
  status: 'Sent' | 'Failed';
}

export const EMAIL_LOG_ROWS: EmailLogRow[] = [
  {
    id: 'EL-1001',
    date: '26-Aug-2026 03:26 PM',
    subject: 'Lease has been Approved',
    from: 'rental@orvillerealestate.com',
    to: 'aqib@orvillerealestate.com',
    status: 'Sent',
  },
  {
    id: 'EL-1002',
    date: '26-Aug-2026 02:14 PM',
    subject: 'New Lease Approval Request',
    from: 'rental@orvillerealestate.com',
    to: 'asif@orvillerealestate.com',
    status: 'Sent',
  },
  {
    id: 'EL-1003',
    date: '26-Aug-2026 01:05 PM',
    subject: 'Invoice INV-20418 has been generated',
    from: 'billing@orvillerealestate.com',
    to: 'tenant.ops@orvillerealestate.com',
    status: 'Sent',
  },
  {
    id: 'EL-1004',
    date: '25-Aug-2026 06:42 PM',
    subject: 'Work Order WO-8891 assigned',
    from: 'facility@orvillerealestate.com',
    to: 'tech.desk@orvillerealestate.com',
    status: 'Sent',
  },
  {
    id: 'EL-1005',
    date: '25-Aug-2026 04:18 PM',
    subject: 'Password reset requested',
    from: 'noreply@orvillerealestate.com',
    to: 'hafeez@orvillerealestate.com',
    status: 'Sent',
  },
  {
    id: 'EL-1006',
    date: '25-Aug-2026 11:30 AM',
    subject: 'Lease renewal reminder',
    from: 'rental@orvillerealestate.com',
    to: 'landlord.care@orvillerealestate.com',
    status: 'Failed',
  },
  {
    id: 'EL-1007',
    date: '24-Aug-2026 09:12 AM',
    subject: 'Broadcast: Community event this weekend',
    from: 'community@orvillerealestate.com',
    to: 'all-tenants@orvillerealestate.com',
    status: 'Sent',
  },
  {
    id: 'EL-1008',
    date: '24-Aug-2026 08:01 AM',
    subject: 'Payment receipt for INV-20391',
    from: 'billing@orvillerealestate.com',
    to: 'finance@orvillerealestate.com',
    status: 'Sent',
  },
  {
    id: 'EL-1009',
    date: '23-Aug-2026 05:55 PM',
    subject: 'Visitor check-in confirmation',
    from: 'guests@orvillerealestate.com',
    to: 'security@orvillerealestate.com',
    status: 'Sent',
  },
  {
    id: 'EL-1010',
    date: '23-Aug-2026 03:20 PM',
    subject: 'Failed delivery: Lease document share',
    from: 'docs@orvillerealestate.com',
    to: 'vendor.mail@example.com',
    status: 'Failed',
  },
];
