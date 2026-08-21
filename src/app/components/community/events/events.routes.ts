import { Routes } from '@angular/router';

export const eventsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./events-list/events.component').then((m) => m.EventsComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./create-event/event-add.component').then((m) => m.EventAddComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./event-detail/event-detail.component').then((m) => m.EventDetailComponent)
  }
];
