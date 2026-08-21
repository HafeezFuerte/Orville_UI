import { Routes } from '@angular/router';

export const communityRoutes: Routes = [
  {
    path: 'events',
    loadChildren: () => import('./events/events.routes').then((m) => m.eventsRoutes)
  },
  {
    path: 'promotions',
    loadChildren: () => import('./promotions/promotions.routes').then((m) => m.promotionsRoutes)
  },
  {
    path: 'rules-guides',
    loadChildren: () =>
      import('./rules-guides/rules-guides.routes').then((m) => m.rulesGuidesRoutes)
  },
  { path: 'rules-guide', redirectTo: 'rules-guides', pathMatch: 'full' },
  { path: 'rules', redirectTo: 'rules-guides', pathMatch: 'full' },
  { path: 'guides', redirectTo: 'rules-guides', pathMatch: 'full' },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'events'
  }
];
