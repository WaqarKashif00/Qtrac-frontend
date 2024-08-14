import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate, CanActivateChild {
  constructor(
    private tokenService: TokenService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.IsValidRedirect();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.IsValidRedirect();
  }

  private IsValidRedirect(): Observable<boolean> | boolean {
    const accessTokenExpired = this.tokenService.IsAccessTokenExpired();
    const refreshTokenExpired = this.tokenService.IsRefreshTokenExpired();

    if (
      accessTokenExpired &&
      (environment.RefreshTokenNotRequired || refreshTokenExpired)
    ) {
      this.tokenService.Logout(false);
      return false;
    } else if (accessTokenExpired && !refreshTokenExpired) {
      return this.tokenService
        .RefreshToken()
        .pipe(switchMap((response) => of(response != null)));
    }
    return true;
  }
}
