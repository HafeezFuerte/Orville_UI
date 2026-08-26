export interface ManagementFeeToggleDef {
  key: keyof ManagementFeeSettingsModel;
  label: string;
  description: string;
}

export interface ManagementFeeSettingsModel {
  enableCalculateOnContractValue: boolean;
  autoSendManagementFeeInvoice: boolean;
  alignInvoiceDueDatesWithContractStart: boolean;
}

export const MANAGEMENT_FEE_TOGGLES: ManagementFeeToggleDef[] = [
  {
    key: 'enableCalculateOnContractValue',
    label: 'Enable Calculate on Contract Value',
    description: 'It will allow you to calculate management fee on contract value.',
  },
  {
    key: 'autoSendManagementFeeInvoice',
    label: 'Auto Send Management Fee Invoice',
    description: 'It will allow you to auto send management fee invoice.',
  },
  {
    key: 'alignInvoiceDueDatesWithContractStart',
    label: 'Align Invoice Due Dates with Contract Start Date',
    description:
      'If selected, invoice due dates will be aligned with the contract start date each month.',
  },
];

export const DEFAULT_MANAGEMENT_FEE_SETTINGS: ManagementFeeSettingsModel = {
  enableCalculateOnContractValue: false,
  autoSendManagementFeeInvoice: false,
  alignInvoiceDueDatesWithContractStart: false,
};
