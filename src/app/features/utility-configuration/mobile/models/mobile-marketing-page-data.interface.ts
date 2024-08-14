import { IMobileControlSelection } from './mobile-control-selection.interface';
import { MobileOtherControlsCountDetail } from './mobile-other-controls-count-details.interface';
import { IMobileOtherControls } from './mobile-other-controls.interface';

export interface IMarketingPageData extends IMobileOtherControls {
  otherControlsCount: MobileOtherControlsCountDetail;
  controlSelection: IMobileControlSelection;
}
