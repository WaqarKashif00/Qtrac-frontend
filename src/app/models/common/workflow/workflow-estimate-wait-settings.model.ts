import { EstimateWaitTimeMessageRange } from "./workflow-estimate-wait-custom-range.model";

export class WorkflowEstimateWaitSettings {
  allowCalculateEstimateWaitTime: boolean;
  isIncludeAppointmentsIntoConsiderations: boolean;
  defaultRange: number;
  idleTimeBetweenServices: number;
  customRangesForTimeDisplayMessages: EstimateWaitTimeMessageRange[]
}
