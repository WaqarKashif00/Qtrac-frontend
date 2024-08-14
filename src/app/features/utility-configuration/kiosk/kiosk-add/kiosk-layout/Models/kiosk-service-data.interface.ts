import { Interface } from 'readline';
import { IKioskServicePanelData } from './kiosk-service-panel-data.interface';
import { IKioskServiceItemsData } from './kiosk-service-items-data.interface';

export interface IKioskServiceData {
  servicePanel: IKioskServicePanelData;
  serviceItems: Array<IKioskServiceItemsData>;
}
