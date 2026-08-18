import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { admin, dashboardRoutingModule } from '../../components/dashboards/dashboard.routes';

export const content: Routes = [
  {
    path: '',
    children: [ 
      ...dashboardRoutingModule.routes,
    ],
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('../../components/contacts/contacts.routes').then((m) => m.contactsRoutingModule),
  },
  {
    path: 'broadcasts',
    loadChildren: () =>
      import('../../components/broadcasts/broadcasts.routes').then((m) => m.broadcastsRoutingModule),
  },
  {
    path: 'facility',
    loadChildren: () =>
      import('../../components/facility/facility.routes').then((m) => m.facilityRoutingModule),
  },
  {
    path: 'leases',
    loadChildren: () =>
      import('../../components/leases/leases.routes').then((m) => m.leasesRoutingModule),
  },
  {
    path: 'landlord-contracts',
    loadChildren: () =>
      import('../../components/contracts/landlord-contracts/landlord-contracts.routes').then((m) => m.landlordContractsRoutes),
  },
  {
    path: 'vendor-contracts',
    loadChildren: () =>
      import('../../components/contracts/vendor-contracts/vendor-contracts.routes').then((m) => m.vendorContractsRoutes),
  },
  {
    path: 'accounting',
    loadChildren: () =>
      import('../../components/accounting/accounting.routes').then((m) => m.accountingRoutes),
  },
  {
    path: 'commissions',
    loadChildren: () =>
      import('../../components/commissions/commissions.routes').then((m) => m.commissionsRoutes),
  },
  {
    path: 'settings',
    children: [
      {
        path: 'company-details',
        loadComponent: () => import('../../components/settings/company-details/company-details.component').then(m => m.CompanyDetailsComponent)
      },
      {
        path: 'company-shifts',
        loadComponent: () => import('../../components/settings/company-shifts/company-shifts.component').then(m => m.CompanyShiftsComponent)
      },
      {
        path: 'regional-settings',
        loadComponent: () => import('../../components/settings/regional-settings/regional-settings.component').then(m => m.RegionalSettingsComponent)
      },
      {
        path: 'masters',
        loadComponent: () => import('../../components/settings/masters/masters.component').then(m => m.MastersComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(admin)],
  exports: [RouterModule],
})
export class SharedRoutingModule { }