import { IServiceDropdown } from 'src/app/models/common/service.dropdown.interface';
import { IWorkFlowDropdown } from 'src/app/models/common/workflow-dropdown.interface';

export interface IWorkFlowUsedInBranch {
    id?: string;
    workFlow: IWorkFlowDropdown;
    services: IServiceDropdown[];
    isAllServices: boolean;
}
