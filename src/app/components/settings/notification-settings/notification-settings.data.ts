export interface NotificationSettingsModel {
  companyEmail: string;
  financeEmail: string;
  maintenanceEmail: string;
  replyToEmail: string;
  enableMaintenanceUpdates: boolean;
  enableWebNotifications: boolean;
  allowEmailsCrmUsers: boolean;
  allowEmailsTenants: boolean;
  allowEmailsLandlords: boolean;
  allowEmailsVendors: boolean;
  allowEmailsUsers: boolean;
  sendReceiptAttachment: boolean;
  sendInvoiceAttachment: boolean;
  defaultRejectNote: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsModel = {
  companyEmail: 'rental@orvillerealestate.com',
  financeEmail: '',
  maintenanceEmail: 'james@orvillerealestate.com',
  replyToEmail: 'rental@orvillerealestate.com',
  enableMaintenanceUpdates: false,
  enableWebNotifications: false,
  allowEmailsCrmUsers: false,
  allowEmailsTenants: true,
  allowEmailsLandlords: false,
  allowEmailsVendors: false,
  allowEmailsUsers: true,
  sendReceiptAttachment: false,
  sendInvoiceAttachment: false,
  defaultRejectNote: '',
};
