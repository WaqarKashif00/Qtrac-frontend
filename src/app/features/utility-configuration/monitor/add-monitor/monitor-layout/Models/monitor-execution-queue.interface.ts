
export interface IMonitorExecutionQueue {
  monitorId: string;
  columnOne?:string;
  columnTwo?:string;
  branchId: string;
  companyId: string;
  customerState: string;
  deskName: string;
  personName: string;
  ticketNumber: string;
  isDeleted: boolean;
  queueId: string;
  id: string;
  calledCount: number;
  calledRequeueCount: number;
  sortPosition:number;  
}
