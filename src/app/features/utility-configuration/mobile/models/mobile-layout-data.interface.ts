import { ILanguageControl } from '../../../../models/common/language-control.interface';
import { MobileOtherControlsCountDetail } from './mobile-other-controls-count-details.interface';
import { IMobileSliderControlPostPreview } from './mobile-slider-control-preview.interface';

export interface IMobileLayoutData {
  designerScreen: IMobileDesignerData;
  pageProperties: IMobilePageProperties;
  welcomePage: IMobileWelcomePageData;
  languagePage: IMobileLanguagePageData;
  globalQuestionPage: IMobilePreServiceQuestionPageData;
  servicePage: IMobileServicePageData;
  serviceQuestion: IMobileServiceQuestionPageData;
  thankYouPage: IMobileThankYouPageData;
  ticketPage: IMobileTicketPageData;
  surveyPage: IMobileSurveyPageData;
  marketingPage: IMobileMarketingPageData;
  noQueuePage: IMobileNoQueuePageData;
  headerData: IMobileHeaderData;
  footerData: IMobileFooterData;
  companyId: string;
  companyName?: string;
  enableMobileInterfaceRequeue?:boolean;
  offLinePage: IMobileOfflinePageData
}

export interface IMobilePageProperties {
  hideWelcomePage: boolean;
  hideThankYouPage: boolean;
}
export interface IMobileDesignerData {
  workFlowName: string;
  WorkFlowId: string;
  templateName: string;
  width: number;
  height: number;
  backGroundImage: string;
  templateId: string;
  color: string;
  backgroundColor: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  languageId: string;
  waitingTime: number;
  
}
export interface IMobileWelcomePageData extends IMobileOtherControlData {
  button: IMobileButtonData;
  otherControlsCount: MobileOtherControlsCountDetail;
}

export interface IMobileOfflinePageData extends IMobileOtherControlData {
  buttons: Array<IMobileButtonData>;
  otherControlsCount: MobileOtherControlsCountDetail;
}

export interface IMobileLanguagePageData extends IMobileOtherControlData {
  panel: IMobilePanelData;
  otherControlsCount: MobileOtherControlsCountDetail;

}
export interface IMobileSurveyPageData  extends IMobileOtherControlData {
  panel: IMobilePanelData;
  itemSet: Array<IMobileQuestionSetData>;
  button: IMobileButtonData;
  otherControlsCount: MobileOtherControlsCountDetail;
}
export interface IMobileMarketingPageData extends IMobileOtherControlData {
  otherControlsCount: MobileOtherControlsCountDetail;

}
export interface IMobileTicketPageData extends IMobileOtherControlData {
  panel: IMobilePanelData;
  buttons: IMobileButtonData[];
  items: IMobileTicketControlItemData[];
  otherControlsCount: MobileOtherControlsCountDetail;

}
export interface IMobileThankYouPageData extends IMobileOtherControlData {
  otherControlsCount: MobileOtherControlsCountDetail;
}
export interface IMobileNoQueuePageData extends IMobileOtherControlData {
  buttons: IMobileButtonData[];
  otherControlsCount: MobileOtherControlsCountDetail;
}
export interface IMobilePreServiceQuestionPageData
  extends IMobileOtherControlData {
  panel: IMobilePanelData;
  items: Array<IMobilePanelItemsData>;
  buttons: IMobileButtonData[];
  otherControlsCount: MobileOtherControlsCountDetail;

}
export interface IMobileServicePageData extends IMobileOtherControlData {
  panel: IMobilePanelData;
  items: Array<IMobilePanelItemsData>;
  buttons: IMobileButtonData[];
  otherControlsCount: MobileOtherControlsCountDetail;

}
export interface IMobileServiceQuestionPageData
  extends IMobileOtherControlData {
  panel: IMobilePanelData;
  itemSet: Array<IMobileQuestionSetData>;
  button: IMobileButtonData;
  otherControlsCount: MobileOtherControlsCountDetail;

}
export interface IMobilePanelData {
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
export interface IMobileButtonData {
  color: string;
  backgroundColor: string;
  boxCorner: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  text: object;
  name: string;
  top: number;
  showPrimaryButtonIcon: boolean;
  showSecondaryButtonIcon?: boolean;
  primaryButtonSrc: ILanguageControl[];
  border: string;
  borderColor: string;
  shadow: boolean;
  secondaryButtonSrc?: ILanguageControl[];
  verticalPadding?: string;
  horizontalPadding?: string;
  height?: number;
  width?: number;
  boxRoundCorners?: string;
  secondaryButtonText?: object;
  isPrimaryButton: boolean;
}
export interface IMobileQuestionSetData {
  itemSetId: string;
  itemSetName?: string;
  items: Array<IMobilePanelItemsData>;
}
export interface IMobilePanelItemsData {
  itemId: string;
  isItemSelected?: boolean;
}
export interface IMobileTicketControlData {
  color: string;
  backgroundColor: string;
  boxCorner: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  text: object;
  name: string;
  top: number;
  verticalPadding?: string;
  horizontalPadding?: string;
  height?: number;
  boxRoundCorners?: string;
}
export interface IMobileTicketControlItemData {
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
  showItem: boolean;
  valuesFont: string;
  valuesFontStyle: string;
  valuesFontSize: number;
  valuesFontWeight: number | string;
}
export interface IMobileOtherControlData {
  images: Array<IMobileImageControlData>;
  labels: Array<IMobileLabelControlData>;
  videos: Array<IMobileVideoControlData>;
  sliders: Array<IMobileSliderControlData>;
}
export interface IMobileLabelControlData {
  name: string;
  color: string;
  fontStyle: string;
  fontSize: number;
  font: string;
  text: object;
  hyperLink: string;
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
  fontWeight: number | string;
  verticalPadding: string;
  horizontalPadding: string;
  boxCorner: string;
  backgroundColor: string;
  alignment: string;
}
export interface IMobileFooterData {
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
export interface IMobileHeaderData {
  backGroundImage: string;
  isVisible: boolean;
  verticalPadding: string;
  horizontalPadding: string;
  logoPosition: string;
  height: string;
}
export interface IMobileThankYouControlData {
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
export interface IMobileImageControlData {
  name: string;
  src: ILanguageControl[];
  hyperLink: string;
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
  verticalPadding: string;
  horizontalPadding: string;
  boxCorner: string;
}
export interface IMobileVideoControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
  verticalPadding: string;
  horizontalPadding: string;
  boxCorner: string;
}
export interface IMobileSliderControlData {
  name: string;
  src: IMobileSliderControlPostPreview[];
  urls: IMobileSliderControlPostPreview[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
  verticalPadding: string;
  horizontalPadding: string;
  boxCorner: string;
}
