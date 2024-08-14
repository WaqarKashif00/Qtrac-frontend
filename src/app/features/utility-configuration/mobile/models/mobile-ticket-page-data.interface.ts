import { ButtonControl } from './controls/button.control';
import { TicketControl } from './controls/ticket-control';
import { IMobileControlSelection } from './mobile-control-selection.interface';
import { MobileOtherControlsCountDetail } from './mobile-other-controls-count-details.interface';
import { IMobileOtherControls } from './mobile-other-controls.interface';

export interface ITicketPageData extends IMobileOtherControls {
  panel: TicketControl;
  buttonPanel: ButtonControl[];
  otherControlsCount: MobileOtherControlsCountDetail;
  controlSelection: IMobileControlSelection;
}
