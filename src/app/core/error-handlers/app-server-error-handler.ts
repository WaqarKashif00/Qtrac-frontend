import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorData } from 'src/app/models/common/error-data.interface';
import { BrowserStorageService } from '../services/browser-storage.service';
import { LoggerService } from '../services/logger.service';
import { AppNotificationService } from '../services/notification.service';
import { HttpStatusCode } from 'src/app/models/enums/http-status-code.enum';
import { TokenService } from '../services/token.service';
import { RouteHandlerService } from '../services/route-handler.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class AppServerErrorsHandler implements ErrorHandler {
  constructor(
    private AapNotificationService: AppNotificationService,
    private loggerService: LoggerService,
    private browserStorageService: BrowserStorageService,
    private tokenService: TokenService,
    private routeHandlerService: RouteHandlerService,
    private loadingService: LoadingService,
    private router: Router,
    private zone: NgZone
  ) { }

  handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpResponseBase) {
      this.HandleServerSideError(error);
    } else {
      this.HandleClientSideError(error);
    }
    this.zone.run(() => this.loadingService.hideLoading());
  }

  private HandleServerSideError(error: HttpErrorResponse) {
    this.loggerService.Error(error);
    const errorData: IErrorData = {
      Message: error.message,
      CurrentURL: error.url,
      StackTrace: JSON.stringify(error.error),
    };
    this.browserStorageService.SetLogError(errorData);
    this.ShowServerErrorResponse(error);
  }

  private ShowServerErrorResponse(error: HttpErrorResponse) {
    if (error.status === HttpStatusCode.NotConnectedToServer) {
      this.AapNotificationService.NotifyError('Not connected to server');
    } else if (error.status === HttpStatusCode.Unauthorized) {
      this.tokenService.Logout(false);
    } else if (error.status === HttpStatusCode.Forbidden) {
      this.zone.run(() => this.routeHandlerService.RedirectToUnAuthorize());
    } else if (error.status === HttpStatusCode.ServerError) {
      this.AapNotificationService.NotifyError('Internal server error.');
    } else if (error.status === HttpStatusCode.BadRequest) {
      this.AapNotificationService.NotifyError(
        this.GetBadRequestErrorMessage(error)
      );
    } else {
      this.AapNotificationService.NotifyError('Someting went wrong.');
    }
  }

  private GetBadRequestErrorMessage(error: HttpErrorResponse): string {
    return error.error && error.error.message ? this.GetMessage(error.error.message) : 'Someting went wrong.';
  }

  private GetMessage(message: any): string {
    if (Array.isArray(message)) {
      return 'Someting went wrong.';
    }
    else {
      return message;
    }
  }

  private HandleClientSideError(error: Error) {
    this.AapNotificationService.NotifyError(error.message);
    this.loggerService.Error(error);
    const errorData: IErrorData = {
      Message: error.message,
      CurrentURL: this.router.url,
      StackTrace: error.stack,
    };
    this.browserStorageService.SetLogError(errorData);
  }
}
