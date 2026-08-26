export interface TicketDepartmentOption {
  id: string;
  name: string;
}

export interface TicketCategoryColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface TicketCategory {
  id: number;
  name: string;
  isGlobal: boolean;
  ticketCount: number;
  departmentId: string;
  parentId: number | null;
}

export interface TicketCategoryDraft {
  name: string;
  parentId: number | null;
  departmentId: string;
}

export interface TicketsSettingsModel {
  avgResponseHours: number;
  maxPhotos: number;
  unavailabilityMessage: string;
  mandatoryFeedbackForTenants: boolean;
  autoCreateWorkOrder: boolean;
}

export const TICKET_DEPARTMENTS: TicketDepartmentOption[] = [
  { id: '', name: 'No default department' },
  { id: 'facility', name: 'Facility Group' },
  { id: 'lease', name: 'Lease Group' },
  { id: 'finance', name: 'Finance Group' },
  { id: 'community', name: 'Community Group' },
];

export const EMPTY_TICKET_CATEGORY: TicketCategoryDraft = {
  name: '',
  parentId: null,
  departmentId: '',
};

export const DEFAULT_TICKETS_SETTINGS: TicketsSettingsModel = {
  avgResponseHours: 0,
  maxPhotos: 5,
  unavailabilityMessage: "We'll get back to you during business hours...",
  mandatoryFeedbackForTenants: true,
  autoCreateWorkOrder: false,
};

export const DEFAULT_TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: 382,
    name: 'Amenities Issue',
    isGlobal: false,
    ticketCount: 48,
    departmentId: 'facility',
    parentId: null,
  },
  {
    id: 385,
    name: 'Lease and Policy Questions',
    isGlobal: false,
    ticketCount: 12,
    departmentId: 'lease',
    parentId: null,
  },
  {
    id: 1,
    name: 'Maintenance and Repairs',
    isGlobal: true,
    ticketCount: 1042,
    departmentId: 'facility',
    parentId: null,
  },
  {
    id: 753,
    name: 'Noise Complaints',
    isGlobal: false,
    ticketCount: 27,
    departmentId: 'community',
    parentId: null,
  },
  {
    id: 760,
    name: 'Billing Inquiry',
    isGlobal: false,
    ticketCount: 19,
    departmentId: 'finance',
    parentId: null,
  },
];
