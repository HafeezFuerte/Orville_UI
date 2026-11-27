export enum ScreenId {
  // Settings & Company
  CompanyDetails = 1,
  CompanyShifts = 1,
  RegionalSettings = 1,

  // Portfolio
  Portfolio = 4,
  Properties = 4,
  Units = 5,
  Rooms = 6,
  Parkings = 9,

  // Contacts
  Contacts = 10,
  AllContacts = 10,
  Tenants = 10,
  Landlords = 7,
  Vendors = 12,
  SupportTechnicians = 73,

  // Leases & Contracts
  LeasesManagement = 14,
  Contracts = 44,
  LandlordContracts = 44,
  VendorContracts = 72,

  // Accounting & Financials
  Accounting = 16,
  Invoices = 12,
  Expenses = 71,
  CreditNotes = 61,
  ChartOfAccounts = 16,
  AccountingReports = 11,
  Cheques = 52,

  // Commissions & Collections
  Commissions = 45,
  TenantCommissions = 45,
  LandlordCommissions = 74,
  CollectionRequests = 75,

  // Listings, Reminders, Broadcasts
  PropertyListings = 32,
  Reminders = 30,
  Broadcasts = 56,

  // Bookings & Spaces
  Bookings = 36,
  Spaces = 76,
  Reservations = 77,

  // Community
  Community = 37,
  Events = 42,
  Promotions = 68,
  RulesGuides = 78,

  // Facility & Maintenance
  Facility = 79,
  Requests = 75,
  WorkOrders = 29,
  Quotations = 13,
  PreventiveMaintenance = 29,
  Assets = 69,
  Inventory = 80,
  PurchaseOrders = 41,

  // Helpdesk & Tickets
  Helpdesk = 81,
  Tickets = 34,

  // Visitors
  Visitors = 31,
  AllVisitors = 31,
  CheckInVisitors = 31,
  CheckOutVisitors = 31,

  // Legal
  Legal = 17,
  Litigations = 82,

  // Inspections
  Inspection = 22,
  InspectionList = 22,
  TemplateList = 18,

  // Centers & Logs
  Reports = 11,
  DocumentsCenter = 83,
  DownloadCenter = 84,
  Archives = 85,
  EmailLogs = 39,
  ActivityLogs = 60,
  MobileStats = 59,
  Feedbacks = 43,
  TrackedActions = 64,
  Imports = 64,

  // Dashboards
  MyDay = 8,
  Insights = 8,
}

export interface ScreenDefinition {
  menuName: string;
  url: string;
  screenId: number;
}

export const SCREEN_DEFINITIONS: ScreenDefinition[] = [
  { menuName: 'My Day', url: '/my_day', screenId: 8 },
  { menuName: 'Insights', url: '/insights', screenId: 8 },
  { menuName: 'Properties', url: '/properties', screenId: 4 },
  { menuName: 'Units', url: '/units', screenId: 5 },
  { menuName: 'Rooms', url: '/rooms', screenId: 6 },
  { menuName: 'Parkings', url: '/parkings', screenId: 9 },
  { menuName: 'All Contacts', url: '/all_contacts', screenId: 10 },
  { menuName: 'Tenants', url: '/tenants', screenId: 10 },
  { menuName: 'Landlords', url: '/landlords', screenId: 7 },
  { menuName: 'Vendors', url: '/vendors', screenId: 12 },
  { menuName: 'Support Technicians', url: '/support_technicians', screenId: 73 },
  { menuName: 'Leases Management', url: '/leases', screenId: 14 },
  { menuName: 'Landlord Contracts', url: '/l_contracts', screenId: 44 },
  { menuName: 'Vendor Contracts', url: '/v_contracts', screenId: 72 },
  { menuName: 'Invoices', url: '/invoices', screenId: 12 },
  { menuName: 'Expenses', url: '/expenses', screenId: 71 },
  { menuName: 'Credit Notes', url: '/credit_notes', screenId: 61 },
  { menuName: 'Chart Of Accounts', url: '/coa', screenId: 16 },
  { menuName: 'Accounting Reports', url: '/acc_reports', screenId: 11 },
  { menuName: 'Cheques', url: '/cheques', screenId: 52 },
  { menuName: 'Tenant Commissions', url: '/tenants_comm', screenId: 45 },
  { menuName: 'Landlord Commissions', url: '/landlord_comm', screenId: 74 },
  { menuName: 'Collection Request', url: '/collection_requests', screenId: 75 },
  { menuName: 'Property Listings', url: '/property_listings', screenId: 32 },
  { menuName: 'Reminders', url: '/reminders', screenId: 30 },
  { menuName: 'Broadcasts', url: '/broadcasts', screenId: 56 },
  { menuName: 'Spaces', url: '/spaces', screenId: 76 },
  { menuName: 'Reservations', url: '/reservations', screenId: 77 },
  { menuName: 'Events', url: '/events', screenId: 42 },
  { menuName: 'Promotions', url: '/promotions', screenId: 68 },
  { menuName: 'Rules/Guides', url: '/rules', screenId: 78 },
  { menuName: 'Requests', url: '/requests', screenId: 75 },
  { menuName: 'Work Orders', url: '/work_orders', screenId: 29 },
  { menuName: 'Quotations', url: '/quotations', screenId: 13 },
  { menuName: 'Preventive Maintenance', url: '/p_maintenances', screenId: 29 },
  { menuName: 'Assets', url: '/assets', screenId: 69 },
  { menuName: 'Parts/Inventory', url: '/inventory', screenId: 80 },
  { menuName: 'Purchase Orders', url: '/purchase_order', screenId: 41 },
  { menuName: 'Tickets', url: '/tickets', screenId: 34 },
  { menuName: 'All Visitors', url: '/all_visitors', screenId: 31 },
  { menuName: 'Check-In Visitors', url: '/check_in_visitors', screenId: 31 },
  { menuName: 'Check-Out Visitors', url: '/check_out_visitors', screenId: 31 },
  { menuName: 'Litigations', url: '/ligitations', screenId: 82 },
  { menuName: 'Inspection List', url: '/inspection_list', screenId: 22 },
  { menuName: 'Template List', url: '/template_list', screenId: 18 },
  { menuName: 'Reports', url: '/reports', screenId: 11 },
  { menuName: 'Documents Center', url: '/documents', screenId: 83 },
  { menuName: 'Download Center', url: '/downloads', screenId: 84 },
  { menuName: 'Archives', url: '/archives', screenId: 85 },
  { menuName: 'Company details', url: '/settings/company-details', screenId: 1 },
  { menuName: 'Company shifts', url: '/settings/company-shifts', screenId: 1 },
  { menuName: 'Regional settings', url: '/settings/regional-settings', screenId: 1 },
  { menuName: 'Email logs', url: '/email-logs', screenId: 39 },
  { menuName: 'Activity logs', url: '/activity-logs', screenId: 60 },
  { menuName: 'Mobile Stats', url: '/mobile-stats', screenId: 59 },
  { menuName: 'Feedbacks', url: '/feedbacks', screenId: 43 },
  { menuName: 'Tracked Actions', url: '/tracked-actions', screenId: 64 },
  { menuName: 'Imports', url: '/imports', screenId: 64 },
];

