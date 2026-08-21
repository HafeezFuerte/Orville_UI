import { Routes } from '@angular/router';

export const bookingsRoutes: Routes = [
  {
    path: 'spaces',
    loadChildren: () => import('./spaces/spaces.routes').then((m) => m.spacesRoutes)
  },
  {
    path: 'reservations',
    loadChildren: () => import('./reservations/reservations.routes').then((m) => m.reservationsRoutes)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'reservations'
  }
];
