import { IAuthorizationDetailsResponse } from './authorization-details.model';
import { IAgentDeskSettings } from './user-agent-desk-setting.interface';
import { IUserAgentTemplate } from './user-agent-template.interface';
import { IUserBranchTag } from './user-branch-tag.interface';

export class InitialUserDetails {
  firstName: string;
  lastName: string;
  type: string;
  image: string;
  role: string;
  email: string;
  alertEmail: string;
  alertPhoneNumber: string;
  roleName?: string;
  companyId?: string;
  authorizationData?: IAuthorizationDetailsResponse;
  isOnlineAsAgent: boolean;
  agentDeskSettings: IAgentDeskSettings;
  agentTemplate: IUserAgentTemplate[];
  isAllBranches: boolean;
  branches: IUserBranchTag[];
}
