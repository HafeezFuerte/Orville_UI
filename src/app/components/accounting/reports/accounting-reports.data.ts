export type AccReportTone = 'success' | 'info' | 'purple' | 'warning' | 'teal' | 'danger';

export interface AccReportCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  tone: AccReportTone;
  hasView?: boolean;
}

export const ACC_REPORT_CARDS: AccReportCard[] = [
  {
    id: 'profit-loss',
    title: 'Profit & Loss Statement',
    description: 'Income and expenses by property over a selected period.',
    icon: 'assets/iconfonts/tabler-icons/icons/chart-line.svg',
    tone: 'success',
    hasView: true
  },
  {
    id: 'balance-sheet',
    title: 'Balance Sheet',
    description: 'View assets, liabilities and equity at a point in time.',
    icon: 'assets/iconfonts/tabler-icons/icons/chart-bar.svg',
    tone: 'info',
    hasView: true
  },
  {
    id: 'cash-flow',
    title: 'Cash Flow Statement',
    description: 'Track cash in and cash out by property over a selected period.',
    icon: 'assets/iconfonts/tabler-icons/icons/wallet.svg',
    tone: 'purple',
    hasView: true
  },
  {
    id: 'trial-balance',
    title: 'Trial Balance',
    description: 'Check that debit and credit totals are in balance.',
    icon: 'assets/iconfonts/tabler-icons/icons/scale.svg',
    tone: 'warning',
    hasView: true
  },
  {
    id: 'accounts-receivable',
    title: 'Accounts Receivable',
    description: 'Track outstanding balances, ageing and collections across tenant accounts.',
    icon: 'assets/iconfonts/tabler-icons/icons/report-money.svg',
    tone: 'info',
    hasView: true
  },
  {
    id: 'general-ledger',
    title: 'General Ledger',
    description: 'Review the complete record of journal entries and account activity.',
    icon: 'assets/iconfonts/tabler-icons/icons/book-2.svg',
    tone: 'teal',
    hasView: true
  },
  {
    id: 'management-income',
    title: 'Management Income',
    description: 'Summarise management income, fees and operating costs by property.',
    icon: 'assets/iconfonts/tabler-icons/icons/building.svg',
    tone: 'purple',
    hasView: true
  },
  {
    id: 'journal-entry',
    title: 'Journal Entry',
    description: 'Review manual journal entries, adjustments and posting details.',
    icon: 'assets/iconfonts/tabler-icons/icons/file-text.svg',
    tone: 'danger',
    hasView: true
  },
  {
    id: 'annual-cash-flow',
    title: 'Annual Cash Flow',
    description: 'Review month-by-month account balance movement across the financial year.',
    icon: 'assets/iconfonts/tabler-icons/icons/calendar.svg',
    tone: 'info',
    hasView: true
  }
];
