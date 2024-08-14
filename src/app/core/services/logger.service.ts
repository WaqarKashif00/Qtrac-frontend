import { Injectable } from '@angular/core';
import { Severity } from '@sentry/angular';
import { AbstractService } from 'src/app/base/abstract-service';
import { LogLevel } from 'src/app/models/enums/log-level.enum';
import { AppConfigService } from './app-config.service';
import { SentryService } from './sentry.service';

@Injectable({ providedIn: 'root' })
export class LoggerService extends AbstractService {
  get loggerConfig() {
    return this.appConfigService.config.LoggerConfig;
  }

  constructor(
    private sentryService: SentryService,
    private appConfigService: AppConfigService
  ) {
    super();
  }

  public Debug(arg: string) {
    if (this.loggerConfig.LogLevel <= LogLevel.Debug) {
      this.LogMessageToServer(arg, Severity.Debug);
    }
  }

  public Info(arg: string) {
    if (this.loggerConfig.LogLevel <= LogLevel.Info) {
      this.LogMessageToServer(arg, Severity.Info);
    }
  }

  public Warn(arg: string) {
    if (this.loggerConfig.LogLevel <= LogLevel.Warning) {
      console.warn(arg);
      this.LogMessageToServer(arg, Severity.Warning);
    }
  }

  public Error(arg: any) {
    if (this.loggerConfig.EnableServerErrorLogs) {
      this.sentryService.LogException(arg);
    }
    if (this.loggerConfig.LogLevel <= LogLevel.Error) {
      console.error(arg);
    }
  }

  private LogMessageToServer(arg: string, severity: Severity) {
    if (this.loggerConfig.EnableServerLogs) {
      this.sentryService.LogMessage(arg, severity);
    }
  }
}
