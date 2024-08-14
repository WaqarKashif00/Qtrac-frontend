import { IWorkFlowUsedInBranchList } from 'src/app/features/branch-list/models/workflow-used-in-branch-list.interface';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { WorkflowEstimateWaitSettings } from 'src/app/models/common/workflow/workflow-estimate-wait-settings.model';
import { IAgentConfiguration } from '../utility-services/models/agent-configurations-models.ts/agent-configurations.interface';
import { IQueue } from '../utility-services/models/agent-signalr/queue.model';
import { IWorkFlow } from '../utility-services/models/workflow-models/workflow-interface';
import { RuleActionNotificationDetails } from './rule-action-notification-details';

export class IMinimiumKioskRequestModel {
  id: string;
  _ts: number;
}
export class IAgentCustomersListItem {
  id: string;
  isNowServing: boolean;
  servingById: string;
  servingByName: string;
  servingAtDesk: string;
  isCtrlSelected: boolean;
  isCalled: boolean;
  calledById: string;
  calledByName: string;
  calledAtDesk: string;
  isGroupContextMenuVisible: boolean;
  isContextMenuVisible: boolean;
  customerId: string;
  statusMessage: string;
  queueId: string;
  queueNumber: string;
  queueName: string;
  groupNames: string[];
  serviceName: string;
  serviceId: string;
  visitType: string;
  ticketNumber: string;
  sortPosition: string;
  utcTime: Date;
  branchTime: string;
  agentQuestions: IQuestion[];
  displayFields: IQuestion[];
  preServiceQuestionLength: Number;
  groups?: string[];
  queue?: string;
  isSelected: boolean;
  isExpanded: boolean;
  utcTimeString?: string;
  servingStartTimeUTCString: string;
  servingStartTimeUTC: Date;
  lastSMSMessage: string;
  lastNote: string;
  calledCount: number;
  calledRequeueCount: number;
  customerState: CustomerState;
  isWalking: boolean;
  isTransfer: boolean;
  isAppointment: boolean;
  appointmentTimeUTCString?: string;
  branchTimeForAppointment: string;
  appointmentId?: string;
  selectedLanguageId: string;
  selectedLanguage: string;
  ruleActionNotificationDetails: RuleActionNotificationDetails;
  priority?: number;
  isDeleted?: boolean;
  _ts?: number
}
export interface IGroups {
  id: string;
  name: string;
  color: string;
}

export interface IQuestion {
  questionId: string;
  questionText: string;
  answer: string;
  isDisplayField: boolean;
  displayFieldPriority: number;
  shortName: string;
  questionType: string;
  IsHyperLink?: boolean;
}

export interface IQueueDetails {
  id: string;
  queueNumber: string;
  count: string;
}
export interface IGroupDetails {
  id: string;
  groupName: string;
  color: string;
  isWorkflowGroup?: boolean;
}

export interface IUser {
  id: string;
  name: string;
}
export interface IMouseInfo {
  x: string;
  y: string;
}

export interface IBranchDetails {
  branch: {
    id: string;
    name: string;
  };
  tags: any[];
}

export interface IPostCustomers {
  agentId: string;
  customerIds: string[];
  branchId: string;
  deskId: string;
  customers: IAgentCustomersListItem[];
}

export interface IResponseCallCustomer {
  agentId: string;
  customerIds: string[];
}

export interface IPostGroup {
  agentId: string;
  id: string;
  groupName: string;
  color: string;
  customers?: string[];
  group: IGroupDetails;
  branchId?: string;
  isCreateAndAssign?: boolean;
}

export interface IPostGroupsMultipleAssignment {
  agentId: string;
  customers: string[];
  groupsIds: string[];
  isDeleteOperation: boolean;
  branchId: string;
}

export interface IResponseGroup {
  agentId: string;
  id: string;
  groupName: string;
  color: string;
  customers?: KioskRequest[];
  group: IGroupDetails;
  branchId?: string;
  isCreateAndAssign?: boolean;
}

export interface IPostAssignGroup {
  agentId: string;
  groupId: string;
  customerIds: string[];
}

export interface IResponseAssignGroup {
  agentId: string;
  groupId: string;
  customerIds: string[];
}

export interface IPostServeCustomer {
  agentId: string;
  deskId: string;
  customerIds: string[];
}

export interface IResponseRemoveCustomerFromGroup {
  agentId: string;
  customerIds: string[];
}

export interface IPostRemoveCustomerFromGroup {
  agentId: string;
  customerIds: string[];
}

export interface IBranchDropdown {
  branchId: string;
  branchName: string;
  defaultLanguageId: string;
  tags: string[];
  desks: Array<{ id: string; title: string; branchId: string }>;
  workflows: IWorkFlowUsedInBranchList[];
}

export interface IBranchDropdownWithTag {
  branch: {
    id: string;
    name: string;
  };
  tags: any[];
  desks: Array<{ id: string; title: string; branchId: string }>;
  branchName: string;
  defaultLanguageId: string;
  workflows: IWorkFlowUsedInBranchList[];
}

export interface ICustomerURL {
  tabName: string;
  url: string;
}

