import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserOptions, captureException, captureMessage, init, Severity } from '@sentry/angular';
import { environment } from 'src/environments/environment';
import { AbstractService } from '../../base/abstract-service';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class SentryService extends AbstractService {
  constructor(private appconfigService: AppConfigService) {
    super();
  }

  public LogMessage(message: string, severity: Severity) {
    this.InitConfiguration();
    captureMessage(message, severity);
  }

  public LogException(error: any | HttpErrorResponse) {
    this.InitConfiguration();
    const extractedError = this.extractError(error) || 'Handled unknown error';
    captureException(extractedError);
  }

  private InitConfiguration() {
    init(this.GetBrowserOptions());
  }

  private GetBrowserOptions(): BrowserOptions {
    const sentryDSNConfiguration = this.appconfigService.config
      .SentryDSNConfiguration;
    return {
      dsn: sentryDSNConfiguration.url,
      environment: environment.name,
      enabled: environment.name !== 'local'
    };
  }

  private extractError(error: any): string | Error {
    if (error && error.ngOriginalError) {
      error = error.ngOriginalError;
    }
    if (typeof error === 'string' || error instanceof Error) {
      return error;
    }
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof Error) {
        return error.error;
      }
      if (error.error instanceof ErrorEvent) {
        return error.error.message;
      }
      if (typeof error.error === 'string') {
        return `Server returned code ${error.status} with body '${error.error}'`;
      }
      return error.message;
    }
    return null;
  }
}
