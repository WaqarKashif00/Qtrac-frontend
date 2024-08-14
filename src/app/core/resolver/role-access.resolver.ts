import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, Resolve, RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { InitialUserDetails } from 'src/app/models/common/initial-user-details.interface';
import { IUserAction } from 'src/app/models/common/user-role/add-user-role';
import { UserAPIService } from 'src/app/shared/api-services/user-api.service';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class RoleAccessResolver
  extends AbstractComponentService
  implements Resolve<any>
{
  constructor(private service: UserAPIService,  private tokenService: TokenService,) {
    super();
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.GetInitialDetails(null,this.authService.UserId).pipe(
      tap((userDetails: InitialUserDetails) => {
        if (this.CheckIfUserDeletedByEmail(userDetails)) {
          this.mediatorService.SetInitialUserDetails(userDetails);
          let actions: IUserAction[] = [];
          userDetails.authorizationData.roleActions
            .filter((x) => x.IsActive)
            .forEach((action) => {
              actions = actions.concat(action.action);
            });
          this.mediatorService.SetUserRoleActions({
            isAllSystemAccessible:
              userDetails.authorizationData.isAllSystemAccessible,
            roleActions: actions,
          });
        } else {
          this.AppNotificationService.NotifyError('Your User account has been removed.');
          this.tokenService.Logout(false);
        }
      })
    );
  }

  CheckIfUserDeletedByEmail(userDetails: InitialUserDetails){
    if (userDetails && userDetails.email){
      if (userDetails.email.includes('_')) {
      const emailAppendedDate = userDetails.email.split('_')[0];
      return (!(Date.parse(emailAppendedDate.split('T')[0])));
      }
    }
    return true;
  }
}
