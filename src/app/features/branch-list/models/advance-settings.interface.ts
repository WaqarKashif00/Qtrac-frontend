import { IHoursOfOperationDropdown } from 'src/app/models/common/hours-of-operation-dropdown.interface';
import { ILayoutTemplate } from './layout-template.interface';
export class IAdvanceSettings {
  hoursOfOperationException: IHoursOfOperationDropdown;
  hideBranchFromScheduler: boolean;
  textToJoinMobileInterface: ILayoutTemplate;
  enableTextToJoin: boolean;
  overridetwilioServiceId?: string;
}
