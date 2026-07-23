import { Routes } from '@angular/router';

export const contactsRoutingModule: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all-contacts',
        loadComponent: () =>
          import('./all-contacts/all-contacts.component').then((m) => m.AllContactsComponent),
      },
      {
        path: 'landlords',
        loadComponent: () =>
          import('./landlords/landlords.component').then((m) => m.LandlordsComponent),
      },
      {
        path: 'landlords/add-landlord',
        loadComponent: () =>
          import('./landlords/add-landlord/add-landlord.component').then((m) => m.AddLandlordComponent),
      },
      {
        path: 'landlords/:id',
        // Newly added landlord details page route
        loadComponent: () =>
          import('./landlords/landlord-detail/landlord-detail.component').then((m) => m.LandlordDetailComponent),
      },
      {
        path: 'tenants',
        loadComponent: () =>
          import('./tenants/tenants.component').then((m) => m.TenantsComponent),
      },
      {
        path: 'tenants/add-tenant',
        loadComponent: () =>
          import('./tenants/add-tenant/add-tenant.component').then((m) => m.AddTenantComponent),
      },
      {
        path: 'tenants/:id',
        loadComponent: () =>
          import('./tenants/tenant-detail/tenant-detail.component').then((m) => m.TenantDetailComponent),
      },
      {
        path: 'vendors',
        loadComponent: () =>
          import('./vendors/vendors.component').then((m) => m.VendorsComponent),
      },
      {
        path: 'vendors/add-vendor',
        loadComponent: () =>
          import('./vendors/add-vendor/add-vendor.component').then((m) => m.AddVendorComponent),
      },
      {
        path: 'vendors/:id',
        // Newly added vendor details page route
        loadComponent: () =>
          import('./vendors/vendor-detail/vendor-detail.component').then((m) => m.VendorDetailComponent),
      },
      {
        path: 'support-technicians',
        loadComponent: () =>
          import('./support-technicians/support-technicians.component').then((m) => m.SupportTechniciansComponent),
      },
      {
        path: 'support-technicians/add-support-technician',
        loadComponent: () =>
          import('./support-technicians/add-support-technician/add-support-technician.component').then((m) => m.AddSupportTechnicianComponent),
      },
      {
        path: 'support-technicians/:id',
        // Newly added support technician details page route
        loadComponent: () =>
          import('./support-technicians/support-technician-detail/support-technician-detail.component').then((m) => m.SupportTechnicianDetailComponent),
      },
    ],
  },
];
