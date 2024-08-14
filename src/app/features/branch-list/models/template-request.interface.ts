import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { ILayoutTemplate } from './layout-template.interface';
import { PrinterTemplate } from './printer-dropdown-list.interface';
export interface ITemplate{
  id: string;
  title: string;
  name: ILayoutTemplate;
  deviceId: string;
  deviceName?: string;
  status: number | string;
  browserId: string;
  languageCode?: string;
  defaultLanguageCode?: string;
  mobileInterface: ILayoutTemplate;
  assignedPrinter?: PrinterTemplate;
  assignedPrinterId?: string
}
