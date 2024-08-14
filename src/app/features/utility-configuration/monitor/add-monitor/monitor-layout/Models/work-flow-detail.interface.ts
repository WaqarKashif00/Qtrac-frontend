
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
    afterRequeueMovePersonPositionInCustomerMobileInterface: number;
    ticketStart: number;
    ticketEnd: number;
  }

export interface IWorkFlowQuestion {
    languageId: string;
    IsDefault: boolean;
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
  }

export interface IWorkFlowServiceData {
    serviceId: string;
    serviceNames: IWorkFlowService[];
    routing: IWorkFlowServiceRoute;
    hoursOfOperation: string;
    surveyTemplate: string;
    ticketTemplate: string;
    acceptWalkings: boolean;
    acceptAppointments: boolean;
  }

export interface IWorkFlowQueue {
    name: string;
    numberingRule: string;
  }

export interface IWorkFlowQuestionData {
    id: string;
    shortName: string;
    type: string;
    maximumLength: number;
    minimumNumber: number;
    maximumNumber: number;
    typeSetting: any;
    valueOptions: null;
    questions: IWorkFlowQuestion[];
    isRequired: boolean;
    isPersonalIdentifier: boolean;
    isPurge: boolean;
  }

export interface IWorkFlowServiceQuestionConditionRouteAction {
    actionType: string;
    routingId: string;
    routingType: string;
  }

export interface IWorkFlowServiceQuestionConditionRoute {
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
    serviceQuestion: IWorkFlowServiceQuestionData[];
    queue: IWorkFlowQueue[];
    pk?:string;
  }
