import { IDropdown } from './dropdownlist.interface';

export interface ICompanyConfigCommunicationInfo{
  smtpServer: string;
  port: number;
  encryption: IDropdown;
  userName: string;
  password: string;
  displayName: string;
  smsTotalNumber: number;
  smsAssignedNumber: number;
  smsUnassignedNumber: number;
}
