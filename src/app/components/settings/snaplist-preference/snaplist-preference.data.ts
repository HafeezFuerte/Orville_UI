export interface SnaplistPreferenceModel {
  photosLimit: string;
  delayedInspectionNotice: string;
  upcomingInspectionNotice: string;
  showCompanyContactInfo: boolean;
  emailReportToTenant: boolean;
  emailReportToLandlord: boolean;
}

export const DEFAULT_SNAPLIST_PREFERENCE: SnaplistPreferenceModel = {
  photosLimit: '5',
  delayedInspectionNotice: '1,3,7,15,30',
  upcomingInspectionNotice: '1,3,7,10',
  showCompanyContactInfo: true,
  emailReportToTenant: true,
  emailReportToLandlord: true,
};
