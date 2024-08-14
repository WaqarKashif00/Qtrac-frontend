import { ILayoutTemplate} from 'src/app/features/branch-list/models/layout-template.interface';
import { ISchedulerTemplate} from 'src/app/features/branch-list/models/scheduler-template.interface';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { IAgentWorkflow } from './agent-workflows.interface';

export interface IAgentGeneralConfiguration{
  name: string;
  workflow: IAgentWorkflow;
  viewType: IDropdownList;
  mobileTemplate: ILayoutTemplate;
  schedulerTemplate: ISchedulerTemplate;
}
