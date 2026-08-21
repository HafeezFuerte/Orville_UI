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
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./rules-guides/rules-guides-list/rules-guides.component').then(
            (m) => m.RulesGuidesComponent
          )
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./rules-guides/create-guide/guide-add.component').then((m) => m.GuideAddComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./rules-guides/guide-detail/guide-detail.component').then(
            (m) => m.GuideDetailComponent
          )
      }
    ]
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
