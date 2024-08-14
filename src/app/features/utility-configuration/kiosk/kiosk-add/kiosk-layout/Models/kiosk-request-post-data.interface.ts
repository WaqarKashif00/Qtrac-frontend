import { WorkflowEstimateWaitSettings } from 'src/app/models/common/workflow/workflow-estimate-wait-settings.model';
import { EstimateWaitTime } from 'src/app/shared/api-models/mobile-execution/estimate-wate-time';
import { IWorkFlowDetail } from './kiosk-layout-data.interface';
import { IKioskPreviewData } from './kiosk-preview-data.interface';

export interface IKioskRequest {
  kioskData: IKioskPreviewData;
  queueId: string;
  id: string;
  ticketNumber: string;
  workflow: IWorkFlowDetail;
  branchId: string;
  serviceId: string;
  selectedLanguageId: string;
  selectedLanguageName: string;
  requestSourceType: string;
  requestSourceId: string;
  companyId: string;
  mobileInterfaceId: string;
}

export class KioskResponse {
  ticketNumber: string;
  estimatedServingTimeUTCString: string;
  estimatedWaitRangesSettings: WorkflowEstimateWaitSettings;
  estimatedWaitTime: EstimateWaitTime;
  sortPosition: number;
  id: string;
}
