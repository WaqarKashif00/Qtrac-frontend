import { IDropdown } from './dropdownlist.interface';

export interface ICompanyAdvanceSettingInfo{
  isPurgeSensitiveInfo: boolean;
  purgeTime: string;
  purgeTimeInterval: IDropdown;
  applicationTimeout: string;
  applicationTimeInterval: IDropdown;
  adminTimeout: string;
  adminTimeInterval: IDropdown;
  logoutUrl: string;
  loginMode: IDropdown;
  isEnforceReCaptcha: boolean;
}
