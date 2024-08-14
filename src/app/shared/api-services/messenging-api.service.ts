import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class MessagingAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.MessengingServiceBaseURL;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetNumbers<T>(companyId: string, branchId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/messenging/companies/${companyId}/branch/${branchId}/numbers`);
  }

  GetAssignedNumbers<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/messenging/companies/${companyId}/assigned-numbers`);
  }

  GetUnAssignedNumbers<T>(companyId: string,branchId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/messenging/companies/${companyId}/branches/${branchId}/unassigned-numbers`);
  }

  GetAvailableNumbersForBranch<T>(companyId: string, branchId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/messenging/companies/${companyId}/branches/${branchId}/numbers`);
  }

  SendSMS<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/messenging/companies/${companyId}/send`, data);
  }

  ValidateCredentials<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/messenging/companies/${companyId}/credentials`, data);
  }

}
