export interface IQueue {
    id: string; // branchId_WorkflowId
    pk: string; //
    customers: Array<IQueuedCustomer>;
    estimatedWaitRangesSettings: any;
    previousCustomers: Array<IQueuedCustomer>;
    isEndofDay?:boolean;
    _ts: number;
  }

  export interface IQueuedCustomer {
    id: string;
    serviceId: string;
    state: CustomerStateInQueue;
    queueId: string;
    estimateWaitTimeISOString: string;
    priority?:number;
  }

  export enum CustomerStateInQueue {
    WAITING = 0,
    CALLED = 1,
  }
