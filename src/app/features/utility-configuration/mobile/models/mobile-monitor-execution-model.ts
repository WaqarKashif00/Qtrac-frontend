import { WorkflowEstimateWaitSettings } from "src/app/models/common/workflow/workflow-estimate-wait-settings.model";

export class MobileMonitorRequest {
    id: string;
    requestId: string;
    type: string;
    pk: string;

    queueId: string;
    branchId: string;
    companyId: string;
    workflowId: string;
    ticketNumber: string;
    languageId: string;
    serviceId: string;

    preServiceQuestions: Question[];
    serviceQuestions: Question[];
    surveyQuestions: Question[];

    customerState: CustomerState;
    AgentId: string;
    AgentName: string;
    Desk: string;

    requestTimeUTC: Date;
    sortPosition: string;

    estimatedServingTimeUTCString: string;
    estimatedWaitRangesSettings: WorkflowEstimateWaitSettings;

    _etag?: string;
    ttl?: number;
    isDeleted: boolean;

    selectedLanguageId: string;
    requestSourceType: string;
    requestSourceId: string;
}

export enum CustomerState {
    WAITING = 'WAITING',
    CALLED = 'CALLED',
    SERVING = 'SERVING',
    SERVED = 'SERVED'
}

export const ButtonIndexes = {
    TicketNumberIndex: 0,
    PlaceInLine: 1,
    EstimatedWait: 2,
    CalledMessage: 3,
    CalledByDynamicMessageIndex: 4,
};

export class Question {
  questionId: string;
  questionText?: string;
  questionType: any;
  answer: any;
}
