import { Routes } from '@angular/router';

export const reservationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./reservations-list/reservations.component').then((m) => m.ReservationsComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./create-new-reservation/reservation-add.component').then((m) => m.ReservationAddComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./reservation-detail/reservation-detail.component').then((m) => m.ReservationDetailComponent)
  }
];
