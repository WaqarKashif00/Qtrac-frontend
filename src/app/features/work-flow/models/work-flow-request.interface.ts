import { RuleSet } from 'src/app/models/common/rule-set.interface';
import { WorkflowEstimateWaitSettings } from 'src/app/models/common/workflow/workflow-estimate-wait-settings.model';
import { Option, ServiceOccur, SurveyQuestionSet } from '../../../models/common/work-flow-detail.interface';
import { IWorkingDay } from '../../scheduler/hours-of-operations/hours-of-operation.interface';
import { AdvanceRules } from './advance-workflow-rules.interface';
import { IMobileDropdown } from './appointment-rule';
import { IBasicWorkFlowRules, SendSmsTemplate } from './basic-workflow-behaviour-rule.interface';
import { IGeneralSetting } from './general-settings-interface';
import { SupportedLanguage } from './supported-language';
import { IWorkingDaysAndDates } from './work-flow-response.interface';


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
  moveVisitorToFront: boolean;
}

export interface Question {
  languageId: string;
  languageName: string;
  isDefault: boolean;
  question: string;
}

export interface PreServiceQuestion {
  id: string;
  type: string;
  shortName: string;
  typeSetting?: any;
  question: Question[];
  options?: Option[];
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

export interface IServiceDescription {
  languageId: string;
  languageName: string;
  description: string;
  isDefault: boolean;
}

export interface IServiceIcon {
  languageId: string;
  languageName: string;
  url: string;
  isDefault: boolean;
}

export interface Routing {
  id: string;
  type: string;
  group: string;
}

export interface Service {
  id: string;
  serviceNames: ServiceName[];
  descriptions: IServiceDescription[];
  serviceIconUrls: IServiceIcon[];
  routing: Routing;
  surveyTemplate: Template;
  ticketTemplate: Template;
  acceptWalkins: boolean;
  acceptAppointments: boolean;
  appointmentTemplate: AppointmentTemplateDropDown;
  averageWaitTime: Number;
  serviceOccur?:ServiceOccur;
  hoursOfOperationId?:string;
  operationalWorkingHours?: IWorkingDaysAndDates;
}

export class dailyWorkingDays {
  sunday: IWorkingDay;
  mondayToFriday:IWorkingDay;
  saturday: IWorkingDay;
}
export interface Group {
  id: string;
  groupName: string;
  groupColor: string;
  isDeleted?:boolean;
}

export class AppointmentTemplateDropDown {
  id: string;
  templateName: string;
}

export interface Template {
  id: string;
  type: string;
}


export interface Action {
  actionType: string;
  routingId: string;
  routingType: string;
  color: string;
  group: string;
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

export interface Queue {
  id: string;
  name: string;
  numberingRule: NumberingRule;
  isDeleted?:boolean;
}

export interface AppointmentTemplate {
  id: string;
  templateName: string;
  mobileTemplate : IMobileDropdown
  noOfPeopleInTimeSlot: number;
  durationOfEachTimeSlotInMinutes: number;
  bookInBefore: number;
  bookInBeforeType: string;
  bookInAdvance: number;
  bookInAdvanceDays?: number;
  bookInAdvanceType: string;
  earlyCheckInMinutes: number;
  lateCheckInMinutes: number;

  enableConfirmationEmailAfterRegistration: boolean;
  confirmationEmail: EmailTemplate[];
  enableConfirmationSMSAfterRegistration: boolean;
  confirmationSMS: SendSmsTemplate[];

  enableVerificationEmail: boolean;
  verificationEmail: EmailTemplate[];
  enableVerificationSMS: boolean;
  verificationSMS: SendSmsTemplate[];

  enableSendEmailOnAppointmentUpdate: boolean;
  appointmentUpdateEmail: EmailTemplate[];
  enableSendSMSOnAppointmentUpdate: boolean;
  appointmentUpdateSMS: SendSmsTemplate[];

  enableSendEmailOnAppointmentCancel: boolean;
  appointmentCancelEmail: EmailTemplate[];
  enableSendSMSOnAppointmentCancel: boolean;
  appointmentCancelSMS: SendSmsTemplate[];

  enableBCCBranchWithEveryRegistration: boolean;

  reminders: AppointmentTemplateCommunicationReminders[];

  enableQuietHours: boolean;
  from: string;
  to: string;

  isDeleted?:boolean;
}

export interface EmailTemplate extends SupportedLanguage {
  emailSubject: string;
  emailTemplate: string;
}

export interface ReminderTemplate extends SupportedLanguage {
  template: string;
  subject: string;
}

export interface AppointmentTemplateCommunicationReminders {
  remindsVia: string;
  remindsIn: number;
  reminderPeriodType: string;
  reminderTemplate: ReminderTemplate[];
}


export interface NumberingRule {
  prefix: string;
  middlefix: string;
  postfix: string;
}

export interface IWorkFlowRequest {
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
  queues: Queue[];
  appointmentTemplates: AppointmentTemplate[];
  estimateWaitSettings:WorkflowEstimateWaitSettings;
  groups: Group[];
  advanceRules:AdvanceRules[];
  pk?:string;
}

