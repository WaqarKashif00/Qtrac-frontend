import { AADConfig } from './aad-config.interface';
import { LoggerConfig } from './logger-config';
import { ISentryDSNConfiguration } from './sentry-dsn-configuration.interface';

export interface IAppConfig {
  TextToSpeachBlobStoragePath: string;
  AppointmentSchedulerURL: string;
  AzureFunctionBaseAPIUrl: string;
  KioskTemplateBaseAPIUrl: string;
  MobileInterfaceBaseAPIUrl: string;
  SentryDSNConfiguration: ISentryDSNConfiguration;
  BaseAPIUrl: string;
  MonitorTemplateBaseAPIUrl: string;
  FileUploadBaseApi: string;
  locationBaseAPIUrl: string;
  LanguageBaseAPIUrl: string;
  AgentTemplateBaseAPIUrl: string;
  WorkFlowBaseAPIUrl: string;
  DynamicVariablesAPIUrl: string;
  BaseAPIUrlBranch: string;
  UserRoleBaseAPIUrl: string;
  HoursOfOperationBaseAPIUrl: string;
  MessengingServiceBaseURL: string;
  UserBaseAPIUrl: string;
  LanguageTranslateBaseAPIUrl: string;
  LoggerConfig: LoggerConfig;
  AADConfig: AADConfig;
  CustomFunctionApiKey: string;
  ReportingBaseApiUrl: string;
  HomeInterfaceBaseAPIUrl: string;
  GoogleAPIUrl: string;
  GoogleApiKey: string;
  IsOpenQueueInNewTab:boolean;
}


