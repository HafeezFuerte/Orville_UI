import { Routes } from '@angular/router';

export const spacesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./spaces-list/spaces.component').then((m) => m.SpacesComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./create-new-space/space-add.component').then((m) => m.SpaceAddComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./space-detail/space-detail.component').then((m) => m.SpaceDetailComponent)
  }
];
