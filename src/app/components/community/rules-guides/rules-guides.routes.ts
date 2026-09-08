import { Routes } from '@angular/router';

export const rulesGuidesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./rules-guides-list/rules-guides.component').then((m) => m.RulesGuidesComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./create-guide/guide-add.component').then((m) => m.GuideAddComponent)
  },
  {
    path: 'edit/:code',
    loadComponent: () =>
      import('./create-guide/guide-add.component').then((m) => m.GuideAddComponent)
  },
  {
    path: ':code',
    loadComponent: () =>
      import('./guide-detail/guide-detail.component').then((m) => m.GuideDetailComponent)
  }
];
