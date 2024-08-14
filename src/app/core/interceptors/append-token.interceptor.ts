import {
  HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStateService } from '../services/token-state.service';

@Injectable()
export class AppendTokenInterceptor implements HttpInterceptor {

  constructor(private tokenStateService: TokenStateService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${this.tokenStateService.AccessToken}`}
    });
    return next.handle(request);
  }
}
