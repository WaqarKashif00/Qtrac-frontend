import { AppointmentTemplate } from 'src/app/features/work-flow/models/work-flow-request.interface';
import { ServiceOccur } from 'src/app/models/common/work-flow-detail.interface';
import { IWorkingDaysAndDates } from "src/app/features/work-flow/models/work-flow-response.interface";
import { ILanguageControl } from '../../../../../../models/common/language-control.interface';
import { KioskOtherControlsCountDetail } from './kiosk-other-controls-count-details.interface';
import { ISliderControlPostPreview, ISliderControlPreview } from './slider-control-preview.interface';

export interface IKioskLayoutData {
  designerScreen: IKioskDesignerData;
  pageProperties: IKioskPageProperties;
  languagePage: IKioskLanguagePageData;
  welcomePage: IKioskWelcomePageData;
  preServiceQuestionPage: IKioskPreServiceQuestionPageData;
  servicePage: IKioskServicePageData;
  serviceQuestion: IKioskServiceQuestionPageData;
  thankYouPage: IKioskThankYouPageData;
  noQueuePage: IKioskNoQueuePageData;
  offLinePage: IKioskOffLinePageData;
  companyId: string;
  mobileInterfaceId?: string;
}
export interface IKioskDesignerData {
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
  cellSize: number;
  showGrid: boolean;
  enableVirtualKeyboard : boolean;
  waitingTime: number;
}

export interface IKioskPageProperties {
  hideWelcomePage: boolean;
}
export interface IKioskLanguagePageData extends IKioskOtherControlData {
  panel: IKioskLanguageControlData;
  controlsCount: KioskOtherControlsCountDetail;
}
export interface IKioskWelcomePageData extends IKioskOtherControlData {
  controlsCount: KioskOtherControlsCountDetail;
}

export interface IKioskNoQueuePageData extends IKioskOtherControlData {
  controlsCount: KioskOtherControlsCountDetail;
}

