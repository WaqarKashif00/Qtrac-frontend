import { ILanguageControl } from '../../../../models/common/language-control.interface';
import { IMobileSliderControlPostPreview } from './mobile-slider-control-preview.interface';

export interface IMobilePreviewData {
  designerScreen: IMobilePreviewDesignerData;
  welcomePage: IMobilePreviewWelcomePageData;
  languagePAge: IMobilePreviewLanguagePageData;
  globalQuestionPage: IMobilePreviewPreServiceQuestionPageData;
  servicePage: IMobilePreviewServicePageData;
  serviceQuestion: IMobilePreviewServiceQuestionPageData;
  thankYouPage: IMobilePreviewThankYouPageData;
  ticketPage: IMobilePreviewTicketPageData;
  surveyPage: IMobilePreviewSurveyPageData;
  marketingPage: IMobilePreviewMarketingPageData;
  noQueuePage: IMobilePreviewNoQueuePageData;
  headerData: IMobilePreviewHeaderData;
  footerData: IMobilePreviewFooterData;
  companyName: string;
  offlinePage: IMobilePreviewOfflinePageData;
}
export interface IMobilePreviewDesignerData {
  width: number;
  height: number;
  backGroundImage: string;
  color: string;
  backgroundColor: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  languageId: string;
  waitingTime: number;
}
export interface IMobilePreviewNoQueuePageData
  extends IMobilePreviewOtherControlData {
  buttons: IMobilePreviewButtonData[];
}

export interface IMobilePreviewOfflinePageData
  extends IMobilePreviewOtherControlData {
  buttons: IMobilePreviewButtonData[];
}

export interface IMobilePreviewWelcomePageData
  extends IMobilePreviewOtherControlData {
  button: IMobilePreviewButtonData;
}
export interface IMobilePreviewLanguagePageData
  extends IMobilePreviewOtherControlData {
  panel: IMobilePreviewPanelData;
  items: Array<IMobilePreviewPanelItemsData>;
}
export interface IMobilePreviewSurveyPageData
  extends IMobilePreviewOtherControlData {

    panel: IMobilePreviewPanelData;
    items: Array<IMobilePreviewPanelQItemsData>;
    button: IMobilePreviewButtonData;
}
export interface IMobilePreviewMarketingPageData
  extends IMobilePreviewOtherControlData { }
export interface IMobilePreviewTicketPageData
  extends IMobilePreviewOtherControlData {
  panel: IMobilePreviewPanelData;
  buttonPanel: IMobilePreviewButtonData[];
  items: IMobilePreviewTicketItemData[];
}
export interface IMobilePreviewTicketItemData {
  type: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  text: object;
  visible: boolean;
  value: string;
  color: string;
  backgroundColor: string;
  horizontalPadding: string;
  boxRoundCorners: string;
  verticalPadding: string;
  height: number;
  width: number;
  index?: number;
}
export interface IMobilePreviewThankYouPageData
  extends IMobilePreviewOtherControlData {
}
export interface IMobilePreviewPreServiceQuestionPageData
  extends IMobilePreviewOtherControlData {
  panel: IMobilePreviewPanelData;
  items: Array<IMobilePreviewPanelQItemsData>;
  buttons: IMobilePreviewButtonData[];
}
export interface IMobilePreviewServicePageData
  extends IMobilePreviewOtherControlData {
  panel: IMobilePreviewPanelData;
  items: Array<IMobilePreviewPanelItemsData>;
  buttons: IMobilePreviewButtonData[];
}
export interface IMobilePreviewServiceQuestionPageData
  extends IMobilePreviewOtherControlData {
  id: string;
  panel: IMobilePreviewPanelData;
  items: Array<IMobilePreviewPanelQItemsData>;
  button: IMobilePreviewButtonData;
}
export interface IMobilePreviewPanelData {
  top: number;
  left: number;
  width: number;
  height: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  horizontalPadding: string;
  verticalPadding: string;
  boxCorner: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  showServiceIcons?: boolean;
}
export interface IMobilePreviewButtonData {
  color: string;
  backgroundColor: string;
  boxCorner: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  text: object;
  verticalPadding?: string;
  horizontalPadding?: string;
  height?: number;
  boxRoundCorners?: string;
  name: string;
  top: number;
  secondaryButtonText?: object;
  showPrimaryButtonIcon: boolean;
  showSecondaryButtonIcon?: boolean;
  primaryButtonSrc: ILanguageControl[];
  secondaryButtonSrc?: ILanguageControl[];
  isPrimaryButton: boolean;
  border: string;
  borderColor: string;
  shadow: boolean;
}
export interface IMobilePreviewQuestionSetData {
  itemSetId: string;
  items: Array<IMobilePreviewPanelQItemsData>;
}
export interface IMobilePreviewPanelQItemsData {
  itemId: string;
  isItemSelected?: boolean;
  required: boolean;
  answer: string;
  visible: boolean;
  itemType: string;
  itemTypeSetting: any;
  itemText: string;
  isValid?: boolean;
}
export interface IMobilePreviewPanelItemsData {
  itemId: string;
  isItemSelected?: boolean;
  itemText: string;
  itemIcon?: string;
  isActive?: boolean;
}
export interface IMobilePreviewOtherControlData {
  images: Array<IMobilePreviewImageControlData>;
  labels: Array<IMobilePreviewLabelControlData>;
  videos: Array<IMobilePreviewVideoControlData>;
  sliders: Array<IMobilePreviewSliderControlData>;
}
export interface IMobilePreviewLabelControlData {
  name: string;
  color: string;
  fontStyle: string;
  fontSize: number;
  font: string;
  text: object;
  top: number;
  left: number;
  width: number;
  height: number;
  fontWeight: number | string;
  verticalPadding: string;
  horizontalPadding: string;
  boxCorner: string;
  backgroundColor: string;
}
export interface IMobilePreviewFooterData {
  color: string;
  fontStyle: string;
  fontSize: number;
  font: string;
  fontWeight: number | string;
  footerImage: string;
  text: object;
  isVisible: boolean;
  isTextVisible: boolean;
  isFooterImageVisible: boolean;
  isLogoVisible: boolean;
  footerLogo: string;
}
export interface IMobilePreviewHeaderData {
  backGroundImage: string;
  isVisible: boolean;
  verticalPadding?: string;
  horizontalPadding?: string;
  logoPosition: string;
  height: string
}
export interface IMobilePreviewThankYouControlData {
  color: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  text: string;
  top: number;
  left: number;
  width: number;
  height: number;
  messageDisplayTimeInSeconds: number;
}
export interface IMobilePreviewImageControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  verticalPadding: string;
  horizontalPadding: string;
  boxCorner: string;
}
export interface IMobilePreviewVideoControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  verticalPadding: string;
  horizontalPadding: string;
  boxCorner: string;
}
export interface IMobilePreviewSliderControlData {
  name: string;
  src: IMobileSliderControlPostPreview[];
  urls: IMobileSliderControlPostPreview[];
  top: number;
  left: number;
  width: number;
  height: number;
  verticalPadding: string;
  horizontalPadding: string;
  boxCorner: string;
}
