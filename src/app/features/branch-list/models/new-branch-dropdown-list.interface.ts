import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { IHoursOfOperationDropdown } from 'src/app/models/common/hours-of-operation-dropdown.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IDropdownList } from './dropdown-list.interface';
import { PrinterTemplate } from './printer-dropdown-list.interface';

export interface INewBranchDropdownList{
  countries: ICountryDropdownList[];
  languages: ILanguageDropdownList[];
  hoursOfOperation: IHoursOfOperationDropdown[];
  branchTimeZone: IDropdownList[];
  numberList: number[];
  timeIntervals: IDropdownList[];
  phoneNumberList: IDropdownList[];
  tags: string[];
  exceptionHoursOfOperations: IHoursOfOperationDropdown[];
  locationPrinters: PrinterTemplate[];
}
