import { IControlSelection } from './controls-selection.interface';
import { ButtonControl } from './controls/button.control';
import { IKioskConfiguration } from './kiosk-configuration.interface';
import { KioskOtherControlsCountDetail } from './kiosk-other-controls-count-details.interface';

export interface INoQueuePage extends IKioskConfiguration{
  buttons: Array<ButtonControl>;
  otherControlCountData: KioskOtherControlsCountDetail;
  controlSelection: IControlSelection;
}
