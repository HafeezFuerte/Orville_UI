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
    path: 'collection-requests',
    loadChildren: () =>
      import('../../components/collection-requests/collection-requests.routes').then(
        (m) => m.collectionRequestsRoutes
      ),
  },
  {
    path: 'reminders',
    loadChildren: () =>
      import('../../components/reminders/reminders.routes').then((m) => m.remindersRoutes),
  },
  {
    path: 'community',
    loadChildren: () =>
      import('../../components/community/community.routes').then((m) => m.communityRoutes),
  },
  { path: 'rules-guides', redirectTo: '/community/rules-guides', pathMatch: 'full' },
  { path: 'rules-guide', redirectTo: '/community/rules-guides', pathMatch: 'full' },
  { path: 'guides', redirectTo: '/community/rules-guides', pathMatch: 'full' },
  {
    path: 'bookings',
    loadChildren: () =>
      import('../../components/bookings/bookings.routes').then((m) => m.bookingsRoutes),
  },
  { path: 'spaces', redirectTo: '/bookings/spaces', pathMatch: 'full' },
  { path: 'spaces/new', redirectTo: '/bookings/spaces/new', pathMatch: 'full' },
  { path: 'spaces/:id', redirectTo: '/bookings/spaces/:id' },
  { path: 'flat-reservations', redirectTo: '/bookings/flat-reservations', pathMatch: 'full' },
  {
    path: 'legal',
    loadChildren: () =>
      import('../../components/legal/legal.routes').then((m) => m.legalRoutes),
  },
  {
    path: 'inspections',
    loadChildren: () =>
      import('../../components/inspections/inspections.routes').then((m) => m.inspectionsRoutes),
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