import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { IDeskList } from './desk-list.interface';
import { IKioskList } from './kiosk-list.interface';
import { IMobileListRequest } from './mobile-interface-request.interface';
import { IMonitorList } from './monitor-list.interface';
import { IWorkFlowUsedInBranchList } from './workflow-used-in-branch-list.interface';

export interface IRequest {
  companyId: string;
  branchId: string;
  externalBranchId: string;
  branchName: string;
  logoUrlPath: string;
  address: string;
  laviAddress: ILaviAddress;
  countryCode: string;
  stateCode: string;
  cityCode: string;
  city: string;
  smsPhoneNumber: {id: string, phoneNumber: string};
  phoneNumber: string;
  zip: string;
  latitude: string;
  longitude: string;
  defaultLanguage?: ILanguageDropdownList;
  supportedLanguages: ILanguageDropdownList[];
  tags: string[];
  friendlyBranchName: string;
  isActive: boolean;
  contactPersonSameAsCompany: boolean;
  contactPerson: {
    firstName: string;
    lastName: string;
    roleInCompany: string;
    officeNumber: string;
    extension: string;
    purposes: string[];
    cellPhoneNumber: string;
    emailAddress: string;
  };
  workFlowUsedInBranchList: IWorkFlowUsedInBranchList[];
  additionalSettings: { hoursOfOperationId: string,
  timeZone: branchTimeZone};
  sameAsCompany: boolean;
  kiosks?: IKioskList[];
  monitors?: IMonitorList[];
  desks?: IDeskList[];
  mobileInterface?: IMobileListRequest[];
  advanceSettings: {
    hoursOfOperationExceptionId: string;
    hideBranchFromScheduler : boolean;
    textToJoinMobileInterfaceId:string;
    enableTextToJoin: boolean;
  };
  defaultPrinterId: string;
}

export interface branchTimeZone{
  id:string;
  valueGMT:string
}
