import { IDropdown } from './dropdownlist.interface';
import { ILanguageDropdownList } from './language-dropdownlist.interface';
import { ICountryDropdownList } from './country-dropdown-list.interface';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';

export interface ICompanyConfigDropdownListData{
  countryList: ICountryDropdownList[];
  languageList: ILanguageDropdownList[];
  encryptionList: IDropdown[];
  timeIntervalList: IDropdown[];
  loginModeList: IDropdown[];
  branchList: IBranchDropdownDetails[];

}
