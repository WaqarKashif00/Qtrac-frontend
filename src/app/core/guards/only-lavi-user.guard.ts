import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot
} from '@angular/router';
import { UserType } from '../../models/enums/user-type.enum';
import { AuthStateService } from '../services/auth-state.service';
import { RouteHandlerService } from '../services/route-handler.service';

@Injectable({ providedIn: 'root' })
export class OnlyLaviUserGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly authStateService: AuthStateService,
    private readonly routeHandlerService: RouteHandlerService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.ValidateLaviUserAndRedirect();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.ValidateLaviUserAndRedirect();
  }

  private ValidateLaviUserAndRedirect(): boolean {
    const isCustomerUser = this.authStateService.UserType !== UserType.Lavi;
    if (isCustomerUser) {
      this.routeHandlerService.RedirectToUnAuthorize();
      return false;
    } else {
      return true;
    }
  }
}
