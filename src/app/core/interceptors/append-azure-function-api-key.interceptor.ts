import {
  HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../services/app-config.service';
import { isAPPConfigURLInRequest } from '../utilities/core-utilities';

@Injectable()
export class AppendAzureFunctionAPIKeyInterceptor implements HttpInterceptor {

  constructor(private appConfigService: AppConfigService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isAPPConfigURLInRequest(request)) { return next.handle(request); }

    request = request.clone({
      setHeaders: { 'x-custom-function-api-key': this.appConfigService.config.CustomFunctionApiKey }
    });
    return next.handle(request);
  }
}
