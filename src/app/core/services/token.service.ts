import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractService } from 'src/app/base/abstract-service';
import { TokenResponse } from 'src/app/models/common/token-response.type';
import { AuthStateService } from './auth-state.service';
import { BrowserStorageService } from './browser-storage.service';
import { RouteHandlerService } from './route-handler.service';
import { TokenStateService } from './token-state.service';

@Injectable({ providedIn: 'root' })
export class TokenService extends AbstractService {
  constructor(
    private httpClient: HttpClient,
    private tokenStateService: TokenStateService,
    private authStateService: AuthStateService,
    private routeHandlerService: RouteHandlerService,
    private browserStorageService: BrowserStorageService
  ) {
    super();
  }

  private PersistAuthenticationTokens(value: TokenResponse) {
    this.browserStorageService.SetAccessToken(value.access_token);
     this.browserStorageService.SetRefreshToken(value.refresh_token);
     this.browserStorageService.SetIdToken(value.id_token);
  }

  public ClearAuthenticationTokens() {
    this.browserStorageService.ClearStorage();
  }

  public Logout(logout:boolean) {
    this.ClearAuthenticationTokens();
    this.routeHandlerService.RedirectToLogin(logout);
    this.tokenStateService.RemoveStateVariables();
    this.authStateService.RemoveStateVariables();
  }

  public RefreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenStateService.RefreshToken;
    return this.httpClient
      .post<TokenResponse>('/refresh-token', { refreshToken })
      .pipe(
        tap((response) => {
          if (response !== undefined && response !== null) {
            this.PersistAuthTokenAndUpdateStateVariables(response);
          }
        })
      );
  }

  public PersistAuthTokenAndUpdateStateVariables(response: TokenResponse) {
    this.PersistAuthenticationTokens(response);
    this.tokenStateService.UpdateStateVariables();
    this.authStateService.UpdateStateVariables();
  }

  public IsAccessTokenExpired(): boolean {
    return !this.IsAuthenticated(this.tokenStateService.AccessToken);
  }

  public IsRefreshTokenExpired(): boolean {
    return true;
    // TODO: Need to check ERROR : Uncaught (in promise): Error: The inspected token doesn't appear to be a JWT.
    return !this.IsAuthenticated(this.tokenStateService.RefreshToken);
  }

  private IsAuthenticated(token: string): boolean {
    return token !== null && token !== undefined && !this.IsTokenExpired(token);
  }

  private IsTokenExpired(token: string): boolean {
    return new JwtHelperService().isTokenExpired(token);
  }
}
