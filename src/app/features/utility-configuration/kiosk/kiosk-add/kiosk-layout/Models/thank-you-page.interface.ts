import { IControlSelection } from './controls-selection.interface';
import { ButtonControl } from './controls/button.control';
import { ThankYouPanelControl } from './controls/thank-you-panel.control';
import { IKioskConfiguration } from './kiosk-configuration.interface';
import { KioskOtherControlsCountDetail } from './kiosk-other-controls-count-details.interface';

// tslint:disable-next-line: no-empty-interface
export interface IThankYouPage extends IKioskConfiguration {
  thankYouPanel: ThankYouPanelControl;
  buttons: ButtonControl[];
  otherControlCountData: KioskOtherControlsCountDetail;
  controlSelection: IControlSelection;
}
