
export interface IWorkFlowUsedInBranchList {
  id: string;
  workFlowId: string;
  serviceIds: string[];
  isAllServices: boolean;
  branchId:string;
}
