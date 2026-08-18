export interface ReportKpi {
  label: string;
  value: string;
  sub: string;
}

export interface ReportLine {
  label: string;
  amount: string;
  negative?: boolean;
}

export interface ReportGroup {
  title?: string;
  empty?: string;
  lines: ReportLine[];
  totalLabel?: string;
  total?: string;
}

export interface ReportSection {
  title: string;
  hint?: string;
  total?: string;
  collapsible?: boolean;
  open: boolean;
  groups: ReportGroup[];
}

export type ReportLayout = 'statement' | 'table' | 'simple' | 'grouped' | 'journal' | 'annual';
export type ReportTypePill = 'Asset' | 'Equity' | 'Expense' | 'Liability' | 'Income';

export interface TrialBalanceRow {
  account: string;
  type: ReportTypePill;
  debit: string;
  credit: string;
  balance: string;
}

export interface SimpleBalanceRow {
  account: string;
  balance: string;
}

export interface LedgerRow {
  account: string;
  debit: string;
  credit: string;
  balance: string;
}

export interface LedgerGroup {
  title: string;
  countLabel: string;
  debit: string;
  credit: string;
  open: boolean;
  rows: LedgerRow[];
}

export interface JournalLine {
  account: string;
  date: string;
  credit: string;
  debit: string;
}

export interface JournalBlock {
  title: string;
  lines: JournalLine[];
}

export interface AnnualRow {
  account: string;
  total: string;
  months: string[];
}

export interface AnnualSection {
  title: string;
  rows: AnnualRow[];
  totalLabel: string;
  totals: string[];
}

export interface ReportViewModel {
  id: string;
  title: string;
  crumb: string;
  company: string;
  period: string;
  fromDate: string;
  toDate: string;
  kpis: ReportKpi[];
  statementTitle: string;
  netLabel: string;
  netValue: string;
  sections: ReportSection[];
  layout?: ReportLayout;
  showExport?: boolean;
  tableRows?: TrialBalanceRow[];
  simpleRows?: SimpleBalanceRow[];
  simpleTotalLabel?: string;
  simpleLeftLabel?: string;
  simpleRightLabel?: string;
  hideDateFilter?: boolean;
  yearFilter?: boolean;
  year?: string;
  yearOptions?: string[];
  ledgerGroups?: LedgerGroup[];
  journalBlocks?: JournalBlock[];
  annualMonths?: string[];
  annualSections?: AnnualSection[];
}

