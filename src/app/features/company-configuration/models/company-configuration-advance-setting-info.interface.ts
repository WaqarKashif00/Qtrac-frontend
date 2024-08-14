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
  endOfDayTimeFormControl:Date;
  loginMode: IDropdown;
  isEnforceReCaptcha: boolean;
}
