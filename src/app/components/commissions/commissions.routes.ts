import { Routes } from '@angular/router';

export const commissionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./commissions-list/commissions.component').then((m) => m.CommissionsComponent)
  },
  {
    path: 'tenant',
    loadComponent: () =>
      import('./commissions-list/commissions.component').then((m) => m.CommissionsComponent)
  },
  {
    path: 'landlord',
    loadComponent: () =>
      import('./commissions-list/commissions.component').then((m) => m.CommissionsComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./commission-detail/commission-detail.component').then((m) => m.CommissionDetailComponent)
  }
];
