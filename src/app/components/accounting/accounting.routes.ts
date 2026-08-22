import { Routes } from '@angular/router';

export const accountingRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'invoices' },
  {
    path: 'invoices/create',
    loadComponent: () =>
      import('./invoices/add-invoice.component').then((m) => m.AddInvoiceComponent)
  },
  {
    path: 'invoices',
    pathMatch: 'full',
    loadComponent: () =>
      import('./invoices/invoices.component').then((m) => m.InvoicesComponent)
  },
  {
    path: 'invoices/edit-invoice/:code',
    loadComponent: () =>
      import('./invoices/invoices.component').then((m) => m.InvoicesComponent)
  }, 
  {
    path: 'invoices/:id',
    loadComponent: () =>
      import('./invoices/invoice-detail.component').then((m) => m.InvoiceDetailComponent)
  },
  {
    path: 'expenses/create',
    loadComponent: () =>
      import('./expenses/add-expense.component').then((m) => m.AddExpenseComponent)
  },
  {
    path: 'expenses',
    pathMatch: 'full',
    loadComponent: () =>
      import('./expenses/expenses.component').then((m) => m.ExpensesComponent)
  },
  {
    path: 'credit-notes',
    loadComponent: () =>
      import('./credit-notes/credit-notes.component').then((m) => m.CreditNotesComponent)
  },
  {
    path: 'chart-of-accounts/create',
    loadComponent: () =>
      import('./chart-of-accounts/add-account.component').then((m) => m.AddAccountComponent)
  },
  {
    path: 'chart-of-accounts',
    loadComponent: () =>
      import('./chart-of-accounts/chart-of-accounts.component').then(
        (m) => m.ChartOfAccountsComponent
      )
  },
  {
    path: 'reports/:id',
    loadComponent: () =>
      import('./reports/report-view.component').then((m) => m.ReportViewComponent)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/accounting-reports.component').then(
        (m) => m.AccountingReportsComponent
      )
  },
  {
    path: 'cheques',
    loadComponent: () =>
      import('./cheques/cheques.component').then((m) => m.ChequesComponent)
  }
];
