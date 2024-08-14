import { IMobileHoursOfOperation } from "./mobile-hours-of-operation-model.interface";
import { IMobileLayoutData } from "./mobile-layout-data.interface";
import { IMobileWorkFlowDetail } from "./mobile-work-flow-detail.interface";

export interface IMobileExecutionData {
    mobileLayoutData: IMobileLayoutData;
    workflow: IMobileWorkFlowDetail;
    hoursOfOperation: IMobileHoursOfOperation;
}
