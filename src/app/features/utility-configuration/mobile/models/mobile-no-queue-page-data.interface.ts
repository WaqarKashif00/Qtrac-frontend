import { ButtonControl } from './controls/button.control';
import { IMobileControlSelection } from './mobile-control-selection.interface';
import { MobileOtherControlsCountDetail } from './mobile-other-controls-count-details.interface';
import { IMobileOtherControls } from './mobile-other-controls.interface';

export interface INoQueuePageData extends IMobileOtherControls {
  buttons: ButtonControl[];
  otherControlsCount: MobileOtherControlsCountDetail;
  controlSelection: IMobileControlSelection;
}
