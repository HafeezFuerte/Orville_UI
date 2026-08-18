import { Routes } from '@angular/router';

export const vendorContractsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./vendor-contracts-list/vendor-contracts-list.component').then(
        (m) => m.VendorContractsListComponent
      )
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-vendor-contract/create-vendor-contract.component').then(
        (m) => m.CreateVendorContractComponent
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./vendor-contract-detail/vendor-contract-detail.component').then(
        (m) => m.VendorContractDetailComponent
      )
  }
];
