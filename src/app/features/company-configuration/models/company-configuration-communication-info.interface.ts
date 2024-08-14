import { IDropdown } from './dropdownlist.interface';

export interface ICompanyConfigCommunicationInfo{
  serviceProvider: string| IDropdown;
  smtpServer: string;
  port: number;
  encryption: IDropdown;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  sendGridAPIKey: string;
  userName: string;
  password: string;
  displayName: string;
  smsTotalNumber: number;
  smsAssignedNumber: number;
  smsUnassignedNumber: number;
}
