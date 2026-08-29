import { Routes } from '@angular/router';

export const propertyListingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./all-listings/all-listings.component').then((m) => m.AllListingsComponent)
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./project-listings/project-listings.component').then((m) => m.ProjectListingsComponent)
  },
  {
    path: 'inquiries',
    loadComponent: () =>
      import('./property-inquiries/property-inquiries.component').then(
        (m) => m.PropertyInquiriesComponent
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./listing-detail/listing-detail.component').then((m) => m.ListingDetailComponent)
  }
];
