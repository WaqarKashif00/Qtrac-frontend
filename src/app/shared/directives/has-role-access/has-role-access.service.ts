import { Injectable } from '@angular/core';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { IUserAction } from 'src/app/models/common/user-role/add-user-role';
import { RoleActionTypeEnum } from 'src/app/models/enums/role-actions.enum';

@Injectable()
export class HasRoleAccessService{
  constructor(
    private authStateService: AuthStateService,
  ) {
  }

  IsControlBasedOnRoleAccess(role_action_view_name, actionName) {
    if (!this.authStateService.AuthorizationDetails.isAllSystemAccessible) {
      const actionRoles = this.authStateService.AuthorizationDetails.roleActions.find(x => x.viewName ==
        role_action_view_name
      );
      if (!actionRoles) {
        return false;
      }
      if (this.IsActionAccessible(actionRoles, actionName)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  private IsActionAccessible(actionRoles: IUserAction, actionName: string) {
    if (actionName == RoleActionTypeEnum.View) {
      return actionRoles.view;
    }
    if (actionName == RoleActionTypeEnum.AddEdit) {
      return actionRoles.addEdit;
    }
    if (actionName == RoleActionTypeEnum.Delete) {
      return actionRoles.delete;
    }
    if (actionName == RoleActionTypeEnum.Run) {
      return actionRoles.run;
    }
    return true;
  }
}
