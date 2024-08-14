import { IAgentViewForm } from './agent-view.interface';
import { IBranchTag } from './branch-tag.interface';
import { IDropDown } from './drop-down.interface';
import { IRole } from './role.interface';

export interface IUserInfo{
  branchName?: any[];
  roleId?: any;
  roleName?: any;
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  displayName: string;
  email: string;
  alertEmail: string;
  alertPhoneNumber: string;
  role: IRole;
  type: IDropDown;
  password: string;
  branches: IBranchTag[];
  tags: IBranchTag[];
  isUserInactive: boolean;
  changePasswordInFirstLogin: boolean;
  isAllBranches: boolean;
  agentTemplate: IAgentViewForm;
  companyId: string;
}
