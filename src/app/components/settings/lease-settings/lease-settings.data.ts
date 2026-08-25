export type ChecklistKind = 'moveOut' | 'moveIn' | 'renewal';

export interface LeaseChecklistItem {
  id: number;
  name: string;
}

export interface LeaseFixedPayment {
  id: number;
  account: string;
  amount: string;
  type: string;
  description: string;
}

export interface LeaseTerm {
  id: number;
  title: string;
}

export interface LeaseAccountOption {
  id: string;
  name: string;
}

export interface LeaseToggleDef {
  key: keyof LeaseToggleState;
  label: string;
}

export interface LeaseToggleState {
  shortTermLeasePriority: boolean;
  includeCommonArea: boolean;
  generateCommissionInvoice: boolean;
  autoCalculateTotalRent: boolean;
  preventEndingWithPendingDues: boolean;
  transferUnusedPayments: boolean;
  allowOverlappingLeases: boolean;
  verifyTenant: boolean;
  allowEarlyLeaseRenewal: boolean;
  allowRenewalWithPendingPayments: boolean;
  autoGenerateChequeDetails: boolean;
  useTotalRentForShortLeases: boolean;
  alignInvoiceDueDatesWithLeaseStart: boolean;
  showOnlyVacantUnits: boolean;
  showUnitOccupancyForFutureLeases: boolean;
  enableAdvancePayment: boolean;
}

export interface LeaseSettingsModel extends LeaseToggleState {
  ccManagersOnEmail: boolean;
  residentialRenewalNotice: string;
  commercialRenewalNotice: string;
  earlyTerminationAccountId: string;
  earlyTerminationAmount: string;
  scheduleDueDate: string;
  chequeDueDate: string;
  moneyHeldBy: string;
  moveOutChecklists: LeaseChecklistItem[];
  moveInChecklists: LeaseChecklistItem[];
  renewalChecklists: LeaseChecklistItem[];
  fixedPayments: LeaseFixedPayment[];
  leaseTerms: LeaseTerm[];
}

export const LEASE_PENALTY_ACCOUNTS: LeaseAccountOption[] = [
  { id: 'early-lease-penalty', name: 'Early Lease Penalty' },
  { id: 'penalty-income', name: 'Penalty Income' },
  { id: 'collections', name: 'Collections Account' },
];

export const FIXED_PAYMENT_ACCOUNTS: LeaseAccountOption[] = [
  { id: 'rent', name: 'Rent' },
  { id: 'service-charge', name: 'Service Charge' },
  { id: 'security-deposit', name: 'Security Deposit' },
  { id: 'maintenance', name: 'Maintenance' },
  { id: 'other', name: 'Other' },
];

export const MONEY_HELD_OPTIONS = ['Company', 'Landlord', 'Tenant'];

export const FIXED_PAYMENT_TYPES = ['Fixed', 'Percentage', 'One-time'];

export const DAY_OF_MONTH_OPTIONS: string[] = Array.from({ length: 28 }, (_, i) => String(i + 1));

export const LEASE_TOGGLES: LeaseToggleDef[] = [
  { key: 'shortTermLeasePriority', label: 'Short Term Lease Priority' },
  { key: 'includeCommonArea', label: 'Include Common Area in Lease Area Calculation' },
  { key: 'generateCommissionInvoice', label: 'Generate Commission Invoice on Lease Activation' },
  { key: 'autoCalculateTotalRent', label: 'Auto Calculate The Total Rent' },
  { key: 'preventEndingWithPendingDues', label: 'Prevent Ending Leases with Pending Dues' },
  { key: 'transferUnusedPayments', label: 'Transfer Unused Payments to New Lease on Renewal' },
  { key: 'allowOverlappingLeases', label: 'Allow Overlapping Leases' },
  { key: 'verifyTenant', label: 'Verify Tenant Before Activating Lease' },
  { key: 'allowEarlyLeaseRenewal', label: 'Allow Early Lease Renewal' },
  { key: 'allowRenewalWithPendingPayments', label: 'Allow Renewal with Pending Payments' },
  { key: 'autoGenerateChequeDetails', label: 'Auto-generate Cheque Details' },
  { key: 'useTotalRentForShortLeases', label: 'Use Total Rent for Short Term Leases' },
  { key: 'alignInvoiceDueDatesWithLeaseStart', label: 'Align Invoice Due Dates with Lease Start Date' },
  { key: 'showOnlyVacantUnits', label: 'Show Only Vacant Units When Creating Lease' },
  { key: 'showUnitOccupancyForFutureLeases', label: 'Show Unit Occupancy for Future Leases' },
  { key: 'enableAdvancePayment', label: 'Enable Advance Payment' },
];

export const DEFAULT_LEASE_SETTINGS: LeaseSettingsModel = {
  ccManagersOnEmail: false,
  residentialRenewalNotice: '30-60-90-120',
  commercialRenewalNotice: '30-60-90-120',
  earlyTerminationAccountId: 'early-lease-penalty',
  earlyTerminationAmount: '0',
  scheduleDueDate: '',
  chequeDueDate: '',
  moneyHeldBy: 'Company',
  moveOutChecklists: [{ id: 1, name: 'MOVE OUT' }],
  moveInChecklists: [],
  renewalChecklists: [],
  fixedPayments: [],
  leaseTerms: [],
  shortTermLeasePriority: true,
  includeCommonArea: false,
  generateCommissionInvoice: false,
  autoCalculateTotalRent: true,
  preventEndingWithPendingDues: false,
  transferUnusedPayments: false,
  allowOverlappingLeases: false,
  verifyTenant: false,
  allowEarlyLeaseRenewal: true,
  allowRenewalWithPendingPayments: true,
  autoGenerateChequeDetails: false,
  useTotalRentForShortLeases: false,
  alignInvoiceDueDatesWithLeaseStart: true,
  showOnlyVacantUnits: false,
  showUnitOccupancyForFutureLeases: true,
  enableAdvancePayment: true,
};

export const MONEY_HELD_HELP =
  'Select who holds security deposits and other money collected on leases. This default is used when creating new leases and can still be overridden per lease.';
