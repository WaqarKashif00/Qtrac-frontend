import { ILanguageControl } from '../../../../../../models/common/language-control.interface';
import { IHomeInterfaceOtherControlsCountDetail } from './home-interface-other-controls-count-details.interface';
import { IHomeInterfaceSliderControlPreview } from './home-interface-slider-control-preview.interface';

export interface IHomeInterfaceLayoutData {
  designerScreen: IHomeInterfaceDesignerData;
  homeInterfacePageData: IHomeInterfacePageData;
  branchMonitorLanguageCode?: string;
  defaultBranchLanguageCode?: string;
  companyId: string;
}
export interface IHomeInterfaceDesignerData {
  templateId: string;
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
  showGrid: boolean;
  cellSize: number;
}
export interface IHomeInterfacePageData extends IHomeInterfaceOtherControlData {
  otherControlsCount: IHomeInterfaceOtherControlsCountDetail;
}

export interface IHomeInterfaceDefaultControlData {
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
}
export interface IHomeInterfaceOtherControlData {
  images: Array<IHomeInterfaceImageControlData>;
  labels: Array<IHomeInterfaceLabelControlData>;
  videos: Array<IHomeInterfaceVideoControlData>;
  sliders: Array<IHomeInterfaceSliderControlData>;
}
export interface IHomeInterfaceLabelControlData {
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
}
export interface IHomeInterfaceImageControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IHomeInterfaceVideoControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IHomeInterfaceSliderControlData {
  name: string;
  src: IHomeInterfaceSliderControlPreview[];
  utls: IHomeInterfaceSliderControlPreview[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
