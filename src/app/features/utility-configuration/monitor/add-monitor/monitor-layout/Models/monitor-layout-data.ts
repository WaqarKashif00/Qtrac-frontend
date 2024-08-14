import { ILanguageControl } from '../../../../../../models/common/language-control.interface';
import { MonitorOtherControlsCountDetail } from './monitor-other-controls-count-details.interface';
import { IMonitorSliderControlPreview } from './monitor-slider-control-preview.interface';

export interface IMonitorLayoutData {
  designerScreen: IMonitorDesignerData;
  monitorPageData: IMonitorPageData;
  branchMonitorLanguageCode?: string;
  defaultBranchLanguageCode?: string;
  companyId: string;
}
export interface IMonitorDesignerData {
  queueType: string;
  selectedQueues: string[];
  textToSpeachTimer: any;
  templateId: string;
  workFlowName: string;
  workFlowId: string;
  templateName: string;
  width: number;
  height: number;
  backGroundImageSrc: string;
  color: string;
  backgroundColor: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  showNextUpPanel: boolean;
  showNowCallingPanel: boolean;
  showNowHelpingPanel: boolean;
  showGrid: boolean;
  cellSize: number;
  enableSoundAlert: boolean;
  enableTextToSpeech:boolean;
}
export interface IMonitorPageData extends IMonitorOtherControlData {
  nextUp: IMonitorNextUpData;
  nowCalling: IMonitorNowCallingData;
  nowHelping: IMonitorNowHelpingData;
  otherControlsCount: MonitorOtherControlsCountDetail;
}

export interface IMonitorNextUpData extends IMonitorDefaultControlData {
  columnTwo: any;
  columnOne: any;
  displayNoOfCustomers: number;
}
export interface IMonitorNowHelpingData extends IMonitorDefaultControlData {
  columnOne: any;
  columnTwo: any;
}
export interface IMonitorNowCallingData extends IMonitorDefaultControlData {
  columnOne: any;
  columnTwo: any;
}
export interface IMonitorDefaultControlData {
  text: object;
  backgroundColor: string;
  color: string;
  boxShadow: boolean;
  boxRoundCorners: string;
  titleFont: string;
  titleFontSize: number;
  titleFontStyle: string;
  titleTextColor: string;
  titleFontWeight: number | string;
  font: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number | string;
  height: number;
  width: number;
  top: number;
  left: number;
  backgroundImageURL: string;
  isTextToSpeachEnable?: boolean;
}
export interface IMonitorOtherControlData {
  images: Array<IMonitorImageControlData>;
  labels: Array<IMonitorLabelControlData>;
  videos: Array<IMonitorVideoControlData>;
  sliders: Array<IMonitorSliderControlData>;
}
export interface IMonitorLabelControlData {
  PublicStoragePath?: any;
  isTextToSpeachEnable: boolean;
  name: string;
  color: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  text: object;
  top: number;
  left: number;
  width: number;
  height: number;
  alignment: string;
  zindex: number;
  backgroundColor: string;
}
export interface IMonitorImageControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IMonitorVideoControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IMonitorSliderControlData {
  name: string;
  src: IMonitorSliderControlPreview[];
  utls: IMonitorSliderControlPreview[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
