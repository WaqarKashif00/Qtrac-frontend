import { AdvanceRules } from 'src/app/features/work-flow/models/advance-workflow-rules.interface';
import { ICommonDropdown } from './common-dropdown.interface';
import { IServiceDropdown } from './service.dropdown.interface';

export interface IWorkFlowDropdown{
  name: string;
  workFlowId: string;
  services: IServiceDropdown[];
  purposes: string[];
  queues: ICommonDropdown[];
  advanceRules:AdvanceRules[];
}
