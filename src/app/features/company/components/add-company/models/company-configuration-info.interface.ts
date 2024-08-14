import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ICountryDropdownList } from './country-dropdown-list.interface';
import { ILanguageDropdownList } from './language-dropdownlist.interface';
import { IStateDropdownList } from './state-dropdown-list.interface';

export interface ICompanyConfigurationInfo{
  id: string;
  companyName: string;
  billingAddress: string;
  companyImg: string;
  phoneNumber: string;
  country: ICountryDropdownList;
  city: ICityDropDownList;
  state: IStateDropdownList;
  zip: string;
  defaultLanguage: ILanguageDropdownList;
  supportedLanguage: ILanguageDropdownList[];
  tags: string[];
  isDeleted: boolean;
  isActive: boolean;
  isValidSMTPSettings: boolean;
}
