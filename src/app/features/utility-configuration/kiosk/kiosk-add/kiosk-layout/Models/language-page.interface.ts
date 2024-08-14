import { IControlSelection } from './controls-selection.interface';
import { LanguagePanelControl } from './controls/language-panel-control';
import { IKioskConfiguration } from './kiosk-configuration.interface';
import { KioskOtherControlsCountDetail } from './kiosk-other-controls-count-details.interface';

export interface ILanguagePage extends IKioskConfiguration {
  panel: LanguagePanelControl;
  otherControlCountData: KioskOtherControlsCountDetail;
  controlSelection: IControlSelection;
}
