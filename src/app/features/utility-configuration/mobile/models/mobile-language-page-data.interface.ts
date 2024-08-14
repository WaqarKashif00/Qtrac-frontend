import { PanelControl } from './controls/panel.control';
import { IMobileControlSelection } from './mobile-control-selection.interface';
import { MobileOtherControlsCountDetail } from './mobile-other-controls-count-details.interface';
import { IMobileOtherControls } from './mobile-other-controls.interface';

export interface ILanguagePageData extends IMobileOtherControls {
  panel: PanelControl;
  otherControlsCount: MobileOtherControlsCountDetail;
  controlSelection: IMobileControlSelection;
}
