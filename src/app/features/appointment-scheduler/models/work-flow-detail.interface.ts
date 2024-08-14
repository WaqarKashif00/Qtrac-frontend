
import { IWorkFlowServiceData } from "../../utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface";
import { AppointmentTemplate } from "../../work-flow/models/work-flow-request.interface";

export interface IWorkFlowSetting {
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
  afterRequeueMovePersonPositionInCustomerInterface: number;
  ticketStart: number;
  ticketEnd: number;
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

export interface IHoursOfOperationOffset {
  operation: string;
  timeInMinute: number;
  performAt: string;
  performWhen: string;
}

export interface IServiceIcon {
  languageId: string;
  languageName: string;
  url: string;
  isDefault: boolean;
}

export interface IWorkFlowQueue {
  name: string;
  numberingRule: string;
  averageWaitTime: number;
}

export interface IWorkFlowQuestionData {
  questionId: string;
  questionSetId: string;
  id: string;
  shortName: string;
  type: string;
  maximumLength: number;
  minimumNumber: number;
  maximumNumber: number;
  typeSetting: any;
  valueOptions: null;
  question: IWorkFlowQuestion[];
  isRequired: boolean;
  IsPersonalIdentifier: boolean;
  IsPurge: boolean;
  isVisible: boolean;
  isActive:boolean;
  isDisplay?: boolean;
  isDeleted: boolean;
}

export interface IWorkFlowServiceQuestionConditionRouteAction {
  actionType: string;
  routingId: string;
  routingType: string;
  group?: string;
}

export interface IWorkFlowServiceQuestionConditionRoute {
  conditionName: string;
  condition: string;
  actions: IWorkFlowServiceQuestionConditionRouteAction[];
}
export interface IServiceRoute {
  id: string;
  type: string;
  group: string;
}
export interface IWorkFlowServiceQuestionData {
  id: string;
  questionSetName: string;
  questions: IWorkFlowQuestionData[];
  conditionRoutings: IWorkFlowServiceQuestionConditionRoute[];
  routing: IServiceRoute;
  isDeleted:boolean;
}

export interface IWorkFlowDetail {
  globalQuestion: any;
  surveyQuestions: any;
  workFlowId: string;
  name: string;
  setting: IWorkFlowSetting;
  preServiceQuestions: IWorkFlowQuestionData[];
  services: IWorkFlowServiceData[];
  questionSets: IWorkFlowServiceQuestionData[];
  queues: IWorkFlowQueue[];
  companyId: string;
  appointmentTemplates: AppointmentTemplate[];
}

export const Routing = {
  Questions: 'Questions',
  Queue: 'Queue',
  NoQueue: 'No Queue',
  Confirmation: 'Confirmation',
  FloridaError: 'Florida-error'
};