/**
 * Fast URL-to-ScreenId dictionary.
 */
export const URL_TO_SCREEN_ID: Record<string, number> = {};

// Populate dictionary with both with-slash and without-slash forms
for (const def of SCREEN_DEFINITIONS) {
  if (def.url) {
    const clean = def.url.split('?')[0].replace(/\/+$/, '');
    const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
    const withoutSlash = clean.replace(/^\/+/, '');

    URL_TO_SCREEN_ID[withSlash] = def.screenId;
    URL_TO_SCREEN_ID[withoutSlash] = def.screenId;

    // Handle hyphens vs underscores variations (e.g. /my-day and /my_day)
    const hyphenated = withSlash.replace(/_/g, '-');
    const underscored = withSlash.replace(/-/g, '_');
    URL_TO_SCREEN_ID[hyphenated] = def.screenId;
    URL_TO_SCREEN_ID[hyphenated.replace(/^\/+/, '')] = def.screenId;
    URL_TO_SCREEN_ID[underscored] = def.screenId;
    URL_TO_SCREEN_ID[underscored.replace(/^\/+/, '')] = def.screenId;
  }
}

// Angular route aliases that differ from Menu_Screen_id_Orville.xlsx URLs
URL_TO_SCREEN_ID['/preventive-maintenance'] = ScreenId.PreventiveMaintenance;
URL_TO_SCREEN_ID['preventive-maintenance'] = ScreenId.PreventiveMaintenance;
URL_TO_SCREEN_ID['/purchase-orders'] = ScreenId.PurchaseOrders;
URL_TO_SCREEN_ID['purchase-orders'] = ScreenId.PurchaseOrders;

/**
 * Resolves a screen ID from a URL, path, or menu name.
 */
export function getScreenId(routeOrUrl: string): number | null {
  if (!routeOrUrl) return null;
  const clean = routeOrUrl.split('?')[0].replace(/\/+$/, '');
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  const withoutSlash = clean.replace(/^\/+/, '');

  if (URL_TO_SCREEN_ID[withSlash] !== undefined) {
    return URL_TO_SCREEN_ID[withSlash];
  }
  if (URL_TO_SCREEN_ID[withoutSlash] !== undefined) {
    return URL_TO_SCREEN_ID[withoutSlash];
  }

  // Check path segments from right to left (e.g. '/contacts/tenants' -> 'tenants')
  const segments = clean.toLowerCase().split('/').filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    if (URL_TO_SCREEN_ID[seg] !== undefined) {
      return URL_TO_SCREEN_ID[seg];
    }
    if (URL_TO_SCREEN_ID[`/${seg}`] !== undefined) {
      return URL_TO_SCREEN_ID[`/${seg}`];
    }
  }

  // Substring matching on registered definitions
  for (const def of SCREEN_DEFINITIONS) {
    if (def.url) {
      const defClean = def.url.toLowerCase().replace(/^\/+/, '');
      if (clean.toLowerCase().includes(defClean)) {
        return def.screenId;
      }
    }
  }

  // Try matching by MenuName
  const foundByName = SCREEN_DEFINITIONS.find(
    (d) => d.menuName.toLowerCase() === routeOrUrl.toLowerCase()
  );
  return foundByName ? foundByName.screenId : null;
}
