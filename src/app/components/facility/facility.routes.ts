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
    path: 'quotations',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./quotations/quotations-list/quotations-list.component').then((m) => m.QuotationsListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./quotations/create-quotation/create-quotation.component').then((m) => m.CreateQuotationComponent),
      },
      {
        path: 'request',
        loadComponent: () =>
          import('./quotations/request-quotation/request-quotation.component').then((m) => m.RequestQuotationComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./quotations/quotation-detail/quotation-detail.component').then((m) => m.QuotationDetailComponent),
      }
    ]
  },
  {
    path: 'preventive-maintenance',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./preventive-maintenance/preventive-maintenance-list/preventive-maintenance-list.component').then(
            (m) => m.PreventiveMaintenanceListComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./preventive-maintenance/create-preventive-maintenance/create-preventive-maintenance.component').then(
            (m) => m.CreatePreventiveMaintenanceComponent
          ),
      },
    ]
  },
  {
    path: 'inventory',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./inventory/inventory-list/inventory-list.component').then((m) => m.InventoryListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./inventory/create-inventory/create-inventory.component').then((m) => m.CreateInventoryComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./inventory/inventory-detail/inventory-detail.component').then((m) => m.InventoryDetailComponent),
      },
    ]
  },
  {
    path: 'purchase-order',
    pathMatch: 'full',
    redirectTo: 'purchase-orders',
  },
  {
    path: 'purchase-order/:id',
    redirectTo: 'purchase-orders/:id',
  },
  {
    path: 'purchase-orders',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./purchase-orders/purchase-order-list/purchase-order-list.component').then(
            (m) => m.PurchaseOrderListComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./purchase-orders/create-purchase-order/create-purchase-order.component').then(
            (m) => m.CreatePurchaseOrderComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./purchase-orders/purchase-order-detail/purchase-order-detail.component').then(
            (m) => m.PurchaseOrderDetailComponent
          ),
      },
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
