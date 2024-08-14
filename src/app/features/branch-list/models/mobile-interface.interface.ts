import { IDropdown } from '../../company-configuration/models/dropdownlist.interface';
import { ILayoutTemplate } from './layout-template.interface';

export interface IMobileInterface{
  id: string;
  title: string;
  smsInterfaceKey?: string;
  name: ILayoutTemplate;
  isEnableText?: boolean;
}
