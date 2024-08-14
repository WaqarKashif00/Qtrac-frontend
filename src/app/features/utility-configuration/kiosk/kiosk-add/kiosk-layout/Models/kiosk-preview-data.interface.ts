import { ILanguageControl } from '../../../../../../models/common/language-control.interface';
import { IKioskSliderControlData } from './kiosk-layout-data.interface';

export interface IKioskPreviewData {
  designer: IKioskDesignerData;
  welcomePage: IKioskWelcomePageData;
  preServiceQuestionPage: IKioskPreviewPageData;
  servicePage: IKioskPreviewPageData;
  serviceQuestion: IKioskPreviewPageData;
  thankYouPage: IKioskThankYouPageData;
  offLinePage: IKioskOffLinePageData;
  languagePage: IKioskLanguagePageData;
  noQueuePage: IKioskNoQueuePageData;
}
export interface IKioskDesignerData {
  WorkFlowId: string;
  width: number;
  height: number;
  backGroundImage: string;
  color: string;
  backgroundColor: string;
  fontStyle: string;
  fontSize: number;
  font: string;
  fontWeight: string | number;
  enableVirtualKeyboard : boolean;
  waitingTime: number;
}
export interface IKioskWelcomePageData extends IKioskOtherControlData {
  buttons: IKioskButtonControlData[];
}
export interface IKioskNoQueuePageData extends IKioskOtherControlData {
  buttons: IKioskButtonControlData[];
}
export interface IKioskThankYouPageData extends IKioskOtherControlData {
  thankYouControl: IKioskThankYouData;
  buttons: IKioskButtonControlData[];
}
export interface IKioskOffLinePageData extends IKioskOtherControlData {
  buttons: IKioskButtonControlData[];
}

export interface IKioskLanguagePageData extends IKioskOtherControlData {
  panel: IKioskLanguagePanelData;
}
export interface IKioskPreviewPageData extends IKioskOtherControlData {
  id: string;
  panel: IKioskPanelData;
  items: Array<IKioskPanelItemsData>;
}

export interface IKioskPanelData {
  questionDisplayMode: number;
  top: number;
  left: number;
  width: number;
  height: number;
  backgroundColor: string;
  horizontalPadding: number;
  verticalPadding: number;
  fontSize: number;
  font: string;
  fontStyle: string;
  fontWeight: string | number;
  showServiceIcons?: boolean;
}

export interface IKioskThankYouData {
  items: IKioskThankYouItemData[];
  top: number;
  left: number;
  width: number;
  height: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  horizontalPadding: number;
  verticalPadding: number;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  messageDisplayTimeInSeconds: number;
  itemBackgroundColor: string;
}

export interface IKioskPanelItemsData {
  selected: boolean;
  itemId: string;
  itemText: string;
  itemTypeSetting: any;
  itemType: string;
  color: string;
  backgroundColor: string;
  fontStyle: string;
  fontSize: number;
  font: string;
  fontWeight: string | number;
  answer: any;
  required: boolean;
  isVisible?: boolean;
  isValid?:boolean;
  itemIcon?: string;
  isActive?: boolean;
}
export interface IKioskOtherControlData {
  images: Array<IKioskImageControlData>;
  labels: Array<IKioskLabelControlData>;
  videos: Array<IKioskVideosControlData>;
  sliders: Array<IKioskSliderControlData>;
  buttons: Array<IKioskButtonControlData>;
}
export interface IKioskLabelControlData {
  name: string;
  color: string;
  fontStyle: string;
  fontSize: number;
  font: string;
  fontWeight: string | number;
  text: object;
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IKioskImageControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IKioskVideosControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IKioskButtonControlData {
  name: string;
  color: string;
  backgroundColor: string;
  fontStyle: string;
  fontSize: number;
  font: string;
  fontWeight: string | number;
  width: number;
  height: number;
  text: object;
  showButton: boolean;
  left: number;
  top: number;
  showIcon: boolean;
  src: ILanguageControl[];
  border: string;
  borderColor: string;
  shadow: boolean;
  boxRoundCorners: string;
}
export interface IKioskThankYouItemData {
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  text: object;
  visible: boolean;
  value: string;
  index?: number;
  type: string;
}

export interface IKioskLanguagePanelData {
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
  backgroundColor: string;
  horizontalPadding: number;
  verticalPadding: number;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  itemBackgroundColor: string;
}