export interface IStationDetails {
  Branch: IBranchDropdown;
  Desk: IDropdown;
  LoginAs: string;
  Template: IAgentDropdown;
  Workflow: IWorkFlow;
  AgentConfiguration: IAgentConfiguration;
  BranchDetails: BranchDetails;
  BranchesWithWorkflows?: IBranchDropdownWithTag[];
}

export class KioskRequest {
  id: string;
  type: string;
  pk: string;

  queueId: string;
  branchId: string;
  workflowId: string;
  ticketNumber: string;
  serviceId: string;

  preServiceQuestions: Question[];
  serviceQuestions: Question[];

  isCalled: boolean;
  calledById: string;
  calledByName: string;
  calledAtDesk: string;

  calledCount: number;
  calledRequeueCount: number;
  calledLog: {
    calledById: string;
    calledByName: string;
    calledAtDesk: string;
    calledTimeUTCString: string;
  }[];

  lastSMSMessage?: string;
  lastNote?: string;

  requestTimeUTC: Date;
  requestTimeUTCString: string;
  sortPosition: string;
  isDeleted: boolean;

  estimatedServingTimeUTCString: string;
  estimatedWaitRangesSettings: WorkflowEstimateWaitSettings;

  servingAgentId: string;
  servingAgentName: string;
  servingStartTimeUTC: string;
  servingDeskId: string;
  servingAtDesk: string;
  selectedLanguageId: string;

  customerState: CustomerState;
  groups: string[];

  isWalking: boolean;
  isTransfer: boolean;
  isAppointment: boolean;
  appointmentTimeUTCString?: string;
  appointmentId?: string;
  ruleActionNotificationDetails?: RuleActionNotificationDetails;
  queue: IQueue;

  // tslint:disable-next-line: variable-name cosmos db document property
  _etag: string;
  // tslint:disable-next-line: variable-name cosmos db document property
  _ts: number;
}

export enum CustomerState {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  SERVING = 'SERVING',
  CANCELEDBYAGENT = 'CANCELEDBYAGENT',
  CANCELEDBYUSER = 'CANCELEDBYUSER',
}
export class VisitorRequest {
  id: string;

  queueId: string;
  branchId: string;
  workflowId: string;
  serviceId: string;
  transferId: string;
  isTransfer: boolean;
  isEdit: boolean;
  transferBy: string;

  preServiceQuestions: Question[];
  serviceQuestions: Question[];

  groups: string[];
  languageCode: string;
}

export class KioskTemplateModel {
  kioskData: KioskExecutionTemplate;
  queueId: string;
  branchId: string;
  id: string;
  workflow: any;
  serviceId: string;
  selectedLanguageId: string;
  selectedLanguageName: string;
  requestSourceType: string;
  requestSourceId: string;
  isTransfer?: boolean;
  transferBy?: string;
  oldRequestId?: string;
  companyId: string;
  mobileInterfaceId: string;
  groups?: string[];
}

export class Question {
  questionId: string;
  questionText?: string;
  questionType: any;
  answer: any;
}

export class QuestionSet {
  questionSetId: string;
  questions: Question[];
}

// export class ServingRequest {
//     id?: string;
//     type: string;
//     pk: string;

//     request: KioskRequest;
//     agentId: string;
//     agentName: string;
//     servingStartTimeUTC: string;
//     isDeleted: boolean;
//     // tslint:disable-next-line: variable-name cosmos db document property
//     _etag?: string;
// }

export class KioskExecutionTemplate {
  designer: KioskDesigner;
  preServiceQuestionPage: KioskExecutionPreServiceQuestionPage;
  serviceQuestion: KioskExecutionPreServiceQuestionPage;
}

export class KioskDesigner {
  WorkFlowId: string;
}

export class KioskExecutionPreServiceQuestionPage {
  items: Array<KioskPanelItemsData>;
}

export class KioskPanelItemsData {
  itemId: string;
  itemText: string;
  itemType: string;
  answer: any;
}

export class BranchDetails {
  companyId: string;
  branchId: string;
  externalBranchId: string;
  branchName: string;
  logoUrlPath: string;
  billingAddress: string;
  countryCode: string;
  stateCode: string;
  city: string;
  smsPhoneNumber: { id: string; phoneNumber: string };
  phoneNumber: string;
  zip: string;
  defaultLanguage?: any;
  supportedLanguages: any[];
  tags: string[];
  friendlyBranchName: string;
  isActive: boolean;
  contactPersonSameAsCompany: boolean;
  contactPerson: {
    firstName: string;
    lastName: string;
    roleInTheCompany: string;
    officeNumber: string;
    extension: string;
    cellPhoneNumber: string;
    emailAddress: string;
  };
  workFlowUsedInBranchList: IWorkFlowUsedInBranchList[];
  additionalSettings: {
    hoursOfOperationId: string;
    timeZone: any;
  };
  sameAsCompany: boolean;
  kiosks?: any[];
  monitors?: any[];
  desks?: any[];
  mobileInterface?: any[];
  advanceSettings: { hoursOfOperationExceptionId: string };
}
