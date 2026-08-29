export interface EmailSettingsModel {
  enableSmtp: boolean;
  smtpEmail: string;
  smtpPassword: string;
  smtpAddress: string;
  smtpPort: string;
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettingsModel = {
  enableSmtp: true,
  smtpEmail: 'rental@orvillerealestate.com',
  smtpPassword: '',
  smtpAddress: 'smtp.zeptomail.com',
  smtpPort: '587',
};
