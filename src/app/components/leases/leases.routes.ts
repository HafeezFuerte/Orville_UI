import { Routes } from '@angular/router';

export const leasesRoutingModule: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./leases-list/leases-list.component').then((m) => m.LeasesListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-lease/create-lease.component').then((m) => m.CreateLeaseComponent),
  },
  {
    path: 'edit-lease/:code',
    loadComponent: () =>
    import('./create-lease/create-lease.component').then((m) => m.CreateLeaseComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./lease-detail/lease-detail.component').then((m) => m.LeaseDetailComponent),
  }
];
// Force compile 1
