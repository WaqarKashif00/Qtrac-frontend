import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowserStorageService } from '../services/browser-storage.service';

@Injectable()
export class AppendCurrentPageNameInterceptor implements HttpInterceptor {

  constructor(
    private readonly browserStorageService: BrowserStorageService
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.browserStorageService.CurrentPageViewName) { return next.handle(request); }

    request = request.clone({
      setHeaders: { currentPageViewName: `${this.browserStorageService.CurrentPageViewName}` }
    });

    return next.handle(request);
  }

}
