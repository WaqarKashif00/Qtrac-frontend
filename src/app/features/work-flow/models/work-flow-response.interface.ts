import { RuleSet } from 'src/app/models/common/rule-set.interface';
import { ServiceOccur } from 'src/app/models/common/work-flow-detail.interface';
import { IWorkingDay, ITimeInterval, IWorkingHours } from '../../scheduler/hours-of-operations/hours-of-operation.interface';
import { IBasicWorkFlowRules } from './basic-workflow-behaviour-rule.interface';
import { IGeneralSetting } from './general-settings-interface';
import { AppointmentTemplate, IServiceDescription, IServiceIcon } from './work-flow-request.interface';

export interface PersonMovementSettings {
  isEnabled: boolean;
  numberOfCalls: number;
  numberOfPositionsBack: number;
  mobilePositionOnRequeue: number;
  numberOfRequeueCalls: number;
}

export interface Setting {
  clearTicketsEndOfTheDay: boolean;
  allowTransferBetweenServices: boolean;
  allowTransferBetweenBranches: boolean;
  enablePreServiceQuestions: boolean;
  displayPreServiceQuestions: string;
  enableSingleNumberFormat: boolean;
  singleNumberFormat: NumberingRule;
  enableMobileInterfaceRequeue: boolean;
  personMovementSettings: PersonMovementSettings;
  ticketStart: number;
  ticketEnd: number;
}

export interface Question {
  languageId: string;
  languageName: string;
  isDefault: boolean;
  question: string;
}

export interface Option {
  languageId: string;
  languageName: string;
  isDefault: boolean;
  option: string;
}

export interface PreServiceQuestion {
  id: string;
  type: string;
  shortName: string;
  typeSetting?: any;
  question: Question[];
  isRequired: boolean;
  isPersonalIdentifier: boolean;
  isPurge: boolean;
  isVisible: boolean;
  isDisplay: boolean;
}

export interface ServiceName {
  languageId: string;
  languageName: string;
  serviceName: string;
  isDefault: boolean;
}

export interface Routing {
  id: string;
  type: string;
  group: string;
}

export interface Service {
  appointmentTemplate: appointmentTemplateDropDown;
  id: string;
  serviceNames: ServiceName[];
  descriptions: IServiceDescription[];
  serviceIconUrls: IServiceIcon[];
  routing: Routing;
  surveyTemplate: Template;
  ticketTemplate: Template;
  acceptWalkins: boolean;
  acceptAppointments: boolean;
  averageWaitTime: Number;
  serviceOccur?:ServiceOccur;
  hoursOfOperationId?:string;
  operationalWorkingHours?: IWorkingDaysAndDates;
}

export interface IWorkingDaysAndDates {
  weeklyWorkingDays?: IWorkingHours;
  dailyWorkingDays?: DailyWorkingDays;
  onCustomDateWorkingDays?:IWorkingDate[];
  duringDateRangeWorkingDays?:IWorkingDate[];
}

export class DailyWorkingDays {
  sunday: IWorkingDay;
  mondayToFriday:IWorkingDay;
  saturday: IWorkingDay;
}
export interface IWorkingDate {
  dateId: string; 
  dateText: string; 
  fromDate: Date;
  toDate:Date;
  availableTimeFrames?: ITimeInterval[];
}

export interface Group {
  id: string;
  groupName: string;
  groupColor: string;
  isDeleted?:boolean;
}

export class appointmentTemplateDropDown {
  id: string;
  templateName: string;
}
export class Template {
  id: string;
  type: string;
}
export interface Action {
  actionType: string;
  routingId: string;
  routingType: string;
  group: string;
  color: string;
}

export interface ConditionRouting {
  id: string;
  conditionName: string;
  condition?: RuleSet;
  actions: Action[];
}

export interface QuestionSet {
  id: string;
  routing: Routing;
  questionSetName: string;
  questions: PreServiceQuestion[];
  conditionRoutings: ConditionRouting[];
}
export interface Queue {
  id: string;
  name: string;
  numberingRule: NumberingRule;
  isDeleted?:boolean;
}

export interface NumberingRule {
  prefix: string;
  middlefix: string;
  postfix: string;
}

export interface IWorkFlowResponse {
  generalSetting: IGeneralSetting;
  basicWorkflowRules: IBasicWorkFlowRules;
  workFlowId: string;
  name: string;
  companyId: string;
  isPublished: boolean;
  setting: Setting;
  preServiceQuestions: PreServiceQuestion[];
  services: Service[];
  questionSets: QuestionSet[];
  appointmentTemplates: AppointmentTemplate[];
  queues: Queue[];
  groups: Group[];
}
