import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { ICompanyDropDown } from 'src/app/models/common/company-dropdown.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';

export interface IUserDropdown{
  companies: ICompanyDropDown[];
  userTypes: IDropdown[];
}
