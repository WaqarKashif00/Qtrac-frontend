import { FormGroup } from '@angular/forms';

export interface IAddUserRole {
  companyId: string;
  roleId: string;
  roleName: string;
  status: boolean;
  homeInterfaceId: string;
  roleAction: Array<IUserRoleActionType>;
  agentTemplates: Array<IAgentTemplate>;
}
export interface IPostUserRoleData {
  companyId: string;
  roleId: string;
  roleName: string;
  status: boolean;
  homeInterfaceId: string;
  roleAction: Array<IUserRoleActionType>;
  agentTemplates: Array<IAgentTemplate>;
}
export interface IPostAgentTemplateData {
  templateCode: string;
  services: string[];
}
export interface IUserRoleActionType {
  actionTypeName: string;
  IsActive: boolean;
  action: Array<IUserAction>;
}

export interface IUserAction {
  actionName: string;
  viewName: string;
  view: boolean;
  addEdit: boolean;
  delete: boolean;
  run: boolean;
  isSelectAll: boolean;
}

export interface IUserRoleFormWrapper {
  form: FormGroup;
  userRole: IAddUserRole;
}

export interface IAgentQueueDropdownList {
  queueName: string;
  queueId: string;
  workflowId?: string;
}

export interface IAgentTemplate {
  templateCode: string;
  templateName: string;
  queues: Array<IAgentQueueDropdownList>;
}

