import { IConfiguration } from './configuration.interface';
import { DesignerPanelControl } from './controls/designer-panel.control';
import { NextUpControl } from './controls/next-up.control';
import { NowCallingControl } from './controls/now-calling.control';
import { NowHelpingControl } from './controls/now-helping.control';
import { DDLControl } from './drop-down-control.interface';
import { MonitorOtherControlsCountDetail } from './monitor-other-controls-count-details.interface';
export interface IPageData {
  designerScreen: DesignerPanelControl;
  allControls: IConfiguration;
  manageControls: Array<DDLControl>;
  nextUpControl: NextUpControl;
  nowCallingControl: NowCallingControl;
  nowHelpingControl: NowHelpingControl;
  controlsCount:MonitorOtherControlsCountDetail
}
