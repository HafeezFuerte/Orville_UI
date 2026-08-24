export interface RolePermissionItem {
  id: string;
  label: string;
}

export interface RolePermissionCategory {
  id: string;
  name: string;
  permissions: RolePermissionItem[];
}

export interface RoleRow {
  id: number;
  name: string;
  userCount: number;
  system?: boolean;
  /** categoryId -> permissionId -> enabled */
  permissions: Record<string, Record<string, boolean>>;
}

/** Exact categories + permission labels from the Orville Roles & Permissions screenshot. */
export const ROLE_PERMISSION_CATEGORIES: RolePermissionCategory[] = [
  {
    id: 'company',
    name: 'Company',
    permissions: [
      { id: 'edit-company', label: 'Edit Company' },
      { id: 'read-company', label: 'Read Company' },
    ],
  },
  {
    id: 'user',
    name: 'User',
    permissions: [
      { id: 'add-user', label: 'Add User' },
      { id: 'delete-user', label: 'Delete User' },
      { id: 'edit-user', label: 'Edit User' },
      { id: 'read-user', label: 'Read User' },
    ],
  },
  {
    id: 'general',
    name: 'General',
    permissions: [
      { id: 'add-service-request', label: 'Add Service Request' },
      { id: 'add-user-role', label: 'Add User Role' },
      { id: 'delete-service-request', label: 'Delete Service Request' },
      { id: 'edit-service-request', label: 'Edit Service Request' },
      { id: 'edit-user-role', label: 'Edit User Role' },
      { id: 'read-app-stats', label: 'Read App Stats' },
      { id: 'read-myday', label: 'Read Myday' },
      { id: 'read-notifications', label: 'Read Notifications' },
      { id: 'read-report', label: 'Read Report' },
      { id: 'read-stats', label: 'Read Stats' },
    ],
  },
  {
    id: 'property',
    name: 'Property',
    permissions: [
      { id: 'add-property', label: 'Add Property' },
      { id: 'archived-property', label: 'Archived Property' },
      { id: 'delete-property', label: 'Delete Property' },
      { id: 'edit-property', label: 'Edit Property' },
      { id: 'export-properties', label: 'Export Properties' },
      { id: 'import-properties', label: 'Import Properties' },
      { id: 'read-property', label: 'Read Property' },
      { id: 'restore-property', label: 'Restore Property' },
    ],
  },
  {
    id: 'unit',
    name: 'Unit',
    permissions: [
      { id: 'add-unit', label: 'Add Unit' },
      { id: 'delete-unit', label: 'Delete Unit' },
      { id: 'edit-unit', label: 'Edit Unit' },
      { id: 'export-unit', label: 'Export Unit' },
      { id: 'import-units', label: 'Import Units' },
      { id: 'publish-unit', label: 'Publish Unit' },
      { id: 'read-unit', label: 'Read Unit' },
      { id: 'unpublish-unit', label: 'Unpublish Unit' },
    ],
  },
  {
    id: 'tenant',
    name: 'Tenant',
    permissions: [
      { id: 'add-tenant', label: 'Add Tenant' },
      { id: 'create-tenant-agreement', label: 'Create Tenant Agreement' },
      { id: 'delete-tenant', label: 'Delete Tenant' },
      { id: 'edit-tenant', label: 'Edit Tenant' },
      { id: 'export-tenant', label: 'Export Tenant' },
      { id: 'read-tenant', label: 'Read Tenant' },
    ],
  },
  {
    id: 'landlord',
    name: 'Landlord',
    permissions: [
      { id: 'add-landlord', label: 'Add Landlord' },
      { id: 'change-landlord-status', label: 'Change Landlord Status' },
      { id: 'create-landlord-agreement', label: 'Create Landlord Agreement' },
      { id: 'delete-landlord', label: 'Delete Landlord' },
      { id: 'edit-landlord', label: 'Edit Landlord' },
      { id: 'export-landlord', label: 'Export Landlord' },
      { id: 'read-landlord', label: 'Read Landlord' },
      { id: 'read-landlord-quotation', label: 'Read Landlord Quotation' },
    ],
  },
  {
    id: 'vendor',
    name: 'Vendor',
    permissions: [
      { id: 'add-vendor', label: 'Add Vendor' },
      { id: 'delete-vendor', label: 'Delete Vendor' },
      { id: 'edit-vendor', label: 'Edit Vendor' },
      { id: 'export-vendor', label: 'Export Vendor' },
      { id: 'read-vendor', label: 'Read Vendor' },
    ],
  },
];

