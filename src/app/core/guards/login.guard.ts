import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import { RouteHandlerService } from '../services/route-handler.service';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate, CanActivateChild {
  constructor(
    private tokenService: TokenService,
    private routeHandlerService: RouteHandlerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.IsValidRedirect();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.IsValidRedirect();
  }

  private IsValidRedirect(): boolean {
    if (!this.tokenService.IsAccessTokenExpired()) {
      this.routeHandlerService.RedirectToHome();
    }
    return true;
  }
}
