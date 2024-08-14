import { ILayoutTemplate } from './layout-template.interface';

export interface IMobileListRequest{
  mobileInterfaceId: string;
  title: string;
  layoutTemplate: ILayoutTemplate;
  enableTextToRegister: boolean;
  smsKeywordUsedForTextToRegister: string;
  createdAt: string;
  createdBy: string;
}
