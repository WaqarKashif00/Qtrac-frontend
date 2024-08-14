import { ILanguageDropdownList } from './language-dropdownlist.interface';
import { ISmtpSettings } from './smtp-settings.interface';
import { ISmsConfig } from './sms-config.interface';
import { IPurgeSettings } from './purge-settings.interface';
import { ISiteSetting } from './site-settings.interface';
import { ICompanyConfigSuperAdminInfo } from './company-configuration-super-admin-info.interface';
import { ICompanyContactPersonInfo } from './company-configuration-contact-person-info.interface';
import { ISecuritySetting } from 'src/app/models/common/security-settings.interface';

export interface IRequest{
  pk: string;
  type: string;
  companyId: string;
  companyName: string;
  billingAddress: string;
  city: string;
  stateCode: string;
  zip: string;
  countryCode: string;
  phoneNumber: string;
  logoUrlPath: string;
  supportedLanguages: ILanguageDropdownList[];
  defaultLanguage: ILanguageDropdownList;
  tags: string[];
  smtpSetting: ISmtpSettings;
  smsConfigs: ISmsConfig[];
  purgeSettings: IPurgeSettings;
  securitySettings: ISecuritySetting;
  siteSettings: ISiteSetting;
  superAdminConfig: ICompanyConfigSuperAdminInfo;
  contactPerson: ICompanyContactPersonInfo;
  isDeleted: boolean;
  isActive: boolean;
  isValidSMTPSettings: boolean;
}
