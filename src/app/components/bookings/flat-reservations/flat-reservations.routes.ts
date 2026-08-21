import { Routes } from '@angular/router';

export const flatReservationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./flat-reservations-calendar/flat-reservations.component').then(
        (m) => m.FlatReservationsComponent
      )
  }
];
