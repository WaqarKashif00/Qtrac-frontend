import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { ISecuritySetting } from 'src/app/models/common/security-settings.interface';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { ICompanyContactPersonInfo } from './company-configuration-contact-person-info.interface';
import { ICompanyConfigSuperAdminInfo } from './company-configuration-super-admin-info.interface';
import { IPurgeSettings } from './purge-settings.interface';
import { ISiteSetting } from './site-settings.interface';
import { ISmsConfig } from './sms-config.interface';
import { ISmtpSettings } from './smtp-settings.interface';

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
  isActive: boolean;
  isValidSMTPSettings: boolean;
  isDeleted: boolean;
  smtpSetting: ISmtpSettings;
  smsConfigs: ISmsConfig[] ;
  purgeSettings: IPurgeSettings ;
  securitySettings: ISecuritySetting ;
  siteSettings: ISiteSetting;
  superAdminConfig: ICompanyConfigSuperAdminInfo;
  contactPerson: ICompanyContactPersonInfo;
  tags: string[];
  address: string;
  laviAddress:ILaviAddress;
}