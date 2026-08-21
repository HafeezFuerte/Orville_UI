import { Routes } from '@angular/router';

export const facilityRoutingModule: Routes = [
  {
    path: 'requests',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./requests/requests-list/requests.component').then((m) => m.FacilityRequestsComponent),
      }
    ]
  },
  {
    path: 'tickets',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./tickets/tickets-list/tickets.component').then((m) => m.FacilityTicketsComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./tickets/create-ticket/create-ticket.component').then((m) => m.CreateTicketComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./tickets/ticket-detail/ticket-detail.component').then((m) => m.TicketDetailComponent),
      }
    ]
  },
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
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'requests'
  }
];
