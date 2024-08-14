import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IStateDropdownList } from 'src/app/models/common/state-dropdown-list.interface';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';

export interface ICompanyConfigurationInfo {
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
  address: string;
  laviAddress: ILaviAddress;
}