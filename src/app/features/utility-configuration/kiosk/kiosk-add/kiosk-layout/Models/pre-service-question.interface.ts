import { ServiceBoxControl } from './controls/service-box.control';
import { ServicePanelControl } from './controls/service-panel.control';
import { ServiceDDL } from './servies-drop-down.interface';
import { IKioskConfiguration } from './kiosk-configuration.interface';
import { IQuestionSet } from './question-set.interface';
import { ButtonControl } from './controls/button.control';
import { KioskOtherControlsCountDetail } from './kiosk-other-controls-count-details.interface';
import { IControlSelection } from './controls-selection.interface';

export interface IPreServiceQuestion extends IKioskConfiguration {
  items: Array<ServiceBoxControl>; // Dipesh: Change the type
  dropDownList: Array<ServiceDDL>; // Dipesh: Change the type
  panel: ServicePanelControl; // Dipesh: Change the type
  questionSetList: Array<IQuestionSet>;
  buttonList: Array<ButtonControl>;
  otherControlCountData: KioskOtherControlsCountDetail;
  controlSelection: IControlSelection;
}
