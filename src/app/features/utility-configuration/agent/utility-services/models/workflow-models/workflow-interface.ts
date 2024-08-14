export interface IWorkFlow {
  workFlowId: string;
  name: string;
  setting: ISetting;
  preServiceQuestions: IGlobalQuestion[];
  services: IService[];
  questionSets: IServiceQuestion[];
  queues: IWorkFlowQueue[];
  groups: WorkflowGroup[];
  appointmentTemplates: AppointmentTemplate[];
  companyId: string;
}

export interface AppointmentTemplate {
  id: string;
  templateName: string;

  noOfPeopleInTimeSlot: number;
  durationOfEachTimeSlotInMinutes: number;
  bookInBefore: number;
  bookInBeforeType: string;
  bookInAdvance: number;
  bookInAdvanceDays?: number;
  bookInAdvanceType: string;
  earlyCheckInMinutes: number;
  lateCheckInMinutes: number;
}

export interface WorkflowGroup {
  id: string;
  groupName: string;
  groupColor: string;
  isDeleted?:boolean;
}

export interface ISetting {
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

export interface IGlobalQuestion {
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
  isDisplay?: boolean;
  isDeleted: boolean;
}

export interface IService {
  id: string;
  serviceNames: IServiceName[];
  routing: IServiceRoute;
  hoursOfOperationOffset: IHoursOfOperationOffset[];
  hoursOfOperation: IHoursOfOperationOffset[];
  surveyTemplate: any;
  ticketTemplate: any;
  acceptWalkins: any;
  acceptAppointments: any;
  appointmentTemplate: AppointmentTemplateDropDown;
  isDeleted: boolean;
  averageWaitTime:number;
}
export class AppointmentTemplateDropDown {
  id: string;
  templateName: string;
}

export interface IServiceName {
  languageId: string;
  languageName: string;
  isDefault: boolean;
  serviceName: string;
}
export interface IServiceQuestion {
  id: string;
  questionSetName: string;
  questions: IGlobalQuestion[];
  conditionRoutings: IWorkFlowServiceQuestionConditionRoute[];
  routing: IServiceRoute;
  isDeleted: boolean;
}

export interface IWorkFlowQueue {
  id: string;
  name: string;
  numberingRule: INumberingfRule;
  averageWaitTime: number;
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

export interface IServiceRoute {
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

export interface INumberingfRule {
  prefix: string;
  middlefix: string;
  postfix: string;
}

export interface IWorkFlowServiceQuestionConditionRoute {
  id: string;
  conditionName: string;
  condition: string;
  actions: IWorkFlowServiceQuestionConditionRouteAction[];
}

export interface IWorkFlowServiceQuestionConditionRouteAction {
  actionType: string;
  routingId: string;
  routingType: string;
  color: string;
  group: string;
}
