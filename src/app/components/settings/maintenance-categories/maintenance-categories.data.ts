export type MaintenanceCategoryIcon = 'wrench' | 'door' | 'plug' | 'broom' | 'pipe';

export interface MaintenanceCategoryColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface MaintenanceCategory {
  id: number;
  name: string;
  isGlobal: boolean;
  categoryType: string;
  workOrders: number;
  avgCompletionTime: string | null;
  icon: MaintenanceCategoryIcon;
  parentId: number | null;
  helpText: string;
  avgHours: string;
  avgMinutes: string;
}

export interface MaintenanceCategoryDraft {
  name: string;
  categoryType: string;
  parentId: number | null;
  icon: MaintenanceCategoryIcon | '';
  helpText: string;
  avgHours: string;
  avgMinutes: string;
}

export const MAINTENANCE_CATEGORY_TYPES = ['Maintenance', 'Inspection', 'Preventive'] as const;

export const MAINTENANCE_CATEGORY_ICONS: {
  value: MaintenanceCategoryIcon;
  label: string;
  src: string;
}[] = [
  {
    value: 'wrench',
    label: 'Wrench',
    src: './assets/images/settings/screwdriver-wrench.svg',
  },
  {
    value: 'door',
    label: 'Door',
    src: './assets/images/settings/home.svg',
  },
  {
    value: 'plug',
    label: 'Electrical',
    src: './assets/images/settings/settings-gear.svg',
  },
  {
    value: 'broom',
    label: 'Cleaning',
    src: './assets/images/settings/list.svg',
  },
  {
    value: 'pipe',
    label: 'Plumbing',
    src: './assets/images/settings/cash-banknote.svg',
  },
];

export const EMPTY_MAINTENANCE_CATEGORY: MaintenanceCategoryDraft = {
  name: '',
  categoryType: 'Maintenance',
  parentId: null,
  icon: '',
  helpText: '',
  avgHours: '00',
  avgMinutes: '00',
};

export const DEFAULT_MAINTENANCE_CATEGORIES: MaintenanceCategory[] = [
  {
    id: 1,
    name: 'Air Conditioner',
    isGlobal: true,
    categoryType: 'Maintenance',
    workOrders: 164,
    avgCompletionTime: null,
    icon: 'wrench',
    parentId: null,
    helpText: '',
    avgHours: '00',
    avgMinutes: '00',
  },
  {
    id: 2,
    name: 'Cleaning Issues',
    isGlobal: false,
    categoryType: 'Maintenance',
    workOrders: 72,
    avgCompletionTime: '16:00 Hours',
    icon: 'wrench',
    parentId: null,
    helpText: '',
    avgHours: '16',
    avgMinutes: '00',
  },
  {
    id: 3,
    name: 'Doors & Locks',
    isGlobal: true,
    categoryType: 'Maintenance',
    workOrders: 103,
    avgCompletionTime: null,
    icon: 'door',
    parentId: null,
    helpText: '',
    avgHours: '00',
    avgMinutes: '00',
  },
  {
    id: 4,
    name: 'Electrical',
    isGlobal: true,
    categoryType: 'Maintenance',
    workOrders: 309,
    avgCompletionTime: null,
    icon: 'plug',
    parentId: null,
    helpText: '',
    avgHours: '00',
    avgMinutes: '00',
  },
  {
    id: 5,
    name: 'Joinery',
    isGlobal: true,
    categoryType: 'Maintenance',
    workOrders: 63,
    avgCompletionTime: null,
    icon: 'wrench',
    parentId: null,
    helpText: '',
    avgHours: '00',
    avgMinutes: '00',
  },
  {
    id: 6,
    name: 'Plumbing',
    isGlobal: true,
    categoryType: 'Maintenance',
    workOrders: 158,
    avgCompletionTime: null,
    icon: 'wrench',
    parentId: null,
    helpText: '',
    avgHours: '00',
    avgMinutes: '00',
  },
];
