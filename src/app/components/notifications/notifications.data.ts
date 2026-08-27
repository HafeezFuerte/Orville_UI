export type NotificationTypeId =
  | 'all'
  | 'chat'
  | 'work-orders'
  | 'tickets'
  | 'payments'
  | 'tenants'
  | 'properties'
  | 'units'
  | 'leases'
  | 'landlords'
  | 'vendors'
  | 'reminders'
  | 'system';

export interface NotificationType {
  id: NotificationTypeId;
  label: string;
}

export interface AppNotification {
  id: string;
  type: Exclude<NotificationTypeId, 'all'>;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATION_TYPES: NotificationType[] = [
  { id: 'all', label: 'All' },
  { id: 'chat', label: 'Chat' },
  { id: 'work-orders', label: 'Work Orders' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'payments', label: 'Payments' },
  { id: 'tenants', label: 'Tenants' },
  { id: 'properties', label: 'Properties' },
  { id: 'units', label: 'Units' },
  { id: 'leases', label: 'Leases' },
  { id: 'landlords', label: 'Landlords' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'reminders', label: 'Reminders' },
  { id: 'system', label: 'System' },
];

export const NOTIFICATION_ROWS: AppNotification[] = [
  {
    id: 'n1',
    type: 'tenants',
    title: 'Tenant Added',
    body: 'A new tenant was added by Janelyn Bandalas',
    time: '7 minutes ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'units',
    title: 'New Unit Added',
    body: 'A new unit Apartment 301-PR-6 has been added.',
    time: '1 day ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'tenants',
    title: 'Tenant Added',
    body: 'A new tenant was added by Janelyn Bandalas',
    time: '1 day ago',
    unread: true,
  },
  {
    id: 'n4',
    type: 'tenants',
    title: 'Tenant Added',
    body: 'A new tenant was added by Janelyn Bandalas',
    time: '1 day ago',
    unread: true,
  },
  {
    id: 'n5',
    type: 'tenants',
    title: 'Tenant Added',
    body: 'A new tenant was added by Janelyn Bandalas',
    time: '1 day ago',
    unread: true,
  },
  {
    id: 'n6',
    type: 'properties',
    title: 'Property Updated',
    body: 'Marina Heights Tower details were updated by Hafeez Hafeez',
    time: '2 days ago',
    unread: true,
  },
  {
    id: 'n7',
    type: 'work-orders',
    title: 'Work Order Assigned',
    body: 'WO-8891 was assigned to Support Technician',
    time: '2 days ago',
    unread: true,
  },
  {
    id: 'n8',
    type: 'payments',
    title: 'Payment Received',
    body: 'Payment of AED 4,500.00 was received for Invoice INV-20418',
    time: '3 days ago',
    unread: false,
  },
  {
    id: 'n9',
    type: 'leases',
    title: 'Lease Approved',
    body: 'Lease L-31942 has been approved',
    time: '3 days ago',
    unread: true,
  },
  {
    id: 'n10',
    type: 'tickets',
    title: 'Ticket Escalated',
    body: 'Ticket TK-4412 was escalated to Priority High',
    time: '4 days ago',
    unread: true,
  },
  {
    id: 'n11',
    type: 'landlords',
    title: 'Landlord Added',
    body: 'A new landlord was added by Operations',
    time: '4 days ago',
    unread: false,
  },
  {
    id: 'n12',
    type: 'chat',
    title: 'New Chat Message',
    body: 'You received a new message from Sara Ibrahim',
    time: '5 days ago',
    unread: true,
  },
  {
    id: 'n13',
    type: 'reminders',
    title: 'Reminder Due',
    body: 'Reminder “Follow up on unit inspection” is due today',
    time: '5 days ago',
    unread: true,
  },
  {
    id: 'n14',
    type: 'vendors',
    title: 'Vendor Contract Expiring',
    body: 'Vendor contract VC-118 expires in 14 days',
    time: '6 days ago',
    unread: false,
  },
  {
    id: 'n15',
    type: 'system',
    title: 'Import Completed',
    body: 'Rental import #68 finished with status Fully Imported',
    time: '1 week ago',
    unread: true,
  },
  {
    id: 'n16',
    type: 'units',
    title: 'New Unit Added',
    body: 'A new unit Apartment 201-PR-2 has been added.',
    time: '1 week ago',
    unread: true,
  },
  {
    id: 'n17',
    type: 'tenants',
    title: 'Tenant Added',
    body: 'A new tenant was added by Operations Team',
    time: '1 week ago',
    unread: true,
  },
  {
    id: 'n18',
    type: 'payments',
    title: 'Payment Overdue',
    body: 'Invoice INV-20391 is overdue by 7 days',
    time: '1 week ago',
    unread: true,
  },
];
