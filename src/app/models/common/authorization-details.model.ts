import { IUserAction, IUserRoleActionType } from './user-role/add-user-role';

export interface IAuthorizationDetailsResponse {
    isAllSystemAccessible: boolean;
    roleActions: IUserRoleActionType[];
}

export interface IAuthorizationDetails{
  isAllSystemAccessible: boolean;
  roleActions: IUserAction[];
}
