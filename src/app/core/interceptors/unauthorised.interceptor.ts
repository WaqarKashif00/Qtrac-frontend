import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpStatusCode } from '../../models/enums/http-status-code.enum';
import { LoadingService } from '../services/loading.service';
import { RouteHandlerService } from '../services/route-handler.service';

@Injectable()
export class UnAuthorizedInterceptor implements HttpInterceptor {

  constructor(
    private readonly routeHandlerService: RouteHandlerService,
    private readonly loadingService: LoadingService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
     .pipe(
        catchError(error => {
          if (error  instanceof HttpErrorResponse && error.status === HttpStatusCode.Forbidden) {
            this.loadingService.hideLoading();
            this.routeHandlerService.RedirectToUnAuthorize();
          }
          return throwError(error);
        })
     );
  }
}
