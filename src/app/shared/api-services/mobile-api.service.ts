import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';
import { EstimateWaitTime } from '../api-models/mobile-execution/estimate-wate-time';

@Injectable({ providedIn: 'root' })
export class MobileAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.MobileInterfaceBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/mobile-interfaces`);
  }

  Save<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/mobile-interfaces`, data);
  }

  SaveAsDraft<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/mobile-interfaces/draft`, data);
  }

  Get<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/mobile-interfaces/${templateId}`);
  }

  GetDropdownList<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/mobile-interfaces/lookup/list`);
  }

  Delete<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/mobile-interfaces/${templateId}`);
  }

  GetMobileMonitorRequest<T>(companyId: string, branchId: string, requestId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/mobile-monitors?branchId=${branchId}&requestId=${requestId}`);
  }

  GetExternalMobileTemplate<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/mobile-execution/${templateId}`);
  }

  GetExternalEstimateWaitTimeForRequest(companyId: string, branchId: string,requestId: string): Observable<EstimateWaitTime> {
    return this.formService.GetAPICall<EstimateWaitTime>(
      `${this.BaseAPIUrl}/api/external/companies/${companyId}/mobile-execution/requests/${requestId}?branchId=${branchId}`);
  }

  SaveSurveyQuestionAnswers<T, P>(companyId: string, branchId: string, requestId: string, items: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/mobile-monitors/${branchId}/${requestId}/survey-answer`, items);
  }

}
