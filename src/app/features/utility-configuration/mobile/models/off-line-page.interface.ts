import { IMobileControlSelection } from './mobile-control-selection.interface';
import { ButtonControl } from './controls/button.control';
import { MobileOtherControlsCountDetail } from './mobile-other-controls-count-details.interface';
import { IMobileOtherControls } from './mobile-other-controls.interface';

export interface IOffLinePage extends IMobileOtherControls {
  buttons: ButtonControl[];
  otherControlsCount: MobileOtherControlsCountDetail;
  controlSelection: IMobileControlSelection;
}
