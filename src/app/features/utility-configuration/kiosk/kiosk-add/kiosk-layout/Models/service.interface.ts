import { ServiceBoxControl } from './controls/service-box.control';
import { ServiceDDL } from './servies-drop-down.interface';
import { IKioskConfiguration } from './kiosk-configuration.interface';
import { ServicePanelControl } from './controls/service-panel.control';
import { KioskOtherControlsCountDetail } from './kiosk-other-controls-count-details.interface';
import { ButtonControl } from './controls/button.control';
import { IControlSelection } from './controls-selection.interface';

export interface IService extends IKioskConfiguration {
  items: Array<ServiceBoxControl>;
  dropDownList: Array<ServiceDDL>;
  panel: ServicePanelControl;
  buttons: ButtonControl[];
  otherControlCountData: KioskOtherControlsCountDetail;
  controlSelection: IControlSelection;
}
