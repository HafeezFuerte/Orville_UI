import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { admin, dashboardRoutingModule } from '../../components/dashboards/dashboard.routes';
import { SETTINGS_PLACEHOLDER_ROUTES } from '../../components/settings/settings-menu.data';

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
    path: 'visitors',
    loadChildren: () =>
      import('../../components/visitors/visitors.routes').then((m) => m.visitorsRoutes),
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
  {
    path: 'bookings',
    loadChildren: () =>
      import('../../components/bookings/bookings.routes').then((m) => m.bookingsRoutes),
  },
  { path: 'spaces', redirectTo: '/bookings/spaces', pathMatch: 'full' },
  { path: 'spaces/new', redirectTo: '/bookings/spaces/new', pathMatch: 'full' },
  { path: 'spaces/:id', redirectTo: '/bookings/spaces/:id' },
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
        path: 'workflow-approvals',
        loadComponent: () => import('../../components/settings/workflow-approvals/workflow-approvals.component').then(m => m.WorkflowApprovalsComponent)
      },
      {
        path: 'regional-settings',
        loadComponent: () => import('../../components/settings/regional-settings/regional-settings.component').then(m => m.RegionalSettingsComponent)
      },
      {
        path: 'masters',
        loadComponent: () => import('../../components/settings/masters/masters.component').then(m => m.MastersComponent)
      },
      {
        path: 'brand',
        loadComponent: () =>
          import('../../components/settings/brand/brand-settings.component').then((m) => m.BrandSettingsComponent),
      },
      {
        path: 'watermark',
        loadComponent: () =>
          import('../../components/settings/watermark/watermark-settings.component').then(
            (m) => m.WatermarkSettingsComponent
          ),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('../../components/settings/departments/departments-settings.component').then(
            (m) => m.DepartmentsSettingsComponent
          ),
      },
      {
        path: 'document-template',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '../../components/settings/document-templates/document-templates.component'
              ).then((m) => m.DocumentTemplatesComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                '../../components/settings/document-templates/document-template-add.component'
              ).then((m) => m.DocumentTemplateAddComponent),
          },
        ],
      },
      {
        path: 'pdf-builder',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../../components/settings/pdf-builder/pdf-builder.component').then(
                (m) => m.PdfBuilderComponent
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('../../components/settings/pdf-builder/pdf-builder-add.component').then(
                (m) => m.PdfBuilderAddComponent
              ),
          },
        ],
      },
      {
        path: 'mandatory-documents',
        loadComponent: () =>
          import(
            '../../components/settings/mandatory-documents/mandatory-documents.component'
          ).then((m) => m.MandatoryDocumentsComponent),
      },
      {
        path: 'attachment-types',
        loadComponent: () =>
          import(
            '../../components/settings/attachment-types/attachment-types.component'
          ).then((m) => m.AttachmentTypesComponent),
      },
      {
        path: 'users-and-admins',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '../../components/settings/users-and-admins/users-and-admins.component'
              ).then((m) => m.UsersAndAdminsComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('../../components/settings/users-and-admins/user-add.component').then(
                (m) => m.UserAddComponent
              ),
          },
        ],
      },
      {
        path: 'roles-and-permissions',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '../../components/settings/roles-and-permissions/roles-and-permissions.component'
              ).then((m) => m.RolesAndPermissionsComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('../../components/settings/roles-and-permissions/role-add.component').then(
                (m) => m.RoleAddComponent
              ),
          },
        ],
      },
      {
        path: 'bulk-assign-properties',
        loadComponent: () =>
          import(
            '../../components/settings/bulk-assign-properties/bulk-assign-properties.component'
          ).then((m) => m.BulkAssignPropertiesComponent),
      },
      {
        path: 'profile-verification',
        loadComponent: () =>
          import(
            '../../components/settings/profile-verification/profile-verification.component'
          ).then((m) => m.ProfileVerificationComponent),
      },
      {
        path: 'invoice-receipt-profiles',
        loadComponent: () =>
          import(
            '../../components/settings/invoice-receipt-profiles/invoice-receipt-profiles.component'
          ).then((m) => m.InvoiceReceiptProfilesComponent),
      },
      ...SETTINGS_PLACEHOLDER_ROUTES.filter((r) => !r.path.includes('/')).map((r) => ({
        path: r.path,
        loadComponent: () =>
          import('../../components/settings/settings-placeholder/settings-placeholder.component').then(
            (m) => m.SettingsPlaceholderComponent
          ),
        data: { title: r.title },
      })),
      {
        path: 'servicehub',
        children: SETTINGS_PLACEHOLDER_ROUTES.filter((r) => r.path.startsWith('servicehub/')).map((r) => ({
          path: r.path.replace('servicehub/', ''),
          loadComponent: () =>
            import('../../components/settings/settings-placeholder/settings-placeholder.component').then(
              (m) => m.SettingsPlaceholderComponent
            ),
          data: { title: r.title },
        })),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(admin)],
  exports: [RouterModule],
})
export class SharedRoutingModule { }