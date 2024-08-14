import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class WorkflowAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.WorkFlowBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows?type=draft`);
  }

  Save<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows`, data);
  }

  SaveAsDraft<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/draft`, data);
  }

  GetPublished<T>(companyId: string, workflowId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${workflowId}?type=data`);
  }

  GetDrafted<T>(companyId: string, workflowId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${workflowId}?type=draft`);
  }

  Delete<T>(companyId: string, workflowId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${workflowId}`);
  }

  GetQueues<T>(companyId: string, workflowId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${workflowId}/queues`);
  }

  GetServices<T>(companyId: string, workflowId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${workflowId}/services`);
  }

  GetDropdownList<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/lookup/list?type=data`);
  }

  GetDraftDropdownList<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/lookup/list?type=draft`);
  }

  GetExternalDraftDropdownList<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/workflows/lookup/list?type=draft`);
  }

  GetDropdownListWithNoLoading<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/lookup/list?type=data`, false);
  }

  AlreadyExists(companyId: string, workflowId: string, workflowName: string): Observable<boolean> {
    return this.formService.GetAPICall<boolean>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${workflowId}/exists?workflowName=${workflowName}`, false);
  }

  CreateCopy<T>(companyId: string, workflowId: string, newWorkflowId: string): Observable<T> {
    return this.formService.PostAPICall<T, any>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${workflowId}/copy/${newWorkflowId}`, null);
  }

  GetExternalPublished<T>(companyId: string, workflowId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/workflows/${workflowId}?type=data`);
  }

  GetBranchWorkflow<T>(companyId: string, workflowId: string): Observable<T[]>{
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${workflowId}/branch-workflow`);
  }

  CheckCustomersInQueue<T>(queueId: string, companyId: string, branchIds: string[]): Observable<boolean>{
    return this.formService.PostAPICall<boolean, string[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/workflows/${queueId}/queue-customer`,
    branchIds);
  }
}
