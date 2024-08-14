import { IService } from '../../utility-configuration/agent/utility-services/models/workflow-models/workflow-interface';
import { IQueue } from './queue.interface';

export interface IWorkflowDropDown {
  workFlowId: string;
  name: string;
  companyId: string;
  isPublished?: boolean;
  services: IService[];
  queues: IQueue[];
}
