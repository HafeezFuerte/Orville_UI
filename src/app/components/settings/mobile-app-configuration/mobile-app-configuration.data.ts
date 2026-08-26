export type MobileAppAudience = 'tenant' | 'landlord' | 'vendor';

export interface MobileAppAudienceSettings {
  disableChats: boolean;
}

export interface MobileAppConfigurationModel {
  tenant: MobileAppAudienceSettings;
  landlord: MobileAppAudienceSettings;
  vendor: MobileAppAudienceSettings;
}

export const DEFAULT_MOBILE_APP_CONFIGURATION: MobileAppConfigurationModel = {
  tenant: { disableChats: false },
  landlord: { disableChats: false },
  vendor: { disableChats: false },
};

export const MOBILE_APP_TABS: {
  id: MobileAppAudience;
  label: string;
  preferencesTitle: string;
  preferencesSub: string;
  optionLabel: string;
  optionDesc: string;
}[] = [
  {
    id: 'tenant',
    label: 'Tenant',
    preferencesTitle: 'Preferences',
    preferencesSub: 'Configure tenant mobile app communication settings.',
    optionLabel: 'Disable tenant chats',
    optionDesc: 'If enabled, tenants cannot use chat in the mobile app.',
  },
  {
    id: 'landlord',
    label: 'Landlord',
    preferencesTitle: 'Preferences',
    preferencesSub: 'Configure landlord mobile app communication settings.',
    optionLabel: 'Disable landlord chats',
    optionDesc: 'If enabled, landlords cannot use chat in the mobile app.',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    preferencesTitle: 'Preferences',
    preferencesSub: 'Configure vendor mobile app communication settings.',
    optionLabel: 'Disable vendor chats',
    optionDesc: 'If enabled, vendors cannot use chat in the mobile app.',
  },
];
