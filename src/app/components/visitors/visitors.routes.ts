import { Routes } from '@angular/router';

export const visitorsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./visitors-list/visitors-list.component').then((m) => m.VisitorsListComponent)
  },
  {
    path: 'check-in',
    loadComponent: () =>
      import('./visitors-list/visitors-list.component').then((m) => m.VisitorsListComponent),
    data: { visitorView: 'check-in' }
  },
  {
    path: 'check-out',
    loadComponent: () =>
      import('./visitors-list/visitors-list.component').then((m) => m.VisitorsListComponent),
    data: { visitorView: 'check-out' }
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-visitor/create-visitor.component').then((m) => m.CreateVisitorComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./visitor-detail/visitor-detail.component').then((m) => m.VisitorDetailComponent)
  }
];
