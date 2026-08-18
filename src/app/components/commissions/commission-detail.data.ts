import { COMMISSION_ROWS } from './commissions.data';

export type CommissionViewMode = 'Company' | 'Percentage';

export interface CommissionAllocationRow {
  id: string;
  to: string;
  name: string;
  amount: string;
}

export interface CommissionDetail {
  id: string;
  heading: string;
  from: string;
  type: string;
  percentage: string;
  totalAmount: string;
  fixed: string;
  balance: string;
  commissionable: string;
  companyRows: CommissionAllocationRow[];
  agentRows: CommissionAllocationRow[];
}

const DEFAULT_ALLOCATIONS: CommissionAllocationRow[] = [
  { id: '3215', to: 'Agent', name: 'Safvan M', amount: 'AED 140.00' },
  { id: '3216', to: 'Agent', name: 'Safvan M', amount: 'AED 140.00' }
];

export function getCommissionDetail(id: string | null): CommissionDetail {
  const row = COMMISSION_ROWS.find((item) => item.id === id);
  const type = row?.type || 'Percentage';

  return {
    id: row?.id || id || '31658',
    heading: `Commission - ${type}`,
    from: row?.id === 'C002' ? 'Abdullah Al Shakib' : (row?.from || 'Abdullah Al Shakib'),
    type: 'General',
    percentage: 'Fixed',
    totalAmount: 'Fix',
    fixed: 'Renewed',
    balance: '06-06-2026',
    commissionable: row?.commissionable || 'Lease - 73778',
    companyRows: DEFAULT_ALLOCATIONS.map((item) => ({ ...item })),
    agentRows: DEFAULT_ALLOCATIONS.map((item) => ({ ...item }))
  };
}
