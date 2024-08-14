import { IHoursOfOperation, IWorkingHours } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';
import { AdvanceRules } from 'src/app/features/work-flow/models/advance-workflow-rules.interface';
import { IBasicWorkFlowRules } from 'src/app/features/work-flow/models/basic-workflow-behaviour-rule.interface';
import { IGeneralSetting } from 'src/app/features/work-flow/models/general-settings-interface';
import { AppointmentTemplate, IServiceDescription, IServiceIcon } from 'src/app/features/work-flow/models/work-flow-request.interface';
import { IWorkingDaysAndDates } from 'src/app/features/work-flow/models/work-flow-response.interface';
import { RuleSet } from './rule-set.interface';
import { WorkflowEstimateWaitSettings } from './workflow/workflow-estimate-wait-settings.model';


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
  enableDeleteOnRequeue: boolean;
  ticketStart: number;
  ticketEnd: number;
  moveVisitorToFront : boolean;
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
  isDeleted?: boolean;
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
  isDeleted?: boolean;
}

export interface Group {
  id: string;
  groupName: string;
  groupColor: string;
}

export interface ServiceOccur {
  id: string;
  text: string;
  value: string;
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
  isDeleted?:boolean;
}

export interface SurveyQuestionSet {
  id: string;
  questionSetName: string;
  questions: PreServiceQuestion[];
  isDeleted?:boolean;
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

export interface IWorkFlowDetail {
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
  surveyQuestions: SurveyQuestionSet[];
  appointmentTemplates: AppointmentTemplate[];
  advanceRules:AdvanceRules[];
  estimateWaitSettings: WorkflowEstimateWaitSettings;
  queues: Queue[];
  groups: Group[];
}


