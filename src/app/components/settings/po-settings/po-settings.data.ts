export interface PoSettingsModel {
  addTermsAndConditions: boolean;
  termsAndConditions: string;
}

export const DEFAULT_PO_SETTINGS: PoSettingsModel = {
  addTermsAndConditions: true,
  termsAndConditions: '',
};
