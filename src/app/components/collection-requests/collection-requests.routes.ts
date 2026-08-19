import { Routes } from '@angular/router';

export const collectionRequestsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./collection-requests-list/collection-requests.component').then((m) => m.CollectionRequestsComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./collection-request-detail/collection-request-detail.component').then((m) => m.CollectionRequestDetailComponent)
  }
];
