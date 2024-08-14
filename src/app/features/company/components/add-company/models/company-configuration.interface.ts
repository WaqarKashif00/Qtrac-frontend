import { ICompanyConfigurationInfo } from './company-configuration-info.interface';
import { ICompanyConfigCommunicationInfo } from './company-configuration-communication-info.interface';
import { ICompanyAdvanceSettingInfo } from './company-configuration-advance-setting-info.interface';
import { ICompanyConfigSuperAdminInfo } from './company-configuration-super-admin-info.interface';
import { ICompanyContactPersonInfo } from './company-configuration-contact-person-info.interface';

export interface ICompanyConfiguration{
  companyConfigurationInfo: ICompanyConfigurationInfo;
  companyCommunicationInfo: ICompanyConfigCommunicationInfo;
  companyAdvanceSettingInfo: ICompanyAdvanceSettingInfo;
  companySuperAdminInfo: ICompanyConfigSuperAdminInfo;
  companyContactPersonInfo: ICompanyContactPersonInfo;
}
