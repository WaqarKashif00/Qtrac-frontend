import {
  HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { refreshTokenRequired } from '../utilities/core-utilities';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (refreshTokenRequired(request)) {
      return next.handle(request);

    } else if (this.tokenService.IsRefreshTokenExpired()) {
      this.tokenService.Logout(false);

    } else if (this.tokenService.IsAccessTokenExpired()) {
      return this.tokenService.RefreshToken().pipe(
        switchMap(() => {
          return next.handle(request);
        }));

    } else {
      return next.handle(request);
    }

  }
}
