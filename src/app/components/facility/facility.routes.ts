import { Routes } from '@angular/router';

export const facilityRoutingModule: Routes = [
  {
    path: 'work-orders',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./work-orders/work-order-list/work-order-list.component').then((m) => m.WorkOrderListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./work-orders/create-work-order/create-work-order.component').then((m) => m.CreateWorkOrderComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./work-orders/create-work-order/create-work-order.component').then((m) => m.CreateWorkOrderComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./work-orders/work-order-detail/work-order-detail.component').then((m) => m.WorkOrderDetailComponent),
      }
    ]
  },
  {
    path: 'assets',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./asset-management/asset-list/asset-list.component').then((m) => m.AssetListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./asset-management/create-asset/create-asset.component').then((m) => m.CreateAssetComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./asset-management/create-asset/create-asset.component').then((m) => m.CreateAssetComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./asset-management/asset-detail/asset-detail.component').then((m) => m.AssetDetailComponent),
      }
    ]
  }
];

// Force recompile 1
