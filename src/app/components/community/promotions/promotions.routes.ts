import { Routes } from '@angular/router';

export const promotionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./promotions-list/promotions.component').then((m) => m.PromotionsComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./create-promotion/promotion-add.component').then((m) => m.PromotionAddComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./promotion-detail/promotion-detail.component').then((m) => m.PromotionDetailComponent)
  }
];
