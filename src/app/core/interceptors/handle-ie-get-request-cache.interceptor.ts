import {
  HttpEvent, HttpHandler,
  HttpInterceptor,

  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class HandleIEGETRequestCacheInterceptor implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, nextRequest: HttpHandler): Observable<HttpEvent<any>> {
    const transformedRequest = httpRequest.clone({
      headers: httpRequest.headers.set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache')
        .set('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
        .set('If-Modified-Since', '0')
    });

    return nextRequest.handle(transformedRequest);
  }
}
