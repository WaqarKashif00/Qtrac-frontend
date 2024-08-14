import { ICityDropDownList } from 'src/app/models/common/city-dropdown-list.interface';
import { ICountryDropdownList } from 'src/app/models/common/country-dropdown-list.interface';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IStateDropdownList } from 'src/app/models/common/state-dropdown-list.interface';
import { ILaviAddress } from 'src/app/shared/api-models/google-models/lavi-address.interface';
import { IDropdownList } from './dropdown-list.interface';
import { PrinterTemplate } from './printer-dropdown-list.interface';

export interface IGeneralSettings {
  branchId?: string;
  id?: string;
  name?: string;
  branchImg: string;
  address: string;
  country: ICountryDropdownList;
  state: IStateDropdownList;
  city: ICityDropDownList;
  latitude: string;
  longitude: string;
  phoneNumber: string;
  zip: string;
  defaultLanguage?: ILanguageDropdownList;
  supportedLanguages: ILanguageDropdownList[];
  branchSmsNumber?: IDropdownList;
  isCompanyGeneralSetting?: boolean;
  tags: string[];
  isActive: boolean;
  isDeleted: boolean;
  friendlyBranchName?: string;
  laviAddress: ILaviAddress;
  defaultPrinter:PrinterTemplate;
}
