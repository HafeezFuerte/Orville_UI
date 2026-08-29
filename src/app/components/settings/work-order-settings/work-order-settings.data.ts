export interface WorkOrderUserOption {
  id: string;
  name: string;
}

export interface WorkOrderOptionDef {
  key: keyof Pick<
    WorkOrderSettingsModel,
    'enableRoundRobinWorkOrders' | 'enableRoundRobinTickets' | 'allowVendorTenantCommunication'
  >;
  label: string;
  description: string;
}

export interface WorkOrderSettingsModel {
  participantIds: string[];
  enableRoundRobinWorkOrders: boolean;
  enableRoundRobinTickets: boolean;
  allowVendorTenantCommunication: boolean;
  noticeDays: string;
}

export const WORK_ORDER_USERS: WorkOrderUserOption[] = [
  { id: 'u1', name: 'Ahmed Hassan' },
  { id: 'u2', name: 'Sara Al Mazrouei' },
  { id: 'u3', name: 'Omar Khalid' },
  { id: 'u4', name: 'Fatima Noor' },
  { id: 'u5', name: 'James Carter' },
];

export const WORK_ORDER_OPTIONS: WorkOrderOptionDef[] = [
  {
    key: 'enableRoundRobinWorkOrders',
    label: 'Enable Round Robin for Work Orders',
    description:
      'If enabled, the Round Robin method will be used to evenly distribute work orders among the team members listed above.',
  },
  {
    key: 'enableRoundRobinTickets',
    label: 'Enable Round Robin for Tickets',
    description:
      'If enabled, the Round Robin method will be used to evenly distribute tickets among the team members listed above.',
  },
  {
    key: 'allowVendorTenantCommunication',
    label: 'Allow Vendor Tenant Communication',
    description:
      'If enabled, vendors and tenants will be able to send messages directly to each other within the platform.',
  },
];

export const DEFAULT_WORK_ORDER_SETTINGS: WorkOrderSettingsModel = {
  participantIds: [],
  enableRoundRobinWorkOrders: false,
  enableRoundRobinTickets: false,
  allowVendorTenantCommunication: false,
  noticeDays: '',
};
