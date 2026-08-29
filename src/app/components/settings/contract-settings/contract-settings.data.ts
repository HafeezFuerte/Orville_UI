export interface ContractSettingsModel {
  renewalNoticeDays: number[];
  enableRenewalEmails: boolean;
  includeCcManagers: boolean;
}

export const DEFAULT_CONTRACT_SETTINGS: ContractSettingsModel = {
  renewalNoticeDays: [30, 60, 90, 120],
  enableRenewalEmails: true,
  includeCcManagers: false,
};

export const CONTRACT_NOTICE_PRESETS = [30, 60, 90, 120] as const;