export function createEmptyRolePermissions(): Record<string, Record<string, boolean>> {
  const map: Record<string, Record<string, boolean>> = {};
  for (const cat of ROLE_PERMISSION_CATEGORIES) {
    map[cat.id] = {};
    for (const p of cat.permissions) {
      map[cat.id][p.id] = false;
    }
  }
  return map;
}

export function fullCategoryPerms(cat: RolePermissionCategory): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const p of cat.permissions) {
    out[p.id] = true;
  }
  return out;
}

export function emptyCategoryPerms(cat: RolePermissionCategory): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const p of cat.permissions) {
    out[p.id] = false;
  }
  return out;
}

function allCategoriesFullAccess(): Record<string, Record<string, boolean>> {
  const map: Record<string, Record<string, boolean>> = {};
  for (const cat of ROLE_PERMISSION_CATEGORIES) {
    map[cat.id] = fullCategoryPerms(cat);
  }
  return map;
}

function withOverrides(
  overrides: Record<string, Record<string, boolean>>
): Record<string, Record<string, boolean>> {
  const map = createEmptyRolePermissions();
  for (const [catId, perms] of Object.entries(overrides)) {
    map[catId] = { ...(map[catId] || {}), ...perms };
  }
  return map;
}

export const MOCK_ROLES: RoleRow[] = [
  {
    id: 1,
    name: 'Accountant',
    userCount: 6,
    permissions: withOverrides({
      company: { 'read-company': true },
      tenant: { 'read-tenant': true, 'export-tenant': true },
      landlord: { 'read-landlord': true, 'export-landlord': true },
      general: { 'read-report': true, 'read-stats': true },
    }),
  },
  {
    id: 2,
    name: 'Accounts Manager',
    userCount: 1,
    permissions: withOverrides({
      company: { 'edit-company': true, 'read-company': true },
      tenant: {
        'add-tenant': true,
        'edit-tenant': true,
        'read-tenant': true,
        'export-tenant': true,
        'create-tenant-agreement': true,
      },
      landlord: {
        'add-landlord': true,
        'edit-landlord': true,
        'read-landlord': true,
        'export-landlord': true,
        'create-landlord-agreement': true,
        'read-landlord-quotation': true,
      },
      general: { 'read-report': true, 'read-stats': true, 'read-app-stats': true },
    }),
  },
  {
    id: 3,
    name: 'Collector',
    userCount: 42,
    permissions: withOverrides({
      tenant: { 'read-tenant': true, 'edit-tenant': true },
      landlord: { 'read-landlord': true },
      general: { 'read-myday': true, 'read-notifications': true },
    }),
  },
  {
    id: 4,
    name: 'Coordinator',
    userCount: 0,
    permissions: withOverrides({
      property: { 'read-property': true, 'edit-property': true },
      unit: { 'read-unit': true, 'edit-unit': true, 'publish-unit': true },
      general: {
        'add-service-request': true,
        'edit-service-request': true,
        'read-notifications': true,
      },
    }),
  },
  {
    id: 5,
    name: 'Leasing Agent',
    userCount: 0,
    permissions: withOverrides({
      property: { 'read-property': true, 'add-property': true, 'edit-property': true },
      unit: {
        'read-unit': true,
        'add-unit': true,
        'edit-unit': true,
        'publish-unit': true,
        'unpublish-unit': true,
      },
      tenant: {
        'add-tenant': true,
        'edit-tenant': true,
        'read-tenant': true,
        'create-tenant-agreement': true,
      },
      landlord: {
        'add-landlord': true,
        'edit-landlord': true,
        'read-landlord': true,
        'create-landlord-agreement': true,
      },
    }),
  },
  {
    id: 6,
    name: 'Inspector',
    userCount: 8,
    permissions: withOverrides({
      property: { 'read-property': true },
      unit: { 'read-unit': true },
      tenant: { 'read-tenant': true },
      general: {
        'add-service-request': true,
        'edit-service-request': true,
        'read-myday': true,
      },
    }),
  },
  {
    id: 7,
    name: 'Manager',
    userCount: 12,
    permissions: allCategoriesFullAccess(),
  },
  {
    id: 8,
    name: 'Admin',
    userCount: 3,
    system: true,
    permissions: allCategoriesFullAccess(),
  },
];
