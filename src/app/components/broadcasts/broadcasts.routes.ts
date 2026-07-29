import { Routes } from '@angular/router';

export const broadcastsRoutingModule: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./broadcast-list/broadcast-list.component').then((m) => m.BroadcastListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./create-broadcast/create-broadcast.component').then((m) => m.CreateBroadcastComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./broadcast-detail/broadcast-detail.component').then((m) => m.BroadcastDetailComponent),
      }
    ]
  }
];
