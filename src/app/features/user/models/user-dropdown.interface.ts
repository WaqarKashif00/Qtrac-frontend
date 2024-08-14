import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { ICompanyDropDown } from 'src/app/models/common/company-dropdown-interface';
import { IBranchTag } from './branch-tag.interface';
import { IRole } from './role.interface';

export interface IUserDropdown {
  roleList: IRole[];
  branchNameList: IBranchTag[];
  agentTemplateList: IAgentDropdown[];
  companyList: ICompanyDropDown[];
}