export const REPORT_VIEWS: Record<string, ReportViewModel> = {
  'profit-loss': {
    id: 'profit-loss',
    title: 'Income Statement',
    crumb: 'Income Statement',
    company: 'Orville Real Estate LLC',
    period: '01 Jul 2026 - 10 Jul 2026',
    fromDate: '01/07/2026',
    toDate: '10/07/2026',
    kpis: [
      { label: 'Total income', value: 'AED 812,122.00', sub: 'Rental income for selected period' },
      { label: 'Total expenses', value: 'AED 0.00', sub: 'No expenses recorded' },
      { label: 'Net operating income', value: 'AED 812,122.00', sub: '100% operating margin' }
    ],
    statementTitle: 'Income statement',
    netLabel: 'Net operating income',
    netValue: 'AED 812,122.00',
    sections: [
      {
        title: 'Income',
        hint: 'Revenue',
        open: true,
        groups: [
          {
            lines: [{ label: 'Rental Income', amount: 'AED 812,122.00' }],
            totalLabel: 'Total Income',
            total: 'AED 812,122.00'
          }
        ]
      },
      {
        title: 'Expenses',
        hint: 'Operating costs',
        open: true,
        groups: [
          {
            lines: [],
            empty: 'No expense transactions were recorded for this period.',
            totalLabel: 'Total expenses',
            total: 'AED 0.00'
          }
        ]
      }
    ]
  },
  'balance-sheet': {
    id: 'balance-sheet',
    title: 'Balance sheet',
    crumb: 'Balance sheet',
    company: 'Orville Real Estate LLC',
    period: '01 Jul 2026 – 10 Jul 2026',
    fromDate: '01/07/2026',
    toDate: '10/07/2026',
    kpis: [
      { label: 'Total assets', value: 'AED 882,676.00', sub: 'Cash, receivables and current assets' },
      { label: 'Total liabilities', value: 'AED 70,870.00', sub: 'Security deposits liability' },
      { label: 'Net assets', value: 'AED 811,806.00', sub: 'Assets less liabilities' }
    ],
    statementTitle: 'Balance sheet',
    netLabel: 'Assets less liabilities and equity',
    netValue: 'AED 811,806.00',
    sections: [
      {
        title: 'Assets',
        total: 'AED 882,676.00',
        collapsible: true,
        open: true,
        groups: [
          {
            title: 'Cash & Bank',
            lines: [
              { label: 'Hasibur Rashid Mah', amount: 'AED 12,400.00' },
              { label: 'Asad Ahmed', amount: 'AED -6,850.00', negative: true },
              { label: 'Cash - Checking Account', amount: 'AED 48,220.00' }
            ]
          },
          {
            title: 'Current Assets',
            lines: [
              { label: 'Accounts Receivable - Rent', amount: 'AED -2,140.00', negative: true },
              { label: 'Security Deposits Receivable', amount: 'AED 70,870.00' },
              { label: 'Total Income', amount: 'AED 760,176.00' }
            ]
          }
        ]
      },
      {
        title: 'Liabilities',
        total: 'AED 70,870.00',
        collapsible: true,
        open: true,
        groups: [
          {
            title: 'Overhead Expense',
            lines: [{ label: 'Security Deposits Liability', amount: 'AED 70,870.00' }],
            totalLabel: 'Total liabilities',
            total: 'AED 70,870.00'
          }
        ]
      },
      {
        title: 'Equity',
        total: 'AED 0.00',
        collapsible: true,
        open: true,
        groups: [
          {
            title: 'Total equity',
            lines: [],
            totalLabel: 'Total equity',
            total: 'AED 0.00'
          }
        ]
      }
    ]
  },
  'cash-flow': {
    id: 'cash-flow',
    title: 'Cash Flow Statement',
    crumb: 'Cash Flow Statement',
    company: 'Orville Real Estate LLC',
    period: '01 Jul 2024 – 10 Jul 2024',
    fromDate: '01/07/2024',
    toDate: '10/07/2024',
    kpis: [
      { label: 'Operating cash flow', value: 'AED 811,806.00', sub: 'Income less operating expenses' },
      { label: 'Investing cash flow', value: 'AED 0.00', sub: 'No investing activity' },
      { label: 'Financing cash flow', value: 'AED 70,570.00', sub: 'Security deposits liability' },
      { label: 'Net increase in cash', value: 'AED 882,376.00', sub: 'Total change for selected period' }
    ],
    statementTitle: 'Cash Flow Statement',
    netLabel: 'Net Increase in Cash',
    netValue: 'AED 882,376.00',
    sections: [
      {
        title: 'Operating activities',
        total: 'AED 811,806.00',
        collapsible: true,
        open: true,
        groups: [
          {
            title: 'Income',
            lines: [
              { label: 'Rental Income', amount: 'AED 812,122.00' },
              { label: 'Management Fees', amount: 'AED 4,684.00' }
            ],
            totalLabel: 'Total Income',
            total: 'AED 816,806.00'
          },
          {
            title: 'Expenses',
            lines: [
              { label: 'Advertising', amount: 'AED 3,200.00' },
              { label: 'Depreciation', amount: 'AED 1,800.00' }
            ],
            totalLabel: 'Total Expenses',
            total: 'AED 5,000.00'
          }
        ]
      },
      {
        title: 'Investing activities',
        total: 'AED 0.00',
        collapsible: true,
        open: true,
        groups: [
          {
            title: 'Investments',
            lines: [{ label: 'Investments', amount: 'AED 0.00' }],
            totalLabel: 'Total equity',
            total: 'AED 0.00'
          }
        ]
      },
      {
        title: 'Financing activities',
        total: 'AED 70,570.00',
        collapsible: true,
        open: true,
        groups: [
          {
            title: 'Cash & Bank',
            lines: [
              { label: 'Landlord Equity', amount: 'AED 40,000.00' },
              { label: "Owner's Capital", amount: 'AED 30,570.00' }
            ],
            totalLabel: 'Total Income',
            total: 'AED 70,570.00'
          }
        ]
      }
    ]
  },
  'trial-balance': {
    id: 'trial-balance',
    title: 'Trial balance report',
    crumb: 'Trial balance report',
    company: 'Orville Real Estate LLC',
    period: '01 Jul 2026 - 10 Jul 2026',
    fromDate: '01/07/2026',
    toDate: '10/07/2026',
    layout: 'table',
    showExport: true,
    kpis: [
      { label: 'Total debit', value: 'AED 907,536.00', sub: 'Debit movements in the selected period.' },
      { label: 'Total credit', value: 'AED 3,960,157.00', sub: 'Credit movements in the selected period.' },
      { label: 'Net balance', value: 'AED 3,052,621.00', sub: 'Debit less credit.' }
    ],
    statementTitle: 'Trial balance report',
    netLabel: '',
    netValue: '',
    sections: [],
    tableRows: [
      { account: 'Cash - Checking Account', type: 'Asset', debit: 'AED 48,220.00', credit: 'AED 0.00', balance: 'AED 48,220.00' },
      { account: 'Owner Equity', type: 'Equity', debit: 'AED 0.00', credit: 'AED 40,000.00', balance: 'AED 40,000.00' },
      { account: 'Maintenance Expense', type: 'Expense', debit: 'AED 9,650.00', credit: 'AED 0.00', balance: 'AED 9,650.00' },
      { account: 'Rental Income', type: 'Income', debit: 'AED 0.00', credit: 'AED 812,122.00', balance: 'AED 812,122.00' },
      { account: 'Security Deposits Liability', type: 'Liability', debit: 'AED 0.00', credit: 'AED 70,870.00', balance: 'AED 70,870.00' }
    ]
  },
  'accounts-receivable': {
    id: 'accounts-receivable',
    title: 'Accounts Receivable Report',
    crumb: 'Accounts Receivable Report',
    company: 'Orville Real Estate LLC',
    period: '01 Jul 2026 - 10 Jul 2026',
    fromDate: '01/07/2026',
    toDate: '10/07/2026',
    layout: 'simple',
    kpis: [],
    statementTitle: 'Accounts receivable summary',
    netLabel: 'Net Total',
    netValue: 'AED 2,859,807.00',
    sections: [],
    simpleTotalLabel: 'Total for All',
    simpleRows: [
      { account: 'Accounts Receivable - Rent', balance: 'AED 2,859,807.00' }
    ]
  },
  'general-ledger': {
    id: 'general-ledger',
    title: 'General Ledger',
    crumb: 'General Ledger',
    company: 'Orville Real Estate LLC',
    period: '01 Jul 2026 - 10 Jul 2026',
    fromDate: '01/07/2026',
    toDate: '10/07/2026',
    layout: 'grouped',
    kpis: [
      { label: 'Total Debit', value: 'AED 48,659,893.00', sub: 'All debit movements shown' },
      { label: 'Total Credit', value: 'AED 56,019,624.47', sub: 'All credit movements shown' },
      { label: 'Net Balance', value: 'AED 7,359,731.47', sub: 'Debit less credit' }
    ],
    statementTitle: 'Trial balance by account group',
    netLabel: '',
    netValue: '',
    sections: [],
    ledgerGroups: [
      {
        title: 'Assets',
        countLabel: '5 accounts',
        debit: 'AED 48,603,413.00',
        credit: 'AED 53,078,625.47',
        open: true,
        rows: [
          { account: 'Cash - Checking Account', debit: 'AED 12,400.00', credit: 'AED 6,850.00', balance: 'AED 5,550.00' },
          { account: 'Accounts Receivable - Rent', debit: 'AED 2,859,807.00', credit: 'AED 48,220.00', balance: 'AED 2,811,587.00' },
          { account: 'Security Deposits Receivable', debit: 'AED 70,870.00', credit: 'AED 0.00', balance: 'AED 70,870.00' },
          { account: 'Imprest Account - Qaim', debit: 'AED 22,150.00', credit: 'AED 8,400.00', balance: 'AED 13,750.00' },
          { account: 'Imprest Account', debit: 'AED 9,650.00', credit: 'AED 0.00', balance: 'AED 9,650.00' }
        ]
      },
      {
        title: 'Liabilities',
        countLabel: '4 accounts',
        debit: 'AED 663,838.00',
        credit: 'AED 3,097,748.00',
        open: true,
        rows: [
          { account: 'Security Deposits Liability', debit: 'AED 0.00', credit: 'AED 70,870.00', balance: 'AED 70,870.00' },
          { account: 'Security Deposits Liability - BAKS', debit: 'AED 12,400.00', credit: 'AED 48,220.00', balance: 'AED 35,820.00' },
          { account: 'Credit Note Payable', debit: 'AED 3,200.00', credit: 'AED 9,650.00', balance: 'AED 6,450.00' },
          { account: 'Commission Payable', debit: 'AED 8,400.00', credit: 'AED 22,150.00', balance: 'AED 13,750.00' }
        ]
      },
      {
        title: 'Expenses',
        countLabel: '2 accounts',
        debit: 'AED 9,650.00',
        credit: 'AED 0.00',
        open: true,
        rows: [
          { account: 'Bad Debt Expense', debit: 'AED 6,850.00', credit: 'AED 0.00', balance: 'AED 6,850.00' },
          { account: 'Staff Accommodation Expense', debit: 'AED 2,800.00', credit: 'AED 0.00', balance: 'AED 2,800.00' }
        ]
      },
      {
        title: 'Income',
        countLabel: '4 accounts',
        debit: 'AED 139,796.00',
        credit: 'AED 52,185,997.00',
        open: true,
        rows: [
          { account: 'Rental Income', debit: 'AED 0.00', credit: 'AED 812,122.00', balance: 'AED 812,122.00' },
          { account: 'Pass-Through Rent Revenue', debit: 'AED 48,220.00', credit: 'AED 2,859,807.00', balance: 'AED 2,811,587.00' },
          { account: 'Security Deposits Retained', debit: 'AED 0.00', credit: 'AED 70,870.00', balance: 'AED 70,870.00' },
          { account: 'Other Income', debit: 'AED 9,650.00', credit: 'AED 22,150.00', balance: 'AED 12,500.00' }
        ]
      }
    ]
  },
  'management-income': {
    id: 'management-income',
    title: 'Management Income',
    crumb: 'Management Income',
    company: 'Orville Real Estate LLC',
    period: '',
    fromDate: '',
    toDate: '',
    layout: 'simple',
    hideDateFilter: true,
    kpis: [],
    statementTitle: '',
    netLabel: 'Net Income',
    netValue: 'AED 2,859,807.00',
    sections: [],
    simpleLeftLabel: 'Management Income',
    simpleRightLabel: 'Balance',
    simpleTotalLabel: 'Total Income',
    simpleRows: [{ account: 'Management Income', balance: 'AED 2,859,807.00' }]
  },
  'journal-entry': {
    id: 'journal-entry',
    title: 'Journal Entry',
    crumb: 'Journal Entry',
    company: 'Orville Real Estate LLC',
    period: '01 Jul 2026 - 10 Jul 2026',
    fromDate: '01/07/2026',
    toDate: '10/07/2026',
    layout: 'journal',
    kpis: [
      { label: 'Journal entries', value: '10', sub: 'Entries in the selected period' },
      { label: 'Total debits', value: 'AED 5,800.00', sub: 'Debits across visible entries' },
      { label: 'Total credits', value: 'AED 5,800.00', sub: 'Credits across visible entries' }
    ],
    statementTitle: 'Journal entry register',
    netLabel: '',
    netValue: '',
    sections: [],
    journalBlocks: [1798820, 1798821, 1798822, 1798823, 1798824].map((id) => ({
      title: `Invoice Payment — Line ${id}`,
      lines: [
        { account: 'Security Deposits Receivable', date: '07-01-2026', credit: '', debit: 'AED 500.00' },
        { account: 'Security Deposits Liability', date: '07-01-2026', credit: 'AED 500.00', debit: '' }
      ]
    }))
  },
  'annual-cash-flow': {
    id: 'annual-cash-flow',
    title: 'Annual Cash Flow Overview',
    crumb: 'Annual Cash Flow Overview',
    company: 'Orville Real Estate LLC',
    period: 'Financial year 2026',
    fromDate: '',
    toDate: '',
    layout: 'annual',
    hideDateFilter: true,
    yearFilter: true,
    year: '2026 Year',
    yearOptions: ['2026 Year', '2025 Year', '2024 Year'],
    kpis: [],
    statementTitle: 'Annual cash flow by account',
    netLabel: '',
    netValue: '',
    sections: [],
    annualMonths: [
      'Jan 2026',
      'Feb 2026',
      'Mar 2026',
      'Apr 2026',
      'May 2026',
      'Jun 2026',
      'Jul 2026',
      'Aug 2026',
      'Sep 2026'
    ],
    annualSections: [
      {
        title: 'Income',
        totalLabel: 'Total for Income',
        rows: [
          {
            account: 'Rental Income',
            total: '31,776,898.00',
            months: ['3,531,877.00', '3,531,877.00', '3,531,877.00', '3,531,877.00', '3,531,877.00', '3,531,877.00', '3,531,877.00', '3,531,877.00', '3,531,882.00']
          },
          {
            account: 'Late Fee Income',
            total: '12,400.00',
            months: ['1,200.00', '1,400.00', '1,100.00', '1,350.00', '1,500.00', '1,250.00', '1,400.00', '1,600.00', '1,600.00']
          },
          {
            account: 'Management Fees Income',
            total: '96,000.00',
            months: ['10,666.00', '10,666.00', '10,666.00', '10,666.00', '10,666.00', '10,666.00', '10,668.00', '10,668.00', '10,668.00']
          },
          {
            account: 'Sales Commission Income',
            total: '48,220.00',
            months: ['0.00', '0.00', '24,110.00', '0.00', '0.00', '24,110.00', '0.00', '0.00', '0.00']
          },
          {
            account: 'Property Sales Income',
            total: '0.00',
            months: ['0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00']
          },
          {
            account: 'Parking Fee',
            total: '22,150.00',
            months: ['2,450.00', '2,450.00', '2,450.00', '2,450.00', '2,450.00', '2,450.00', '2,450.00', '2,450.00', '2,500.00']
          },
          {
            account: 'Bounced Penalty',
            total: '9,650.00',
            months: ['1,050.00', '1,050.00', '1,100.00', '1,050.00', '1,100.00', '1,050.00', '1,100.00', '1,050.00', '1,100.00']
          }
        ],
        totals: ['31,965,318.00', '3,548,243.00', '3,548,443.00', '3,571,303.00', '3,548,393.00', '3,548,593.00', '3,571,353.00', '3,548,495.00', '3,548,645.00', '3,548,750.00']
      },
      {
        title: 'Liability',
        totalLabel: 'Total for Liability',
        rows: [
          {
            account: 'Security Deposits Liability',
            total: '70,870.00',
            months: ['7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,878.00']
          }
        ],
        totals: ['70,870.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,874.00', '7,878.00']
      }
    ]
  }
};
