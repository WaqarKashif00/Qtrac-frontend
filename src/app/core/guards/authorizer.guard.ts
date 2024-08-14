import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';
import { MediatorService } from '../services/mediator.service';
import { RouteHandlerService } from '../services/route-handler.service';

@Injectable({ providedIn: 'root' })
export class AuthorizerGuard implements CanActivate, CanActivateChild {
  constructor(
    private authStateService: AuthStateService,
    private mediatorService: MediatorService,
    private route: RouteHandlerService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.IsValidRedirect(next.data.pageName);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.IsValidRedirect(childRoute.data.pageName);
  }

  private IsValidRedirect(pageName: string): Observable<boolean> | boolean {
    if (!pageName) {
      return true;
    }
    if (this.authStateService.AuthorizationDetails) {
      if (this.authStateService.AuthorizationDetails.isAllSystemAccessible) {
        return true;
      } else {
        const data =
          this.authStateService.AuthorizationDetails.roleActions.find(
            (x) => x.actionName == pageName
          );
        if (data.view) {
          return true;
        } else {
          this.route.RedirectToUnAuthorize();
        }
      }
    } else {
      return true

    }

  }
}
