export type CommissionKind = 'Tenant' | 'Landlord';

export interface CommissionRow {
  id: string;
  kind: CommissionKind;
  from: string;
  type: string;
  commissionable: string;
  amount: string;
  toCompany: string;
  toAgent: string;
  fixedAmount: string;
}

export const COMMISSION_ROWS: CommissionRow[] = [
  {
    id: 'C001',
    kind: 'Landlord',
    from: 'Orville Real Estate',
    type: 'Percentage',
    commissionable: 'Contract - 12375',
    amount: 'AED 1500.00',
    toCompany: 'AED 1500.00',
    toAgent: 'AED 1500.00',
    fixedAmount: 'AED 1500.00'
  },
  {
    id: 'C002',
    kind: 'Landlord',
    from: 'Company',
    type: 'Percentage',
    commissionable: 'Lease - 73778',
    amount: 'AED 1500.00',
    toCompany: 'AED 1500.00',
    toAgent: 'AED 1500.00',
    fixedAmount: 'AED 1500.00'
  },
  {
    id: 'C003',
    kind: 'Tenant',
    from: 'Orville Real Estate',
    type: 'Percentage',
    commissionable: 'Lease - 44120',
    amount: 'AED 1500.00',
    toCompany: 'AED 1500.00',
    toAgent: 'AED 1500.00',
    fixedAmount: 'AED 1500.00'
  },
  {
    id: 'C004',
    kind: 'Tenant',
    from: 'Company',
    type: 'Fixed',
    commissionable: 'Contract - 88210',
    amount: 'AED 1500.00',
    toCompany: 'AED 1500.00',
    toAgent: 'AED 1500.00',
    fixedAmount: 'AED 1500.00'
  }
];
