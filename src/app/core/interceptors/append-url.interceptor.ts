import {
  HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppConfigService } from '../services/app-config.service';
import { isAPPConfigURLInRequest } from '../utilities/core-utilities';

@Injectable()
export class AppendURLInterceptor implements HttpInterceptor {

  get BaseAPIUrl() {
    return this.appConfigService.config.BaseAPIUrl;
  }

  constructor(private appConfigService: AppConfigService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (isAPPConfigURLInRequest(request)) { return next.handle(request); }
    if (this.IsExcludedBaseApiURL(request)) { return next.handle(request); }
    request = request.clone({
      url: request.url.replace(request.url, this.BaseAPIUrl + request.url)
    });
    return next.handle(request).pipe(delay(1));
  }

  private IsExcludedBaseApiURL(request: HttpRequest<any>) {
    const workflow = this.appConfigService.config.WorkFlowBaseAPIUrl;
    const branch = this.appConfigService.config.BaseAPIUrlBranch;
    const upload = this.appConfigService.config.FileUploadBaseApi;
    const userRole = this.appConfigService.config.UserRoleBaseAPIUrl;
    const hoursOfOperation = this.appConfigService.config.HoursOfOperationBaseAPIUrl;
    const agentTemplate = this.appConfigService.config.AgentTemplateBaseAPIUrl;
    const user = this.appConfigService.config.UserBaseAPIUrl;
    const languageTranslate = this.appConfigService.config.LanguageTranslateBaseAPIUrl;
    const language = this.appConfigService.config.LanguageBaseAPIUrl;
    const location = this.appConfigService.config.locationBaseAPIUrl;
    const monitorTemplate = this.appConfigService.config.MonitorTemplateBaseAPIUrl;
    const messenging = this.appConfigService.config.MessengingServiceBaseURL;
    const dynamicVariable = this.appConfigService.config.DynamicVariablesAPIUrl;
    const aadToken = 'onmicrosoft.com';
    const kiosk = this.appConfigService.config.KioskTemplateBaseAPIUrl;
    const scheduler = this.appConfigService.config.AppointmentSchedulerURL;
    const mobile = this.appConfigService.config.MobileInterfaceBaseAPIUrl;
    const reporting = this.appConfigService.config.ReportingBaseApiUrl;
    const homeInterface = this.appConfigService.config.HomeInterfaceBaseAPIUrl;
    const AzureFunctionUrl = this.appConfigService.config.AzureFunctionBaseAPIUrl;
    const GoogleApiURL = this.appConfigService.config.GoogleAPIUrl;


    const ExcludedBaseApiURLs = [
      workflow,
      branch,
      upload,
      userRole,
      hoursOfOperation,
      agentTemplate,
      user,
      languageTranslate,
      language,
      location,
      aadToken,
      monitorTemplate,
      kiosk,
      messenging,
      dynamicVariable,
      mobile,
      AzureFunctionUrl,
      scheduler,
      reporting,
      homeInterface,
      GoogleApiURL
    ];
    return ExcludedBaseApiURLs.filter((url) => request.url.includes(url) && url).length > 0;
  }
}
