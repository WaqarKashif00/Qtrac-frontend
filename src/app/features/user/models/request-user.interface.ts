import { IAgentView } from './agent-view.interface';
import { IBranchTag } from './branch-tag.interface';

export interface IReqUserInfo{
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  password: string;
  branches: IBranchTag[];
  tags: string[];
  isUserInactive: boolean;
  changePasswordInFirstLogin: boolean;
  isAllBranches: boolean;
  isOverride: boolean;
  agentTemplate: IAgentView[];
  isSignedIn: boolean;
}