export interface IKioskOffLinePageData extends IKioskOtherControlData {
  controlsCount: KioskOtherControlsCountDetail;
}
export interface IKioskThankYouPageData extends IKioskOtherControlData {
  panel: IKioskThankYouControlData;
  buttons: IKioskButtonControlData[];
  controlsCount: KioskOtherControlsCountDetail;
}
export interface IKioskPreServiceQuestionPageData
  extends IKioskOtherControlData {
  buttons: IKioskButtonControlData[];
  panel: IKioskPanelData;
  questions: Array<IKioskPanelItemsData>;
  controlsCount: KioskOtherControlsCountDetail;
}
export interface IKioskServicePageData extends IKioskOtherControlData {
  panel: IKioskPanelData;
  services: Array<IKioskPanelItemsData>;
  controlsCount: KioskOtherControlsCountDetail;

}
export interface IKioskServiceQuestionPageData extends IKioskOtherControlData {
  buttons: IKioskButtonControlData[];
  panel: IKioskPanelData;
  questionSet: Array<IKioskQuestionSetData>;
  controlsCount: KioskOtherControlsCountDetail;

}
export interface IKioskPanelData {
  questionDisplayMode: number;
  top: number;
  left: number;
  width: number;
  height: number;
  backgroundColor: string;
  color: string;
  horizontalPadding: number;
  verticalPadding: number;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  textBackgroundColor?: string;
  showServiceIcons?: boolean;
}
export interface IKioskQuestionSetData {
  questionSetId: string;
  questions: Array<IKioskPanelItemsData>;
}
export interface IKioskPanelItemsData {
  questionId: string;
  color: string;
  backgroundColor: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number | string;
  font: string;
  isItemSelected?: boolean;
  isVisible?: boolean;
}
export interface IKioskOtherControlData {
  images: Array<IKioskImageControlData>;
  labels: Array<IKioskLabelControlData>;
  videos: Array<IKioskVideoControlData>;
  sliders: Array<IKioskSliderControlData>;
  buttons?: Array<IKioskButtonControlData>;
}
export interface IKioskLabelControlData {
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
  zindex: number;
  fontWeight: number | string;
  alignment: string;
  backgroundColor:string;
}
export interface IKioskThankYouControlData {
  items: IKioskThankYouControlItemData[];
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
export interface IKioskImageControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IKioskVideoControlData {
  name: string;
  src: ILanguageControl[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}
export interface IKioskSliderControlData {
  name: string;
  src: ISliderControlPostPreview[];
  utls: ISliderControlPreview[];
  top: number;
  left: number;
  width: number;
  height: number;
  zindex: number;
}

export interface IWorkFlowSetting {
  clearTicketsEndOfTheDay: boolean;
  allowTransferBetweenServices: boolean;
  allowTransferBetweenBranches: boolean;
  enablePreServiceQuestions: boolean;
  displayPreServiceQuestions: string;
  enableSingleNumberFormat: boolean;
  singleNumberFormat: string;
  enableMobileInterfaceRequeue: boolean;
  personMovementSettings: IPersonMovementSetting;
  ticketStart: number;
  ticketEnd: number;
}
export interface IPersonMovementSetting {
  isEnabled: boolean;
  numberOfCalls: number;
  numberOfPositionsBack: number;
  mobilePositionOnRequeue: number;
  numberOfRequeueCalls: number;
}
export interface IWorkFlowQuestion {
  languageId: string;
  isDefault: boolean;
  question: string;
}

export interface IWorkFlowService {
  languageId: string;
  serviceName: string;
  isDefault: boolean;
}

export interface IWorkFlowServiceRoute {
  id: string;
  type: string;
  group: string;
}

export interface IWorkFlowServiceIcon {
  languageId: string;
  languageName: string;
  url: string;
  isDefault: boolean;
}
export interface IWorkFlowServiceData {
  descriptions: any[];
  id: string;
  serviceNames: IWorkFlowService[];
  serviceIconUrls: IWorkFlowServiceIcon[];
  routing: IWorkFlowServiceRoute;
  surveyTemplate: any;
  ticketTemplate: any;
  acceptWalkins: any;
  acceptAppointments: any;
  appointmentTemplate: AppointmentTemplateDropDown;
  serviceOccur?:ServiceOccur;
  hoursOfOperationId?:string;
  operationalWorkingHours?: IWorkingDaysAndDates;
  isDeleted:boolean;
  }
  export class AppointmentTemplateDropDown {
    id: string;
    templateName: string;
  }

export interface IWorkFlowQueue {
  id: string;
  name: string;
  numberingRule: INumberingfRule;
  averageWaitTime: number;
}
export interface INumberingfRule {
  prefix: string;
  middlefix: string;
  postfix: string;
}
export interface IWorkFlowQuestionData {
  id: string;
  shortName: string;
  type: string;
  typeSetting: any;
  valueOptions: null;
  question: IWorkFlowQuestion[];
  isRequired: boolean;
  isPersonalIdentifier: boolean;
  isPurge: boolean;
  isVisible: boolean;
  isDeleted?:boolean;
}

export interface IWorkFlowServiceQuestionConditionRouteAction {
  actionType: string;
  routingId: string;
  routingType: string;
  color: string;
  group: string;
}

export interface IWorkFlowServiceQuestionConditionRoute {
  id: string;
  conditionName: string;
  condition: string;
  actions: IWorkFlowServiceQuestionConditionRouteAction[];
}

export interface IWorkFlowServiceQuestionData {
  id: string;
  questionSetName: string;
  questions: IWorkFlowQuestionData[];
  conditionRoutings: IWorkFlowServiceQuestionConditionRoute[];
}

export interface IWorkFlowDetail {
  workFlowId: string;
  name: string;
  setting: IWorkFlowSetting;
  preServiceQuestions: IWorkFlowQuestionData[];
  services: IWorkFlowServiceData[];
  questionSets: IWorkFlowServiceQuestionData[];
  queues: IWorkFlowQueue[];
  companyId: string;
  pk?:string;
  appointmentTemplates?: AppointmentTemplate[];
}

export interface IWorkFlowDropdown {
  name: string;
  workFlowId: string;
  services: IServiceDropdown[];
}

export interface IServiceDropdown {
  id: string;
  serviceName: string;
}

export interface IValidation {
  result: boolean;
  message: string;
}

export interface IKioskButtonControlData {
  left: number;
  top: number;
  selected: boolean;
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
  src: ILanguageControl[];
  showIcon: boolean;
  boxRoundCorners: string;
  border: string;
  borderColor: string;
  shadow: boolean;
}

export interface IKioskThankYouControlItemData {
  fontSize: number;
  fontWeight: number | string;
  font: string;
  fontStyle: string;
  text: object;
  visible: boolean;
  value: string;
  type: string;
}

export interface IKioskLanguageControlData {
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
