import { ICompanyDropDown } from 'src/app/models/common/company-dropdown.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { IRole } from '../../user/models/role.interface';
import { IAgentViewForm } from './agent-view.interface';
import { IBranchTag } from './branch-tag.interface';

export interface IUserInfo{
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  displayName: string;
  email: string;
  alertEmail: string;
  alertPhoneNumber: string;
  role: IRole;
  roleName: string;
  type: IDropdown;
  company: ICompanyDropDown;
  password: string;
  branches: IBranchTag[];
  tags: IBranchTag[];
  isUserInactive: boolean;
  changePasswordInFirstLogin: boolean;
  isAllBranches: boolean;
  agentTemplate: IAgentViewForm;
  companyId: string;
}
