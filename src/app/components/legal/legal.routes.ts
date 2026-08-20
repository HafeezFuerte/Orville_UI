import { Routes } from '@angular/router';

export const legalRoutes: Routes = [
  {
    path: 'litigations',
    loadComponent: () => import('./litigations/litigations.component').then(m => m.LitigationsComponent)
  },
  {
    path: 'add-litigation',
    loadComponent: () => import('./add-litigation/add-litigation.component').then(m => m.AddLitigationComponent)
  },
  {
    path: 'litigation-details',
    loadComponent: () => import('./litigation-details/litigation-details.component').then(m => m.LitigationDetailsComponent)
  }
];
