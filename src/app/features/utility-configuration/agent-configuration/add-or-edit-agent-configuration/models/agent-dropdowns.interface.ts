import { ILayoutTemplate} from 'src/app/features/branch-list/models/layout-template.interface';
import { ISchedulerTemplate } from 'src/app/features/branch-list/models/scheduler-template.interface';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { IAgentWorkflow } from './agent-workflows.interface';
export interface IAgentDropDowns {
  workflows: IAgentWorkflow[];
  agentViewTypes: IDropdownList[];
  timeFormats: IDropdownList[];
  timeDisplayInQueues: IDropdownList[];
  mobileTemplates: ILayoutTemplate[];
  schedulerTemplates: ISchedulerTemplate[];
}
