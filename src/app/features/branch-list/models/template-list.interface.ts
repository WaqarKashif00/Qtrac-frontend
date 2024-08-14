import { IDropdownList } from './dropdown-list.interface';
import { IMobileInterface } from './mobile-interface.interface';
import { ITemplate } from './template-request.interface';

export interface ITemplateList{
  kioskList: Array<ITemplate>;
  monitorList: Array<ITemplate>;
  mobileInterfaceList: Array<IMobileInterface>;
  deskList: Array<IDropdownList>;
}
