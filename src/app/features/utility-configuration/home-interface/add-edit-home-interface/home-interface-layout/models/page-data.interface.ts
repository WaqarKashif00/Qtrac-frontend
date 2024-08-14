import { IConfiguration } from './configuration.interface';
import { DesignerPanelControl } from './controls/designer-panel.control';
import { DDLControl } from './drop-down-control.interface';
import { IHomeInterfaceOtherControlsCountDetail } from './home-interface-other-controls-count-details.interface';

export interface IPageData {
  designerScreen: DesignerPanelControl;
  allControls: IConfiguration;
  manageControls: Array<DDLControl>;
  controlsCount: IHomeInterfaceOtherControlsCountDetail;
}
