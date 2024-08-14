import {
  HttpEvent, HttpHandler,

  HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError, tap } from 'rxjs/operators';
import { Urls } from 'src/app/mock/mock-url';
import { MockLogic } from 'src/app/mock/mock.logic';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../services/app-config.service';
import { HttpStatusCode } from 'src/app/models/enums/http-status-code.enum';

@Injectable()
export class HttpMockInterceptor implements HttpInterceptor {

  get BaseAPIUrl() {
    return this.appConfigService.config.BaseAPIUrl;
  }
  constructor(private appConfigService: AppConfigService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.IsMockingNotRequired(request)) {
      return next.handle(request);
    }

    for (const element of Urls) {
      if (request.url === this.BaseAPIUrl + element.url) {
        const myClass = new (MockLogic as any)[element.serviceName]();
        return of(myClass.executeMethod(myClass, element.methodName, request.body))
        .pipe(delay(1));
      }
    }
    return next.handle(request);
  }

  private IsMockingNotRequired(request: HttpRequest<any>) {
    return request.url.includes(`app-config.${environment.name}.json`);
  }
}
