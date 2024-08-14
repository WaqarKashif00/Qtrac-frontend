import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IDropdown } from './dropdownlist.interface';

export interface ICompanyConfigDropdownListData {
  countryList: ICountryDropdownList[];
  languageList: ILanguageDropdownList[];
  encryptionList: IDropdown[];
  timeIntervalList: IDropdown[];
  loginModeList: IDropdown[];
  tagList: string[];
  branchList: IBranchDropdownDetails[];
}
