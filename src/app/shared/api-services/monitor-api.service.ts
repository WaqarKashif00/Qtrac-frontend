import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class MonitorAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.MonitorTemplateBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/monitor-templates`);
  }

  Save<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/monitor-templates`, data);
  }

  SaveAsDraft<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/monitor-templates/draft`, data);
  }

  Get<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/monitor-templates/${templateId}`);
  }

  GetDropdownList<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/monitor-templates/lookup/list`);
  }

  GetExecutionTemplate<T>(companyId: string, branchId: string, deviceId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/branches/${branchId}/monitor-executions/template/?deviceId=${deviceId}&companyId=${companyId}`);
  }

  GetExecutionQueues<T>(companyId: string, branchId: string, monitorId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/branches/${branchId}/monitor-executions/execution-queues?companyId=${companyId}&monitorId=${monitorId}`);
  }

  Delete<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/monitor-templates/${templateId}`);
  }
  GetToken<T>(deviceId:string, branchId?:string): Observable<T>{
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/branches/${branchId}/monitor-executions/deviceid=${deviceId}`)
  }

}
