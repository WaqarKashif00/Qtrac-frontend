import { IDropdown } from 'src/app/models/common/drop-down.interface';

export interface IAgentDetails {
    userId: string;
    userName: string;
    isAgentOnline: boolean;
    templates: IDropdown[];
    branches: IDropdown[];
}
