export interface ChequePenaltyAccountOption {
  id: string;
  name: string;
}

export interface ChequesSettingsModel {
  penaltyAccountId: string;
  penaltyFixedAmount: string;
}

export const CHEQUE_PENALTY_ACCOUNTS: ChequePenaltyAccountOption[] = [
  { id: 'bounced-penalty', name: 'Bounced Penalty' },
  { id: 'penalty-income', name: 'Penalty Income' },
  { id: 'collections', name: 'Collections Account' },
];

export const DEFAULT_CHEQUES_SETTINGS: ChequesSettingsModel = {
  penaltyAccountId: 'bounced-penalty',
  penaltyFixedAmount: '',
};
