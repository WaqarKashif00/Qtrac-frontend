export interface ICompanyConfigSuperAdminInfo {
  isDataRetentionPolicy?: boolean;
  dataRetentionYears: number;
  isLiteAgent?: boolean;
  isClassicAgent?: boolean;
  twilioAccountSID: string;
  twilioAuthKey: string;
  twilioServiceId: string;
  isAccountLinked: boolean;
  useLaviSMTPSettings: boolean;
}
