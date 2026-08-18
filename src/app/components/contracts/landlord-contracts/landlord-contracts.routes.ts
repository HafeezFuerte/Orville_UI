import { Routes } from '@angular/router';

export const landlordContractsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landlord-contracts-list/landlord-contracts-list.component').then(
        (m) => m.LandlordContractsListComponent
      )
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-landlord-contract/create-landlord-contract.component').then(
        (m) => m.CreateLandlordContractComponent
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./landlord-contract-detail/landlord-contract-detail.component').then(
        (m) => m.LandlordContractDetailComponent
      )
  }
];
