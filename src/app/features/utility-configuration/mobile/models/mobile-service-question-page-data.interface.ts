import { ButtonControl } from './controls/button.control';
import { PanelControl } from './controls/panel.control';
import { IMobileControlSelection } from './mobile-control-selection.interface';
import { IMobileQuestionSetData } from './mobile-layout-data.interface';
import { MobileOtherControlsCountDetail } from './mobile-other-controls-count-details.interface';
import { IMobileOtherControls } from './mobile-other-controls.interface';

export interface IServiceQuestionPageData extends IMobileOtherControls {
  panel: PanelControl;
  button: ButtonControl;
  questionSetList: IMobileQuestionSetData[];
  otherControlsCount: MobileOtherControlsCountDetail;
  controlSelection: IMobileControlSelection;
}
