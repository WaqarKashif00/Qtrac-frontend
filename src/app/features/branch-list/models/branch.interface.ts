import { IAdditionalSettings } from './additional-settings.interface';
import { IAdvanceSettings } from './advance-settings.interface';
import { IContactPerson } from './contact-person.interface';
import { IGeneralSettings } from './general-settings.interface';
import { IKioskList } from './kiosk-list.interface';
import { IMonitorList } from './monitor-list.interface';
import { IWorkFlowUsedInBranchList } from './workflow-used-in-branch-list.interface';

export interface IBranch {
  generalSettings: IGeneralSettings;
  contactPerson?: IContactPerson[];
  workFlowUsedInBranches?: IWorkFlowUsedInBranchList[];
  additionalSettings: IAdditionalSettings;
  advanceSettings: IAdvanceSettings;
  kiosks?: IKioskList[];
  monitors?: IMonitorList[];
  branchId?: string
  branchName?: string
   // desks?: IDeskList[]
}
