import { AppointmentTemplate } from "src/app/features/work-flow/models/work-flow-request.interface";
import { IWorkingDaysAndDates } from "src/app/features/work-flow/models/work-flow-response.interface";
import { ServiceOccur } from "src/app/models/common/work-flow-detail.interface";
import { IWorkFlowServiceData } from "../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface";

export interface IMobileWorkFlowSetting {
  clearTicketsEndOfTheDay: boolean;
  allowTransferBetweenServices: boolean;
  allowTransferBetweenBranches: boolean;
  enablePreServiceQuestions: boolean;
  displayPreServiceQuestions: string;
  enableSingleNumberFormat: boolean;
  singleNumberFormat: string;
  enableMobileInterfaceRequeue: boolean;
  enableMovePersonAfterCall: boolean;
  movePersonAfterNoOfCalls: number;
  movePersonPosition: number;
  afterRequeueMovePersonPositionInCustomerMobileInterface: number;
  ticketStart: number;
  ticketEnd: number;
}

export interface IMobileWorkFlowQuestion {
  languageId: string;
  IsDefault: boolean;
  question: string;
}

export interface IMobileWorkFlowService {
  languageId: string;
  serviceName: string;
  isDefault: boolean;
}

export interface IMobileWorkFlowServiceRoute {
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

export interface IHoursOfOperationOffset {
  operation: string;
  timeInMinute: number;
  performAt: string;
  performWhen: string;
}

export interface IMobileWorkFlowQueue {
  name: string;
  numberingRule: string;
  averageWaitTime: number;
}

export interface IMobileWorkFlowQuestionData {
  id: string;
  shortName: string;
  type: string;
  maximumLength: number;
  minimumNumber: number;
  maximumNumber: number;
  typeSetting: any;
  valueOptions: null;
  question: IMobileWorkFlowQuestion[];
  isRequired: boolean;
  IsPersonalIdentifier: boolean;
  IsPurge: boolean;
  isVisible: boolean;
  isDisplay?: boolean;
  isDeleted:boolean;
}

export interface IMobileWorkFlowServiceQuestionConditionRouteAction {
  actionType: string;
  routingId: string;
  routingType: string;
  group?: string;
}

export interface IMobileWorkFlowServiceQuestionConditionRoute {
  conditionName: string;
  condition: string;
  actions: IMobileWorkFlowServiceQuestionConditionRouteAction[];
}
export interface IServiceRoute {
  id: string;
  type: string;
  group: string;
}
export interface IMobileWorkFlowServiceQuestionData {
  id: string;
  questionSetName: string;
  questions: IMobileWorkFlowQuestionData[];
  conditionRoutings: IMobileWorkFlowServiceQuestionConditionRoute[];
  routing: IServiceRoute;
  isDeleted: boolean;
}

export interface IMobileWorkFlowSurveyQuestionData {
  id: string;
  questionSetName: string;
  questions: IMobileWorkFlowQuestionData[];
  isDeleted: boolean;
}

export interface IMobileWorkFlowDetail {
  workFlowId: string;
  name: string;
  setting: IMobileWorkFlowSetting;
  preServiceQuestions: IMobileWorkFlowQuestionData[];
  services: IWorkFlowServiceData[];
  questionSets: IMobileWorkFlowServiceQuestionData[];
  queues: IMobileWorkFlowQueue[];
  companyId: string;
  pk?:string;
  appointmentTemplates?: AppointmentTemplate[];
  surveyQuestions: IMobileWorkFlowSurveyQuestionData[]
}
