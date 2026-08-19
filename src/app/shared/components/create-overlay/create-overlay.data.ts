export interface CreateOverlayItem {
  label: string;
  icon: string;
  route?: string;
}

export interface CreateOverlayCategory {
  title: string;
  items: CreateOverlayItem[];
}

const icon = (name: string) => `assets/images/create/${name}`;

export const CREATE_OVERLAY_CATEGORIES: CreateOverlayCategory[] = [
  {
    title: 'Properties',
    items: [
      { label: 'Property', icon: icon('building.svg'), route: '/add-property' },
      { label: 'Unit', icon: icon('home.svg'), route: '/add-unit' },
      { label: 'Room', icon: icon('door.svg'), route: '/add-room' },
      { label: 'Parking', icon: icon('car-garage.svg') }
    ]
  },
  {
    title: 'Contacts',
    items: [
      { label: 'Tenant', icon: icon('user-square.svg'), route: '/contacts/tenants/add-tenant' },
      { label: 'Landlord', icon: icon('user-square.svg'), route: '/contacts/landlords/add-landlord' },
      { label: 'Vendor', icon: icon('user-square.svg'), route: '/contacts/vendors/add-vendor' }
    ]
  },
  {
    title: 'Task and Maintenance',
    items: [
      { label: 'Request', icon: icon('checkup-list.svg') },
      { label: 'Word Order', icon: icon('wrench.svg'), route: '/facility/work-orders/create' },
      { label: 'Quotation', icon: icon('cash-banknote.svg') },
      { label: 'Preventive Maintenance', icon: icon('calendar-time.svg') },
      { label: 'Inventory Assets', icon: icon('inventory-assets.svg'), route: '/facility/assets/create' },
      { label: 'Inventory Item', icon: icon('inventory-item.svg') },
      { label: 'Purchase Order', icon: icon('purchase-order.svg') }
    ]
  },
  {
    title: 'Leasing',
    items: [
      { label: 'Leasing', icon: icon('file-alert.svg'), route: '/leases/create' }
    ]
  },
  {
    title: 'Contract',
    items: [
      { label: 'Landlord Contract', icon: icon('file-invoice.svg'), route: '/landlord-contracts/create' },
      { label: 'Vendor Contract', icon: icon('file-invoice.svg'), route: '/vendor-contracts/create' }
    ]
  },
  {
    title: 'Accounting',
    items: [
      { label: 'Invoice', icon: icon('file-invoice.svg'), route: '/accounting/invoices/create' },
      { label: 'Expense', icon: icon('file-invoice.svg'), route: '/accounting/expenses/create' },
      { label: 'Credit Note', icon: icon('file-invoice.svg'), route: '/accounting/credit-notes' },
      { label: 'Account', icon: icon('file-invoice.svg'), route: '/accounting/chart-of-accounts/create' }
    ]
  },
  {
    title: 'Reminder',
    items: [
      { label: 'Reminder', icon: icon('calendar-days.svg') }
    ]
  },
  {
    title: 'Community',
    items: [
      { label: 'Event', icon: icon('calendar-event.svg') },
      { label: 'Promotion', icon: icon('speakerphone.svg') },
      { label: 'Rules / Guide', icon: icon('rules-guide.svg') }
    ]
  },
  {
    title: 'Booking',
    items: [
      { label: 'Space', icon: icon('space.svg'), route: '/bookings/spaces/new' },
      { label: 'Reservation', icon: icon('calendar-event.svg'), route: '/bookings/reservations/new' }
    ]
  },
  {
    title: 'Broadcast',
    items: [
      { label: 'Broadcasts', icon: icon('speakerphone.svg'), route: '/broadcasts/create' }
    ]
  },
  {
    title: 'Helpdesk',
    items: [
      { label: 'Tickets', icon: icon('tickets.svg') }
    ]
  },
  {
    title: 'Visitors',
    items: [
      { label: 'Visitors', icon: icon('user-square.svg') }
    ]
  },
  {
    title: 'Litigations',
    items: [
      { label: 'Litigation', icon: icon('gavel.svg') }
    ]
  },
  {
    title: 'Inspection',
    items: [
      { label: 'Inspection', icon: icon('inspection.svg') }
    ]
  }
];
