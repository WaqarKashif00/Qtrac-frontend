import { IHoursOfOperationDropdown } from 'src/app/models/common/hours-of-operation-dropdown.interface';
import { IDropdownList } from './dropdown-list.interface';

export class IAdditionalSettings {
  hoursOfOperation: IHoursOfOperationDropdown;
  branchTimezone: IDropdownList;
  timeZone?: BranchTimeZone
}

export interface BranchTzDropDown extends IDropdownList {
  gmtValue: string;
}

export class BranchTimeZone {
  id: string;
}